import express from "express";
import dotenv from "dotenv";
import session from "express-session";

import db from "./config/db.js";
import authRoutes from "./routes/auth.js";
import favouritesRoutes from "./routes/favourites.js";

dotenv.config();

const app = express();
const PORT = 5001;

app.use(express.json());

/* Session configuration */
app.use(session({
  name: "connect.sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24
  }
}));

/* Authentication routes */
app.use("/api/auth", authRoutes);

/* Favourites routes */
app.use("/api/favourites", favouritesRoutes);

/* Tests the MySQL database connection. */
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT DATABASE() AS databaseName");

    res.json({
      message: "Database connected successfully!",
      database: rows[0].databaseName
    });
    
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed."
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CookbookWorld server running on http://localhost:${PORT}`);
});
