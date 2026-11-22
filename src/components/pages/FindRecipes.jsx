import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Search from "../Search";
import FoodList from "../FoodList";
import RecipeDetails from "../RecipeDetails";
import styles from "../../css/findrecipe.module.css";

function FindRecipes() {
   const navigate = useNavigate();

  /* Stores all recipes returned by the search API */
  const [foodData, setFoodData] = useState([]);

  /* Retrieves the current URL location, including the pathname and query parameters */
  const location = useLocation();

  /* Checks whether the recipe was opened from the Favourites page */
  const fromFavourites = location.state?.fromFavourites;
  
  /* Stores the ID of the selected recipe */
  const [foodId, setFoodId] = useState(location.state?.foodId || "");

  /* Stores the search text */
  const [query, setQuery] = useState("");

  /* Stores the current results page */
  const [currentPage, setCurrentPage] = useState(1);

  /* Stores the total number of matching recipes */
  const [totalResults, setTotalResults] = useState(0);

  /* Calculates the number of pages */
  const totalPages = Math.ceil(totalResults / 9);

  /* Stores the ingredients entered by the user */
  const [ingredients, setIngredients] = useState("");

  /* Stores the selected dietary preference */
  const [diet, setDiet] = useState("");

  /* Stores the selected time */
  const [maxReadyTime, setMaxReadyTime] = useState("");

  /* Scroll to the top whenever a recipe is selected or the user returns to search */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [foodId]);

  return (
    <div className={styles.findRecipes}>
       
       {/* Breadcrumb navigation */}
       {/* Hides breadcrumbs when viewing a recipe from Favourites */}
       {!fromFavourites && (
          <div className={styles.breadcrumb}>
             <a href="/">Home</a>
             <a href="./FindRecipes">Find Recipes</a>

             {foodId && (
                <span className={styles.active}>Recipe Details</span>
             )}
          </div>
       )}

        {/* Display recipe details OR search results */}
        {foodId ? (
           <RecipeDetails
              foodId={foodId}
              onBack={() => {
                 /* Returns to Favourites or Search depending on where the recipe was opened */
                 if (fromFavourites) {
                    navigate("/Favourites");
                 } else {
                    setFoodId("");
                 }
              }}
              backLabel={fromFavourites ? "← Back to Favourites" : "← Back to Search"}
              showSaveButton={!fromFavourites}
            />
    
        ) : (

           <>
              {/* Hero section */}
              <section className={styles.hero}>
                 <div className={styles.heroContent}>
                    <h1>Discover Your Next Favourite Meal</h1>
                    <p>
                      Explore delicious recipes, try new flavours
                      and find inspiration for your next meal.
                    </p>
                 </div>
              </section>

              {/* Recipe search */}
              <div className={styles.searchSection}>
                 <h2>What would you like to cook today?</h2>

                 <Search
                     query={query}
                     setQuery={setQuery}
                     ingredients={ingredients}
                     setIngredients={setIngredients}
                     diet={diet}
                     setDiet={setDiet}
                     currentPage={currentPage}
                     setCurrentPage={setCurrentPage}
                     setFoodData={setFoodData}
                     setTotalResults={setTotalResults}
                     maxReadyTime={maxReadyTime}
                     setMaxReadyTime={setMaxReadyTime}
                 />
              </div>

             {/* Recipe search results */}
             <FoodList
                setFoodId={setFoodId}
                foodData={foodData}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
             />
           </>
        )}
   </div>
  );
}

export default FindRecipes;