/* Imports the files needed for the favourites routes */
import express from "express";
import db from "../config/db.js";

const router = express.Router();

/* Retrieves the logged-in user's favourite recipes */
router.get("/", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({
                message: "Please sign in to view your favourites."
            });
        }

        const userId = req.session.user.user_id;

        const [recipes] = await db.query(
            `SELECT *
             FROM saved_recipes
             WHERE user_id = ?
             ORDER BY saved_at DESC`,
            [userId]
        );

        res.json({ recipes });

    } catch (error) {
        console.error("Error retrieving favourites:", error);

        res.status(500).json({
            message: "Unable to retrieve favourite recipes."
        });
    }
});

/* Saves a recipe to the user's favourites */
router.post("/", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({
                message: "Please sign in to save favourites."
            });
        }

        const userId = req.session.user.user_id;
        const {
            spoonacular_recipe_id,
            recipe_title,
            recipe_image
        } = req.body;

        /* Validates the recipe details */
        const recipeId = Number(spoonacular_recipe_id);

        if (
            !Number.isSafeInteger(recipeId) ||
            recipeId <= 0 ||
            !recipe_title?.trim()
        ) {
            return res.status(400).json({
                message: "Valid recipe details are required."
            });
        }

        /* Prevents duplicate favourites */
        const [result] = await db.query(
            `INSERT IGNORE INTO saved_recipes
             (user_id, spoonacular_recipe_id, recipe_title, recipe_image)
             VALUES (?, ?, ?, ?)`,
            [
                userId,
                recipeId,
                recipe_title.trim(),
                recipe_image || null
            ]
        );

        const [recipes] = await db.query(
            `SELECT *
             FROM saved_recipes
             WHERE user_id = ?
             AND spoonacular_recipe_id = ?`,
            [userId, recipeId]
        );

        res.status(result.affectedRows === 0 ? 200 : 201).json({
            message: result.affectedRows === 0
                ? "Recipe is already in your favourites."
                : "Recipe added to favourites.",
            recipe: recipes[0]
        });

    } catch (error) {
        console.error("Error saving favourite:", error);

        res.status(500).json({
            message: "Unable to save recipe to favourites."
        });
    }
});

/* Removes a recipe from the user's favourites */
router.delete("/:id", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({
                message: "Please sign in to manage your favourites."
            });
        }

        const userId = req.session.user.user_id;
        const savedRecipeId = Number(req.params.id);

        if (!Number.isSafeInteger(savedRecipeId) || savedRecipeId <= 0) {
            return res.status(400).json({
                message: "Invalid favourite recipe ID."
            });
        }

        const [result] = await db.query(
            `DELETE FROM saved_recipes
             WHERE saved_recipe_id = ?
             AND user_id = ?`,
            [savedRecipeId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Favourite recipe not found."
            });
        }

        res.json({
            message: "Recipe removed from favourites."
        });

    } catch (error) {
        console.error("Error removing favourite:", error);

        res.status(500).json({
            message: "Unable to remove favourite recipe."
        });
    }
});

export default router;
