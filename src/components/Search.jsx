import { useState, useEffect } from "react";
import styles from "../css/search.module.css";

const URL = "https://api.spoonacular.com/recipes/complexSearch";

/* Retrieves the API key from Vite environment variables */
const API_KEY = import.meta.env.VITE_API_KEY;

export default function Search({
  query,
  setQuery,
  ingredients,
  setIngredients,
  diet,
  setDiet,
  currentPage,
  setCurrentPage,
  setFoodData,
  setTotalResults,
  maxReadyTime,
  setMaxReadyTime
}) {

  /* Stores the search error message */
  const [error, setError] = useState("");

  useEffect(() => {
    /* Checks whether the user has entered any search criteria */
    if (!query.trim() && !ingredients.trim() && !diet) {
      setFoodData([]);
      setTotalResults(0);
      setError("");
      return;
    }

    /* Prevents outdated searches from updating the results */
    let ignore = false;

    async function fetchFood() {
      try {
        setError("");

        /* Calculates the starting position for each page */
        const offset = (currentPage - 1) * 9;

         /* Creates the API search parameters */
        const params = new URLSearchParams({
          number: "9",
          offset: String(offset),
          addRecipeInformation: "true",
          apiKey: API_KEY
        });

        /* Adds the recipe name if provided */
        if (query.trim()) {
          params.set("query", query.trim());
        }

        /* Adds multiple ingredients if provided */
        if (ingredients.trim()) {
          params.set("includeIngredients", ingredients.trim());
        }

        /* Adds the selected dietary preference */
        if (diet) {
          params.set("diet", diet);
        }

        if (maxReadyTime) {
          params.append("maxReadyTime", maxReadyTime);
        }

        /* Makes the API request */
        const res = await fetch(`${URL}?${params.toString()}`);

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Unable to retrieve recipes.");
        }

        if (!ignore) {
          setFoodData(data.results || []);
          setTotalResults(data.totalResults || 0);
        }

      } catch (error) {
        if (!ignore) {
          console.error("Error fetching recipes:", error);
          setFoodData([]);
          setTotalResults(0);
          setError(error.message || "Something went wrong. Please try again.");
        }
      }
    }

    fetchFood();

    /* Stops previous searches from updating the results */
    return () => {
      ignore = true;
    };

  }, [
    query, 
    ingredients,
    diet,
    maxReadyTime,
    currentPage, 
    setFoodData, 
    setTotalResults
  ]);

/* Handles the recipe-name search input */
  const handleChange = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1);
    setError("");
  };

  /* Handles the ingredient search input */
  const handleIngredientChange = (e) => {
    setIngredients(e.target.value);
    setCurrentPage(1);
    setError("");
  };

  /* Handles changes to the cooking time filter */
  const handleTimeChange = (e) => {
    setMaxReadyTime(e.target.value);

  // Starts a new search from page 1
  setCurrentPage(1);
  };

  /* Handles the dietary filter */
  const handleDietChange = (e) => {
    setDiet(e.target.value);
    setCurrentPage(1);
    setError("");
  };

  return (
    <div className={styles.searchContainer}>

      {/* Recipe name search */}
      <input
        className={styles.input}
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for a recipe..."
      />

      {/* Multiple ingredient search */}
      <input
        className={styles.input}
        type="text"
        value={ingredients}
        onChange={handleIngredientChange}
        placeholder="Enter ingredients (e.g. chicken, potatoes, carrots)"
      />

      {/* Filter by time */}
      <select
        className={styles.input}
        value={maxReadyTime}
        onChange={handleTimeChange}
      >     
        <option value="">Any Cooking Time</option>
        <option value="15">15 minutes or less</option>
        <option value="30">30 minutes or less</option>
        <option value="45">45 minutes or less</option>
        <option value="60">60 minutes or less</option>
      </select>

      {/* Dietary preference filter */}
      <select
        className={styles.input}
        value={diet}
        onChange={handleDietChange}
      >
        <option value="">All diets</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="vegan">Vegan</option>
        <option value="gluten free">Gluten-free</option>
        <option value="ketogenic">Ketogenic</option>
        <option value="pescetarian">Pescetarian</option>
      </select>

      {/* Displays the error message */}
      {error && (
        <p className={styles.error}>
          {error}
        </p>
      )}

    </div>
  );
}