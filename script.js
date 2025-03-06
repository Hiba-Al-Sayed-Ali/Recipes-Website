const container = document.getElementById("recipe-container");
const mainTitle = document.getElementById("main-title");
const description = document.getElementById("description");
const button = document.getElementById("recipe-btn");

let currentRecipeIndex = 0;


// ------------------------Photos Section---------------------------
// Fetch recipes from Spoonacular API
async function fetchRecipes() {
    const apiKey = 'eb57c4edb02f476fa04fd2af6d431399';
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=10`);
        const data = await response.json();
        const recipes = data.results;

        setInterval(() => {
            const recipe = recipes[currentRecipeIndex];
            container.style.backgroundImage = `url(${recipe.image})`;
            mainTitle.innerHTML = recipe.title;
            description.innerHTML = `A delicious recipe for ${recipe.title}. Enjoy cooking!`;
            button.onclick = () => {
                window.location.href = `https://spoonacular.com/recipes/${recipe.title}-${recipe.id}`;
            };
            currentRecipeIndex = (currentRecipeIndex + 1) % recipes.length;
        }, 10000);
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

fetchRecipes();

// ------------------------Videos Section---------------------------
// Fetch food videos from Pexels API
async function fetchPexelsVideo(query) {
    const apiKey = 'pWUWap3rKFArESfWAiqcyQXykcNZ7RlfS5dFZLxsqT3JYWB5TSMuxHjo';
    const url = `https://api.pexels.com/videos/search?query=${query}&per_page=1`;

    const response = await fetch(url, { headers: { 'Authorization': apiKey } });
    const data = await response.json();

    return data.videos[0]?.video_files[0]?.link || null;
}

// Fetch and display recipes
async function fetchRecipeData() {
    const apiKey = 'eb57c4edb02f476fa04fd2af6d431399';
    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=3`;

    const response = await fetch(url);
    const data = await response.json();

    for (const recipe of data.results) {
        recipe.videoUrl = await fetchPexelsVideo(recipe.title);
    }

    displayRecipes(data.results);
}

// Display recipes with videos
function displayRecipes(recipes) {
    const container = document.getElementById('recipes-container');
    container.innerHTML = '';

    recipes.forEach((recipe, index) => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe-item');
        recipeDiv.id = `recipe-${index + 1}`;

        const sampleDescription = "We bring you the best recipes with premium ingredients and creativity.";

        let content = `
            <div class="recipe-left">
                <h2>${recipe.title}</h2>
                <p>${recipe.summary || sampleDescription}</p>
            </div>
            <div class="recipe-right">
                <video controls>
                    <source src="${recipe.videoUrl || 'default_video.mp4'}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
        `;

        if (index === 1) { 
            content = `
                <div class="recipe-left" style="text-align: center;">
                    <h2 style="font-size: 1.8rem;">${recipe.title}</h2>
                    <p>${recipe.summary || sampleDescription}</p>
                </div>
                <div class="recipe-right">
                    <video controls>
                        <source src="${recipe.videoUrl || 'default_video.mp4'}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
            `;
            recipeDiv.style.backgroundColor = '#f0f0f0';
        }

        recipeDiv.innerHTML = content;
        container.appendChild(recipeDiv);
    });
}
fetchRecipeData();

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

// ------------------------Nav Bar---------------------------
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
    // Toggle for nav-links and mobile-menu
    navLinks.classList.toggle('active');  // Toggle for desktop nav
    mobileMenu.classList.toggle('active');  // Toggle for mobile nav
});
