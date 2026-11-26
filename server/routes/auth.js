/* Imports the files needed for the authorization component */
import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import db from "../config/db.js";

const router = express.Router();

/* Registration */
router.post("/register", async (req, res) => {
  try {
    /* Retrieves registration details and security question information */
   const {
      name,
      email,
      password,
      securityQuestion,
      securityAnswer
    } = req.body;

    /* Validate registration details */
    if (
      !name?.trim() || 
      !email?.trim() || 
      !password ||
      !securityQuestion?.trim() ||
      !securityAnswer?.trim()
    ) {
      return res.status(400).json({
        message: "Please complete all fields."
      });
    }

    /* Validates the password length*/
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters."
      });
    }

    /* Ensures the selected question is one offered by the registration form */
    const allowedQuestions = [
      "What was the name of your first school?",
      "What was the name of your first pet?",
      "What city were you born in?",
      "What was your childhood nickname?"
    ];

    if (!allowedQuestions.includes(securityQuestion)) {
      return res.status(400).json({
        message: "Please select a valid security question."
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

    /* Hashes the security answer before storing it */
    const securityAnswerHash = await bcrypt.hash(
       securityAnswer.trim().toLowerCase(),
       12
    );

    /* Saves the account details and security question */
    const [result] = await db.execute(
      `INSERT INTO users
       (first_name, last_name, email, password_hash,
        security_question, security_answer_hash)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        cleanEmail,
        passwordHash,
        securityQuestion,
        securityAnswerHash
      ]
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



/* Update the current user's security question and answer */
router.put("/security-question", async (req, res) => {
  try {
    /* Check whether the user is logged in */
    if (!req.session.user) {
      return res.status(401).json({
        message: "Please log in to update your security settings."
      });
    }

    const userId = req.session.user.user_id;

    /* Retrieve the current password and new security details */
    const {
      currentPassword,
      securityQuestion,
      securityAnswer
    } = req.body;

    /* Validate all required information */
    if (
      !currentPassword ||
      !securityQuestion?.trim() ||
      !securityAnswer?.trim()
    ) {
      return res.status(400).json({
        message: "Please complete all security fields."
      });
    }

    /* List the approved security questions */
    const allowedQuestions = [
      "What was the name of your first school?",
      "What was the name of your first pet?",
      "What city were you born in?",
      "What was your childhood nickname?"
    ];

    /* Ensure the selected question is valid */
    if (!allowedQuestions.includes(securityQuestion)) {
      return res.status(400).json({
        message: "Please select a valid security question."
      });
    }

    /* Retrieve the user's current password hash */
    const [users] = await db.execute(
      "SELECT password_hash FROM users WHERE user_id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User account not found."
      });
    }

    /* Verify the user's current password */
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      users[0].password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Your current password is incorrect."
      });
    }

    /* Hash the new security answer before storing it */
    const securityAnswerHash = await bcrypt.hash(
      securityAnswer.trim().toLowerCase(),
      12
    );

    /* Save the updated security question and answer */
    await db.execute(
      `UPDATE users
       SET security_question = ?,
           security_answer_hash = ?
       WHERE user_id = ?`,
      [
        securityQuestion,
        securityAnswerHash,
        userId
      ]
    );

    res.json({
      message: "Security settings updated successfully!"
    });

  } catch (error) {
    console.error("Security question update error:", error);

    res.status(500).json({
      message: "Unable to update your security settings."
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

/* Retrieves the security question for password recovery */
router.post("/forgot-password/security-question", async (req, res) => {
  try {
    const { email } = req.body;

    /* Validate the email address */
    if (!email?.trim()) {
      return res.status(400).json({
        message: "Please enter your email address."
      });
    }

    /* Find the account using the email address */
    const [users] = await db.execute(
      `SELECT security_question
       FROM users
       WHERE email = ?`,
      [email.trim().toLowerCase()]
    );

    /* Check whether the account exists */
    if (users.length === 0) {
      return res.status(404).json({
        message: "No account was found with that email address."
      });
    }

    /* Check whether the account has a security question */
    if (!users[0].security_question) {
      return res.status(400).json({
        message: "This account has not set up a security question."
      });
    }

    /* Return the account's security question */
    res.json({
      securityQuestion: users[0].security_question
    });

  } catch (error) {
    console.error("Password recovery question error:", error);

    res.status(500).json({
      message: "Unable to retrieve the security question."
    });
  }
});


/* Verifies the security answer before allowing a password reset */
router.post("/forgot-password/verify-answer", async (req, res) => {
  try {
    const { email, securityAnswer } = req.body;

    /* Validate the submitted information */
    if (!email?.trim() || !securityAnswer?.trim()) {
      return res.status(400).json({
        message: "Please enter your security answer."
      });
    }

    /* Retrieve the account's security answer hash */
    const [users] = await db.execute(
      `SELECT user_id, security_answer_hash
       FROM users
       WHERE email = ?`,
      [email.trim().toLowerCase()]
    );

    if (
      users.length === 0 ||
      !users[0].security_answer_hash
    ) {
      return res.status(400).json({
        message: "Unable to verify your security answer."
      });
    }

    /* Compare the submitted answer with the stored hash */
    const answerMatch = await bcrypt.compare(
      securityAnswer.trim().toLowerCase(),
      users[0].security_answer_hash
    );

    if (!answerMatch) {
      return res.status(400).json({
        message: "Your security answer is incorrect."
      });
    }

    /* Generate a secure, temporary password reset token */
    const resetToken = crypto.randomBytes(32).toString("hex");

    /* Store only the token hash in the session */
    req.session.passwordReset = {
      userId: users[0].user_id,
      tokenHash: crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex"),
      expiresAt: Date.now() + 10 * 60 * 1000
    };

    res.json({
      message: "Security answer verified successfully!",
      resetToken
    });

  } catch (error) {
    console.error("Security answer verification error:", error);

    res.status(500).json({
      message: "Unable to verify your security answer."
    });
  }
});

/* Resets the user's password after security verification */
router.post("/forgot-password/reset-password", async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;

    /* Check that all required information was provided */
    if (!resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Please complete all password fields."
      });
    }

    /* Check that both passwords match */
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "The passwords do not match."
      });
    }

    /* Require a minimum password length */
    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Your password must be at least 8 characters long."
      });
    }

    /* Retrieve the temporary reset session */
    const passwordReset = req.session.passwordReset;

    if (!passwordReset || Date.now() > passwordReset.expiresAt) {
      delete req.session.passwordReset;

      return res.status(400).json({
        message: "Your password reset session has expired. Please start again."
      });
    }

    /* Hash the submitted token for comparison */
    const submittedTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    /* Confirm that the submitted token matches the session token */
    if (submittedTokenHash !== passwordReset.tokenHash) {
      return res.status(400).json({
        message: "Invalid password reset session. Please start again."
      });
    }

    /* Hash the new password before saving it */
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    /* Update the user's password in the database */
    await db.execute(
      "UPDATE users SET password_hash = ? WHERE user_id = ?",
      [hashedPassword, passwordReset.userId]
    );

    /* Remove the temporary reset session so it cannot be reused */
    delete req.session.passwordReset;

    req.session.save((error) => {
      if (error) {
        console.error("Password reset session error:", error);

        return res.status(500).json({
          message: "Password was updated, but session cleanup failed. Please try logging in."
        });
      }

      res.json({
        message: "Your password has been reset successfully."
      });
    });

  } catch (error) {
    console.error("Password reset error:", error);

    res.status(500).json({
      message: "Unable to reset your password."
    });
  }
});

export default router;
