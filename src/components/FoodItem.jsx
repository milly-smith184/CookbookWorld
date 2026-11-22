import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { FaHeart } from "react-icons/fa";
import styles from "../css/fooditem.module.css";

export default function FoodItem({ food, setFoodId }) {
  const navigate = useNavigate();

  /* Retrieves the currently logged-in user's information */
  const { user } = useContext(AuthContext);

  /* Tracks whether the recipe is currently being saved */
  const [isSaving, setIsSaving] = useState(false);

  /* Tracks whether the recipe has been saved */
  const [isSaved, setIsSaved] = useState(false);

  /* Stores the message displayed after attempting to save a recipe */
  const [saveMessage, setSaveMessage] = useState("");

  /* Handles saving a recipe from the search results */
  const handleSave = async () => {

    /* Redirects logged-out users to Sign In */
    if (!user) {
       navigate("/SignIn", {
          state: {
             returnTo: "/FindRecipes",
             returnState: {
                foodId: food.id,
                saveRecipe: true
             }
          }
       });
       
       return;
    }

    try {

    /* Clears any previous message */
    setSaveMessage("");

    /* Indicates that the recipe is being saved */
    setIsSaving(true);

    /* Sends a request to save the recipe */
    const response = await fetch(
       "http://192.168.0.18:5001/api/favourites",
       {
          method: "POST",
          credentials: "include",
          headers: {
             "Content-Type": "application/json"
          },

          /* Sends the selected recipe information */
          body: JSON.stringify({
             spoonacular_recipe_id: food.id,
             recipe_title: food.title,
             recipe_image: food.image
          })
       }
    );

    /* Converts the server response into JSON */
    const data = await response.json();

    /* Checks whether the recipe was saved successfully */
    if (!response.ok) {
       throw new Error(data.message || "Unable to save recipe.");
    }

    /* Checks whether the recipe was already saved */
    if (response.status === 200) {

       /* Displays a message for an existing favourite */
       setSaveMessage("Recipe already in favourites.");

    } else {

       /* Displays a message for a newly saved recipe */
       setSaveMessage("Recipe added to favourites.");
    }

       /* Updates the heart to indicate that the recipe is saved */
       setIsSaved(true);

    } catch (error) {

       /* Displays any saving errors */
       console.error("Error saving recipe:", error);
       
       /* Displays an error message on the recipe card */
       setSaveMessage(error.message);

    } finally {

       /* Resets the saving status */
       setIsSaving(false);
    }
};

  return (
    <div className={styles.itemContainer}>

      {/* Recipe image and save button */}
      <div className={styles.imageContainer}>
        <img
          className={styles.itemImage}
          src={food.image}
          alt={food.title}
        />

        {/* Save recipe button */}
        <button
           className={`${styles.heartButton} ${isSaved ? styles.savedHeart : ""}`}
           onClick={handleSave}
           disabled={isSaving}
           aria-label={isSaved ? "Recipe saved" : "Save this recipe"}
        >
           <FaHeart />
        </button>

        {/* Displays the save confirmation or error message */}
        {saveMessage && (
           <p className={styles.saveMessage}>{saveMessage}</p>
        )}
      </div>

      {/* Recipe information */}
      <div className={styles.itemContent}>
        <p className={styles.itemName}>{food.title}</p>

        {/* Displays the recipe score when available */}
        {food.spoonacularScore != null && (
          <p className={styles.rating}>
            ⭐ {Math.round(food.spoonacularScore / 20 * 10) / 10}/5
          </p>
        )}
      </div>

      {/* View recipe button */}
      <div className={styles.buttonContainer}>
        <button
          onClick={() => setFoodId(food.id)}
          className={styles.itemButton}
        >
          View Recipe
        </button>
      </div>

    </div>
  );
}