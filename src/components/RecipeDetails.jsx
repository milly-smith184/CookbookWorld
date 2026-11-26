import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../css/recipedetails.module.css";
import ItemList from './ItemList';

export default function RecipeDetails({ foodId, onBack, backLabel = "← Back to Search", showSaveButton = true}) {
	const [food, setFood] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	const navigate = useNavigate();

	/* Gets information about the current URL */
	const location = useLocation();

    /* Retrieves the currently logged-in user's information from the authentication context */
    const { user } = useContext(AuthContext);

    /* Tracks whether the current recipe has been saved by the user */
    const [isSaved, setIsSaved] = useState(false);

    /* Tracks whether the recipe is currently being saved */
    const [isSaving, setIsSaving] = useState(false);

    /* Stores a message to display after attempting to save the recipe */
    const [saveMessage, setSaveMessage] = useState("");

    /* Handles saving a recipe to the user's favourites */
    const handleSave = async () => {

    /* Checks if a user is logged in */
    if (!user) {

        /* Redirects the user to the Sign In page if they are not logged in */
        navigate("/SignIn", {

            /* Stores the page and recipe information to return to after signing in */
            state: {
                returnTo: "/FindRecipes",
                returnState: {
                    foodId: foodId,
                    saveRecipe: true
                }
            }
        });

        /* Stops the function from executing further */
        return;
    }

    try {

        /* Indicates that the recipe is currently being saved */
        setIsSaving(true);

        /* Clears any previous save message */
        setSaveMessage("");

        /* Sends a POST request to the backend API to save the recipe */
        const response = await fetch("/api/favourites", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },

            /* Converts the recipe details into JSON before sending them to the backend */
            body: JSON.stringify({
                spoonacular_recipe_id: food.id,
                recipe_title: food.title,
                recipe_image: food.image
            })
        });

        /* Converts the server response into a JavaScript object */
        const data = await response.json();

        /* Checks if the request was unsuccessful */
        if (!response.ok) {

            /* Displays the error message returned by the server */
            throw new Error(data.message || "Unable to save recipe.");
        }

        /* Updates the saved status to indicate that the recipe was successfully saved */
        setIsSaved(true);

        /* Stores the success message returned by the server */
        setSaveMessage(data.message);

    } catch (error) {

        /* Displays any error encountered while attempting to save the recipe */
        setSaveMessage(error.message);

    } finally {

        /* Resets the saving status regardless of whether the request succeeded or failed */
        setIsSaving(false);
    }
};

	const URL = `https://api.spoonacular.com/recipes/${foodId}/information`;
	const API_KEY = import.meta.env.VITE_API_KEY;

	useEffect(() => {
		/* Only make the API call when a foodId exists */
		if (!foodId) return;

		/* Displays the loading state when fetching a recipe */
        setIsLoading(true);

		async function fetchFood(){
		    try {
  		       const res = await fetch(`${URL}?apiKey=${API_KEY}`);
  			   const data = await res.json();

               if (!res.ok) {
                  throw new Error(data.message || "Unable to retrieve recipe.");
 			   }

               console.log(data);
               setFood(data);

 		    } catch (error) {
              console.error("Error fetching recipe details:", error);

		    } finally {
              setIsLoading(false);
			}		
		}
		fetchFood();
	}, [foodId]);

	/* Runs the save recipe process when the required information is available */
    useEffect(() => {

    /* Checks that the user is logged in, the recipe has an ID, and the save request was triggered */
    if (!user || !food.id || !location.state?.saveRecipe) return;

    /* Creates an asynchronous function to save the recipe */
    const saveRecipe = async () => {
        try {

            /* Sends a POST request to the favourites API */
            const response = await fetch("/api/favourites", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },

                /* Sends the recipe details to the backend as JSON */
                body: JSON.stringify({
                    spoonacular_recipe_id: food.id,
                    recipe_title: food.title,
                    recipe_image: food.image
                })
            });

            /* Converts the server response into JSON */
            const data = await response.json();

            /* Checks whether the request was successful */
            if (!response.ok) {
                throw new Error(data.message || "Unable to save recipe.");
            }

            /* Updates the saved recipe status */
            setIsSaved(true);

            /* Displays the success message returned by the server */
            setSaveMessage(data.message);

            /* Removes the saveRecipe navigation state to prevent the recipe from being saved again */
            navigate(location.pathname, {
                replace: true,
                state: null
            });

        } catch (error) {

            /* Displays an error message if the recipe could not be saved */
            setSaveMessage(error.message);
        }
    };

    /* Executes the save recipe function */
    saveRecipe();

    /* Re-runs the effect when the user, recipe ID, or navigation state changes */
    }, [user, food.id, location.state]);

	return ( 
	  <div>
		 <div className={styles.recipeCard}> 
		 	<button onClick={onBack}>{backLabel}</button>
		 	<div className={styles.recipeHeader}>
    		   <h1 className={styles.recipeName}>{food.title}</h1>

            {/* Displays the save button only when allowed */}
            {showSaveButton && (
               <button
                  className={styles.saveRecipeButton}
                  onClick={handleSave}
                  disabled={isSaving || isSaved}
                  aria-label={isSaved ? "Recipe saved" : "Save recipe"}
               >
                  <i className={isSaved ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
               </button>
            )}
			{saveMessage && <p>{saveMessage}</p>}
        
            </div>
		 <img className={styles.recipeImage} src={food.image} alt="Image of the recipe that was selected" />
		 
		 {/* Displays the recipe's key details */}
		 <div className={styles.recipeDetails}>

			 {/* Shows the preparation time */}
			 <span> 
			 	<strong>⏲️ Ready In: </strong> {food.readyInMinutes} Minutes
			 </span>

			 {/* Shows the number of servings */}			 
			 <span> 
			 	<strong>👨🏽‍🍳 Servings: </strong>{food.servings}
			 </span>

			 {/* Shows whether the recipe is vegan, vegetarian, or neither */}
			 <span> 
			 	 <strong>🍽️ Dish Type:</strong>{" "}
        		 {food.vegan
            		? "🌿 Vegan"
            		: food.vegetarian
		                ? "🥦 Vegetarian"
		                : "🥩 Non-Vegetarian"} 
          </span>

             {/* Displays the recipe's dietary preferences */}
			 <span>
			 	<strong>Dietary Preferences: </strong>{" "} 
			 	{food.diets?.length > 0 
			 		? food.diets.join(", ")
			 		: "None specified"} 
			 </span>
		 </div>

		 {/* Displays the recipe ingredients */}
		 <h2>Ingredients</h2>
		 <ItemList food={food} isLoading={isLoading}/>

		 {/* Displays the recipe instructions */}
    	 <h2>Instructions</h2>
    	 <div>
    		{ isLoading ? (
    		   <p>Loading instructions...</p>
			) : 
    		   food.analyzedInstructions?.[0]?.steps?.length > 0 ? (
	           <ol className={styles.instructionsList}>
		          {food.analyzedInstructions[0].steps.map((step, index) => (
		             <li key={index}>{step.step}</li>
		          ))}
	           </ol>
    		) : (
               <p>No instructions available for this recipe.</p>
    		)}
		 </div>
		 </div>	  
	 </div>
	);
}