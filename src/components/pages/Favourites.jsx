import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import styles from "../../css/favourites.module.css";

function Favourites() {
    const { user } = useAuth();

    const navigate = useNavigate();

    /* Stores the recipes retrieved from the database */
    const [favourites, setFavourites] = useState([]);

    /* Tracks whether the recipes are still loading */
    const [isLoading, setIsLoading] = useState(true);

    /* Stores any error messages */
    const [error, setError] = useState("");

    /* Opens the selected recipe from the Favourite's page */
	const handleViewRecipe = (recipeId) => {
       navigate("/FindRecipes", {
          state: {
             foodId: recipeId,
             fromFavourites: true
          }
       });
    };

    /* Removes a recipe from the user's favourites */
    const handleRemoveFavourite = async (savedRecipeId) => {
       try {
          // Sends a DELETE request to the backend
          const response = await fetch(
             `http://192.168.0.18:5001/api/favourites/${savedRecipeId}`,
             {
                method: "DELETE",
                credentials: "include"
             }
          );

          const data = await response.json();

          if (!response.ok) {
             throw new Error(data.message || "Unable to remove recipe.");
          }

          /* Removes the selected recipe from the displayed list */
          setFavourites((previousFavourites) =>
             previousFavourites.filter(
                (recipe) => recipe.saved_recipe_id !== savedRecipeId
             )
          );

       } catch (error) {
          console.error("Error removing favourite:", error);
          setError(error.message);
       }
    };

    /* Retrieves the logged-in user's saved recipes from the database */
    useEffect(() => {

       const fetchFavourites = async () => {
          try {
             setIsLoading(true);
                setError("");

                /* Requests the user's saved recipes from the backend */
                const response = await fetch(
                   "http://192.168.0.18:5001/api/favourites",
                   {
                      method: "GET",
                      credentials: "include"
                   }
                );

                const data = await response.json();

                if (!response.ok) {
                   throw new Error(data.message || "Unable to load favourites.");
                }

                /* Displays the API response so we can inspect its structure */
				console.log("Favourites API response:", data);

                /* Updates the favourites list with the returned recipes */
                setFavourites(data.recipes);

          } catch (error) {
             console.error("Error fetching favourites:", error);
             setError(error.message);

          } finally {
               setIsLoading(false);
          }
       };

       fetchFavourites();

    }, [user, navigate]);

return (
   <div className={styles.favouritesContainer}>
      <h1>My Favourites</h1>

      {/* Displays a loading message while retrieving saved recipes */}
      {isLoading && <p>Loading your favourite recipes...</p>}

      {/* Displays an error if the recipes cannot be retrieved */}
      {error && <p>{error}</p>}

      {/* Displays a message when the user has no saved recipes */}
      {!isLoading && !error && favourites.length === 0 && (
         <p>You haven't saved any recipes yet.</p>
      )}

      {/* Displays each saved recipe */}
      <div className={styles.recipeGrid}>
         {favourites.map((recipe) => (
            <div
               className={styles.recipeCard}
               key={recipe.saved_recipe_id}
            >
               <img
                  src={recipe.recipe_image}
                  alt={recipe.recipe_title}
               />

               <h2>{recipe.recipe_title}</h2>

            <div className={styles.recipeButtons}>
               {/* Opens the full recipe details */}
               <button
                  onClick={() => handleViewRecipe(recipe.spoonacular_recipe_id)}
               >
                  View Recipe
               </button>

				{/* Removes the recipe from favourites */}
				<button
    		       onClick={() => handleRemoveFavourite(recipe.saved_recipe_id)}
                >
                   Remove
                </button>
            </div>
            </div>
         ))}
      </div>
   </div>
);

}

export default Favourites;
