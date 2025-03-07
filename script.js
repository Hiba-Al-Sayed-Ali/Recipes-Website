
//Page 2
// ------------------------Photo Section---------------------------
document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("recipe-container");
    const mainTitle = document.getElementById("main-title");
    const description = document.getElementById("description");
    const button = document.getElementById("recipe-btn");

    let currentRecipeIndex = 0;

    async function fetchRecipes() {
        const apiKey = 'eb57c4edb02f476fa04fd2af6d431399';
        const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=10`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (!data.results || data.results.length === 0) {
                console.error("No recipes found.");
                return;
            }

            const recipes = data.results;

            function updateRecipe() {
                const recipe = recipes[currentRecipeIndex];

                if (!recipe || !recipe.image) {
                    console.error("Missing recipe data:", recipe);
                    return;
                }

                console.log("Updating recipe:", recipe);

                container.style.backgroundImage = `url(${recipe.image})`;
                mainTitle.textContent = recipe.title;
                description.textContent = `A delicious recipe for ${recipe.title}. Enjoy cooking!`;

                button.onclick = () => {
                    window.location.href = `https://spoonacular.com/recipes/${recipe.title}-${recipe.id}`;
                };

                currentRecipeIndex = (currentRecipeIndex + 1) % recipes.length;
            }

            updateRecipe(); // Show first recipe immediately
            setInterval(updateRecipe, 10000); // Update every 10 seconds

        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
    }

    fetchRecipes();
});

// ------------------------Video Section---------------------------
const SPOONACULAR_API_KEY = "eb57c4edb02f476fa04fd2af6d431399";
const PEXELS_API_KEY = "pWUWap3rKFArESfWAiqcyQXykcNZ7RlfS5dFZLxsqT3JYWB5TSMuxHjo";

async function fetchRecipesH() {
    const spoonacularURL = `https://api.spoonacular.com/recipes/complexSearch?number=3&addRecipeInformation=true&apiKey=${SPOONACULAR_API_KEY}`;

    try {
        const response = await fetch(spoonacularURL);
        const data = await response.json();

        document.getElementById("recipeContainerH").innerHTML = "";

        if (data.results) {
            data.results.forEach((recipe, index) => {
                fetchRecipeVideoH(recipe, index + 1);
            });
        }
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}

async function fetchRecipeVideoH(recipe, index) {
    const pexelsURL = `https://api.pexels.com/videos/search?query=${recipe.title}&per_page=1`;

    try {
        const response = await fetch(pexelsURL, {
            headers: {
                Authorization: PEXELS_API_KEY
            }
        });
        const videoData = await response.json();

        let videoURL = videoData.videos.length > 0 ? videoData.videos[0].video_files[0].link : null;
        displayRecipeH(recipe, videoURL, index);
    } catch (error) {
        console.error("Error fetching video:", error);
    }
}

function displayRecipeH(recipe, videoURL, index) {
    const container = document.getElementById("recipeContainerH");

    const recipeElement = document.createElement("div");
    recipeElement.classList.add("recipe-item-h");
    recipeElement.id = `recipe-${index}-h`;

    recipeElement.innerHTML = `
        <div class="recipe-left-h">
            <h2>${recipe.title}</h2>
            <p>${recipe.summary.replace(/<[^>]+>/g, '').substring(0, 300)}...</p>
        </div>
        ${videoURL ? `<div class="recipe-right-h">
            <video controls>
                <source src="${videoURL}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>` : "<p>No video available</p>"}
    `;

    container.appendChild(recipeElement);
}

window.onload = fetchRecipesH;



// ------------------------Food Comparison Section---------------------------
document.addEventListener("DOMContentLoaded", function () {
    fetchProduct(1, "737628064502");  
    fetchProduct(2, "1234567890123"); 
});

function fetchProduct(productId, barcode) {
    let apiUrl = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.product) {
                updateProductCard(productId, data.product);
                localStorage.setItem("lastProduct" + productId, JSON.stringify(data.product));
            }
        })
        .catch(error => {
            console.error("Error fetching product:", error);
        });
}

// Update product card dynamically
function updateProductCard(productId, product) {
    document.getElementById(`product-image-${productId}`).src = product.image_url || "https://via.placeholder.com/100";
    document.getElementById(`product-name-${productId}`).textContent = product.product_name || "Unknown Product";
    document.getElementById(`product-ingredients-${productId}`).textContent = "Ingredients: " + (product.ingredients_text || "Not available");
    document.getElementById(`product-nutrition-${productId}`).textContent = "Nutritional Info: " +
        (product.nutriments["energy-kcal_100g"] ? product.nutriments["energy-kcal_100g"] + " kcal per 100g" : "Not available");
}

function searchProduct() {
    let query = document.getElementById("search-input").value.trim();

    if (!query) {
        alert("Please enter a product barcode or name.");
        return;
    }

    // Search API (by name or barcode)
    let searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&json=1`;

    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            if (data.products && data.products.length > 0) {
                let foundProduct = data.products[0]; 
                let barcode = foundProduct.code; 

                fetchProduct(1, barcode);
            } else {
                alert("No product found. Try another search.");
            }
        })
        .catch(error => {
            console.error("Error fetching product:", error);
            alert("Failed to fetch product data.");
        });
}

