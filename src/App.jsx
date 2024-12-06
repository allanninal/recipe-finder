import React, { useState } from "react";
import axios from "axios";

// API Configuration Constants
const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = "https://api.spoonacular.com/recipes/findByIngredients";

// Centralized styles object for component styling
const styles = {
    container: { padding: "20px", maxWidth: "600px", margin: "0 auto" },
    textarea: { width: "100%", marginBottom: "10px", padding: "10px" },
    button: { padding: "10px", cursor: "pointer" },
    error: { color: "red", marginTop: "10px" },
    recipeImage: { width: "100px", height: "100px" },
};

/**
 * Main Application Component
 * @component
 * @description A recipe finder application that allows users to search for recipes
 * based on available ingredients using the Spoonacular API.
 */
function App() {
    // State Management
    const [ingredientList, setIngredientList] = useState(""); // Stores user input ingredients
    const [recipeList, setRecipeList] = useState([]); // Stores fetched recipes
    const [errorMessage, setErrorMessage] = useState(""); // Manages error states

    /**
     * Fetches recipes from Spoonacular API based on provided ingredients
     * @async
     * @function fetchRecipes
     * @description Makes an API call to get recipes matching the input ingredients
     */
    const fetchRecipes = async () => {
        // Input validation
        if (!ingredientList.trim()) {
            setErrorMessage("Please enter some ingredients.");
            return;
        }

        // Reset states before new fetch
        setErrorMessage("");
        setRecipeList([]);

        try {
            // API call using axios
            const { data } = await axios.get(BASE_URL, {
                params: {
                    ingredients: ingredientList,
                    number: 5, // Limit results to 5 recipes
                    apiKey: API_KEY,
                },
            });
            setRecipeList(data || []);
        } catch (error) {
            console.error("Error fetching recipes:", error);
            setErrorMessage("Failed to fetch recipes. Please try again.");
        }
    };

    return (
        <div style={styles.container}>
            <h1>Recipe Finder</h1>
            {/* Ingredient Input Area */}
            <textarea
                rows="5"
                value={ingredientList}
                onChange={(e) => setIngredientList(e.target.value)}
                placeholder="Enter your ingredients (comma-separated)..."
                style={styles.textarea}
            />
            {/* Search Button */}
            <button onClick={fetchRecipes} style={styles.button}>
                Find Recipes
            </button>
            {/* Error Message Display */}
            {errorMessage && <p style={styles.error}>{errorMessage}</p>}
            {/* Recipe Results */}
            <RecipeList recipes={recipeList} />
        </div>
    );
}

/**
 * Recipe List Component
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.recipes - Array of recipe objects to display
 * @description Displays a grid of recipe cards with images and titles
 */
function RecipeList({ recipes }) {
    // Don't render anything if no recipes are available
    if (recipes.length === 0) return null;

    return (
        <div style={{ marginTop: "20px" }}>
            <h3>Suggested Recipes:</h3>
            {/* Recipe Grid Container */}
            <div style={{ 
                display: "flex", 
                flexWrap: "wrap", 
                gap: "20px",
                listStyle: "none",
                padding: 0 
            }}>
                {/* Map through recipes and create recipe cards */}
                {recipes.map((recipe, index) => (
                    <div key={index} style={{
                        textAlign: "center",
                        width: "200px",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}>
                        {/* Recipe Image */}
                        <img 
                            src={recipe.image} 
                            alt={recipe.title} 
                            style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                                borderRadius: "4px",
                                marginBottom: "8px"
                            }} 
                        />
                        {/* Recipe Title */}
                        <strong>{recipe.title}</strong>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
