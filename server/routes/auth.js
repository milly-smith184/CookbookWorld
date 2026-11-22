/* Imports the files needed for the authorization component */
import express from "express";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const router = express.Router();

/* Registration */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    /* Validate registration details */
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        message: "Please complete all fields."
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters."
      });
    }

    /* Split the existing Name field into first and last names */
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts.shift();
    const lastName = nameParts.join(" ");

    const cleanEmail = email.trim().toLowerCase();

    /* Check whether the email is already registered */
    const [existingUser] = await db.execute(
      "SELECT user_id FROM users WHERE email = ?",
      [cleanEmail]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    /* Hash the password before saving it */
    const passwordHash = await bcrypt.hash(password, 12);

    const [result] = await db.execute(
      `INSERT INTO users
       (first_name, last_name, email, password_hash)
       VALUES (?, ?, ?, ?)`,
      [firstName, lastName, cleanEmail, passwordHash]
    );

    /* Automatically log in the newly registered user */
    req.session.regenerate((error) => {
       if (error) {
          return res.status(500).json({
             message: "Unable to start your session."
          });
       }

       req.session.user = {
          user_id: result.insertId,
          first_name: firstName,
          last_name: lastName,
          email: cleanEmail
       };

       req.session.save((saveError) => {
          if (saveError) {
             return res.status(500).json({
                message: "Unable to save your session."
             });
          }

          res.status(201).json({
             message: "Account created successfully!",
             user: req.session.user
          });
        });
      });

  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Unable to create your account."
    });
  }
});


/* Login */
router.post("/login", async (req, res) => {
  try {
    /* Retrieves the login details and Remember me preference */
    const { email, password, rememberMe } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        message: "Please enter your email and password."
      });
    }

    const [users] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email.trim().toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const user = users[0];

    /* Compare the entered password with the stored hash */
    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    /* Regenerate the session after successful authentication */
    req.session.regenerate((error) => {
      if (error) {
        return res.status(500).json({
          message: "Unable to start your session."
        });
      }

      req.session.user = {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      };

      /* Sets the session duration based on the Remember me preference */
      req.session.cookie.maxAge = rememberMe === true
        ? 1000 * 60 * 60 * 24 * 30  /* 30 days when Remember me is selected */
        : null;                     /* Browser-session cookie otherwise */

      req.session.save((saveError) => {
        if (saveError) {
          return res.status(500).json({
            message: "Unable to save your session."
          });
        }

        res.json({
          message: "Login successful!",
          user: req.session.user
        });
      });
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Unable to log in."
    });
  }
});

/* Check current user */
router.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      message: "Not logged in."
    });
  }

  res.json({ user: req.session.user });
});

/* Retrieve current user's profile */
router.get("/profile", async (req, res) => {
  try {
    /* Check whether the user is logged in */
    if (!req.session.user) {
      return res.status(401).json({
        message: "Please log in to view your profile."
      });
    }

    const userId = req.session.user.user_id;

    /* Retrieve profile information from MySQL */
    const [users] = await db.execute(
      `SELECT user_id, first_name, last_name, email,
              contact_number, created_at
       FROM users
       WHERE user_id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User account not found."
      });
    }

    res.json({
      user: users[0]
    });

  } catch (error) {
    console.error("Profile retrieval error:", error);

    res.status(500).json({
      message: "Unable to retrieve profile."
    });
  }
});


/* Update current user's profile */
router.put("/profile", async (req, res) => {
  try {
    /* Check whether the user is logged in */
    if (!req.session.user) {
      return res.status(401).json({
        message: "Please log in to update your profile."
      });
    }

    const userId = req.session.user.user_id;

    const {
      first_name,
      last_name,
      email,
      contact_number
    } = req.body;

    /* Validate required fields */
    if (
      !first_name?.trim() ||
      !last_name?.trim() ||
      !email?.trim()
    ) {
      return res.status(400).json({
        message: "First name, last name and email are required."
      });
    }

    const cleanFirstName = first_name.trim();
    const cleanLastName = last_name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanContact = contact_number?.trim() || null;

    if (
      cleanFirstName.length > 60 ||
      cleanLastName.length > 60 ||
      cleanEmail.length > 254 ||
      (cleanContact && cleanContact.length > 20)
    ) {
      return res.status(400).json({
        message: "One or more fields exceed the allowed length."
      });
    }

    /* Check whether another account uses this email */
    const [existingUsers] = await db.execute(
      `SELECT user_id FROM users
       WHERE email = ? AND user_id != ?`,
      [cleanEmail, userId]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "This email address is already in use."
      });
    }

    /* Update the user's database record */
    await db.execute(
      `UPDATE users
       SET first_name = ?,
           last_name = ?,
           email = ?,
           contact_number = ?
       WHERE user_id = ?`,
      [
        cleanFirstName,
        cleanLastName,
        cleanEmail,
        cleanContact,
        userId
      ]
    );

    /* Retrieve the updated profile */
    const [updatedUsers] = await db.execute(
      `SELECT user_id, first_name, last_name,
              email, contact_number, created_at
       FROM users
       WHERE user_id = ?`,
      [userId]
    );

    const updatedUser = updatedUsers[0];

    /* Update the existing login session */
    req.session.user = {
      user_id: updatedUser.user_id,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      email: updatedUser.email
    };

    res.json({
      message: "Profile updated successfully!",
      user: updatedUser
    });

  } catch (error) {
    console.error("Profile update error:", error);

    res.status(500).json({
      message: "Unable to update profile."
    });
  }
});

/* Logout */
router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        message: "Unable to log out."
      });
    }

    res.clearCookie("connect.sid");

    res.json({
      message: "Logged out successfully."
    });
  });
});

export default router;
