
/* Imports the files needed for the Cards component */
import React, { useState } from 'react';
import CardItem from './CardItem';
import RecipeDetails from './RecipeDetails';
import '../css/Cards.css';

/* Defines the Cards component */
function Cards() {

    /* Stores the ID of the selected recipe */
    const [selectedRecipeId, setSelectedRecipeId] = useState(null);

    /* Stores the recipes displayed on the homepage */
    const recipes = [
        {
            id: 838883,
            src: "images/image1.png",
            text: "Enjoy a refreshing blend of tender Asian-inspired chicken wrapped in crisp, fresh lettuce.",
            label: "Asian Lettuce Wrap Chicken Chopped Salad"
        },
        {
            id: 657243,
            src: "images/image2.png",
            text: "Savoury pumpkin patties blended with crunchy almonds for a delicious, wholesome bite.",
            label: "Pumpkin Almond Burger Patties"
        },
        {
            id: 643674,
            src: "images/image3.png",
            text: "A flavourful twist on classic fried rice, packed with savoury goodness and a delicious blend of textures in every bite.",
            label: "Fried Brown Rice"
        },
        {
            id: 656481,
            src: "images/image4.png",
            text: "A perfectly poached egg served over fresh spinach and juicy tomatoes for a light, wholesome, and delicious meal.",
            label: "Poached Egg With Spinach and Tomato"
        },
        {
            id: 642085,
            src: "images/image5.png",
            text: "A delicious mix of roasted vegetables with simple herbs and seasonings for an easy, flavorful meal.",
            label: "Easy Roasted Vegetables"
        }
    ];

    /* Displays a row of recipe cards */
    const displayRecipes = (recipeList) => (
        <ul className="cards__items">
            {recipeList.map((recipe) => (
                <CardItem
                    key={recipe.id}
                    src={recipe.src}
                    text={recipe.text}
                    label={recipe.label}
                    onClick={() => setSelectedRecipeId(recipe.id)}
                />
            ))}
        </ul>
    );

    return (
        /* Main container for the recipe cards section */
        <div className="cards">

            {/* Displays the section heading */}
            <h1>Explore Quick Recipes</h1>

            {/* Container for the recipe cards */}
            <div className="cards__container">

                {/* Wrapper used to organize the cards */}
                <div className="cards__wrapper">

                    {/* Displays the first two recipe cards */}
                    {displayRecipes(recipes.slice(0, 2))}

                    {/* Displays the remaining three recipe cards */}
                    {displayRecipes(recipes.slice(2))}

                </div>
            </div>

            {/* Displays the selected recipe in a popup */}
            {selectedRecipeId !== null && (
                <div className="recipe-modal-overlay">
                    <div className="recipe-modal-content">
                        <RecipeDetails
                            foodId={selectedRecipeId}
                            onBack={() => setSelectedRecipeId(null)}
                            backLabel="× Exit"
                        />
                    </div>
                </div>
            )}

        </div>
    );
}

/* Exports the Cards component for use in other files */
export default Cards;