// ------------------------Recipe slider Section---------------------------
document.addEventListener("DOMContentLoaded", function () {
    fetchRecipes();
    startAutoSlide();
});

function fetchRecipes() {
    let apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s="; 
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                displayRecipes(data.meals.slice(0, 40)); 
            }
        })
        .catch(error => {
            console.error("Error fetching recipes:", error);
        });
}

function displayRecipes(recipes) {
    let slider = document.getElementById("recipe-slider");
    slider.innerHTML = "";

    recipes.forEach(recipe => {
        let recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        
        recipeCard.innerHTML = `
            <div class="image-container">
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            </div>
            <h2>${recipe.strMeal}</h2>
            <p class="steps">Time: Approx 30-45 min</p>
            <p class="steps">Steps: ${recipe.strInstructions.substring(0, 100)}...</p>
        `;

        slider.appendChild(recipeCard);
    });
}

function scrollSlider(direction) {
    let slider = document.getElementById("recipe-slider");
    let scrollAmount = 300; 
    slider.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

function startAutoSlide() {
    setInterval(() => {
        scrollSlider(1);
    }, 5000); 
}

document.getElementById('load-magic-recipe-btn').addEventListener('click', fetchRecipe);


// ------------------------Random Recipe Section---------------------------
// Function to fetch recipe from the API
function fetchRecipe() {
    const apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/random.php";

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const recipe = data.drinks[0];
            const recipeCard = createRecipeCard(recipe);
            document.querySelector('.recipee-section').appendChild(recipeCard);
            // Save to localStorage
            saveRecipeToLocalStorage(recipe);
        })
        .catch(error => console.error('Error fetching recipe:', error));
}

// Function to create the recipe card
function createRecipeCard(recipe) {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipee-card');
    recipeCard.setAttribute('data-id', recipe.idDrink); // Add recipe ID for easy deletion
    const recipeContent = document.createElement('div');
    recipeContent.classList.add('recipee-content');

    const recipeImage = document.createElement('img');
    recipeImage.classList.add('recipee-image');
    recipeImage.src = recipe.strDrinkThumb;
    recipeImage.alt = recipe.strDrink;

    const recipeText = document.createElement('div');
    recipeText.classList.add('recipee-text');

    const recipeName = document.createElement('h2');
    recipeName.classList.add('recipee-name');
    recipeName.textContent = recipe.strDrink;

    const recipeInstructions = document.createElement('p');
    recipeInstructions.classList.add('recipee-instructions');
    recipeInstructions.textContent = recipe.strInstructions;

    const saveButton = document.createElement('button');
    saveButton.classList.add('save-recipee-btn');
    saveButton.textContent = 'Save Recipe';
    
    // Add event listener to save the recipe to local storage
    saveButton.addEventListener('click', () => {
        saveRecipeToLocalStorage(recipe);
        alert('Recipe saved successfully!');  
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-recipee-btn');
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; 

    deleteButton.addEventListener('click', () => {
        deleteRecipeFromLocalStorage(recipe.idDrink);
        recipeCard.remove();  // Remove recipe card from the page
    });

    recipeText.appendChild(recipeName);
    recipeText.appendChild(recipeInstructions);
    recipeText.appendChild(saveButton);

    recipeContent.appendChild(recipeImage);
    recipeContent.appendChild(recipeText);

    recipeCard.appendChild(recipeContent);
    recipeCard.appendChild(deleteButton);  
    return recipeCard;
}

// Function to save the recipe to localStorage
function saveRecipeToLocalStorage(recipe) {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    if (!savedRecipes.some(savedRecipe => savedRecipe.idDrink === recipe.idDrink)) {
        savedRecipes.push(recipe); 
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));  // Save it back to localStorage
    }
}

// Function to delete the recipe from localStorage
function deleteRecipeFromLocalStorage(recipeId) {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    const updatedRecipes = savedRecipes.filter(recipe => recipe.idDrink !== recipeId);
    localStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
}

// Function to load saved recipes when the page loads
function loadSavedRecipes() {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    savedRecipes.forEach(recipe => {
        const recipeCard = createRecipeCard(recipe);
        document.querySelector('.recipee-section').appendChild(recipeCard);
    });
}

window.onload = loadSavedRecipes;

// Page 4
document.addEventListener("DOMContentLoaded", function () {
    startReviewSliderq();

    document.getElementById("contactFormq").addEventListener("submit", function(event) {
        event.preventDefault();
        document.getElementById("responseMessageq").innerText = "Thank you! Your message has been sent.";
    });
});

