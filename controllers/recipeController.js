import Recipe from "../models/Recipe.js";
import cloudinary from "../utils/cloudinaryConfig.js";


// Function for adding the recipe
export const addRecipe = async (req, res) => {
    const { recipeBy, recipeName, ingredients, cookingInstructions, cookingTime, cuisineType, dishCategory } = req.body;

    try {
        // Validation to check all the fields are required and no field is empty
        if (!recipeBy.userId || !recipeBy.userName || !recipeName || !ingredients || !cookingInstructions || !cookingTime || !cuisineType || !dishCategory) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validation to check recipe image is presnet 
        if (!req.file) {
            return res.status(400).json({ message: "Recipe image required" });
        }

        // Upload the recipe image in cloudinary
        const recipeImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'recipes' },
                (error, result) => {
                    if (error) {
                        reject(new Error("Cloudinary upload failed"));
                    } else {
                        resolve(result);
                    }
                }
            );
            stream.end(req.file.buffer);
        })

        // Creating a new instance of the Recipe model with given data
        const newRecipe = new Recipe({
            recipeBy: {
                userId: recipeBy.userId,
                userName: recipeBy.userName,
            },
            recipeName: recipeName,
            ingredients: ingredients.split(",").map((item) => item.trim()),
            cookingInstructions: cookingInstructions.split(",").map((item) => item.trim()),
            cookingTime: cookingTime,
            cuisineType: cuisineType,
            dishCategory: dishCategory,
            recipeImage: recipeImage.secure_url,
        })

        //   Save the data into database
        await newRecipe.save();

        //    Send a response back to the client after save the data
        res.status(201).json({
            message: "Recipe added successfully",
            recipe: newRecipe,
        })

    } catch (error) {
        // Handle the error during inserting data
        res.status(500).json({
            message: "An error occurred during inserting recipe",
            error: error.message,
        });
    }
};


// Function to show all recipes to the client
export const showAllRecipe = async (req, res) => {
    try {
        // Fetch all the recipes available in the database
        const recipes = await Recipe.find();

    //    Check the recipes are available if there is no recipes it sends an error message to the client
        if (!recipes.length) {
            res.status(400).json({ message: "No recipes found" });
        }

        // If recipes available send a response data to the client
        res.status(200).json({ recipes });

    } catch (error) {
        // Handle the error during fecthing all the recipes
        res.status(500).json({
            message: "An error occurred during fetching recipes",
            error: error.message,
        });
    }
};

// Function to fetch the recipes by id
export const recipeById = async (req, res) => {
    try {

        // Find the recipe by id in the database
        const recipe = await Recipe.findById({ _id: req.params.id });

        // Check the recipe is available if not then send an error message to the client
        if (!recipe) {
            res.status(400).json({ message: "No recipes found" });
        }

        // If recipe available send the response data to the client
        res.status(200).json(recipe);
    } catch (error) {
        // Handle the error during fetching recipe by id
        res.status(500).json({
            message: "An error occurred during fetching my recipes",
            error: error.message,
        })
    }
}

// Function to find recipes by user id
export const myRecipes = async (req, res) => {
    const userId= req.query.userId;
    try {
        // Fetch the recipes by user id
        const myRecipes = await Recipe.find({ "recipeBy.userId": userId });

        // Check the recipes available if not then return the error message to the user
        if (!myRecipes.length) {
            return res.status(400).json({ message: "No recipes found" });
        }

        // If the recipes avaialbe then return the response data to the user
        res.status(200).json({ myRecipes });
    } catch (error) {
        // Handle the error occurred druing fetching recipes by user id
        res.status(500).json({
            message: "An error occurred during fetching my recipes",
            error: error.message,
        })
    }
}

// Function to search recipes
export const searchRecipes = async (req, res) => {
    try {
        // Extract the search key
        const key = req.params.key;

        // Find the recipes in the database by search key
        const recipes = await Recipe.find({
            "$or": [
                { "recipeBy.userName": { $regex: key, $options: "i" } },
                { recipeName: { $regex: key, $options: "i" } },
                { ingredients: { $regex: key, $options: "i" } },
                { cuisineType: { $regex: key, $options: "i" } },
                { dishCategory: { $regex: key, $options: "i" } },
            ]
        });

        // Check the recipes is available if not then return the error message to the client
        if (!recipes.length) {
            return res.status(400).json({ message: "No recipes found" });
        }

        // If available then return the response data to the client
        res.status(200).json({ recipes });
    } catch (error) {
        // Handle the error during searching the recipes on the database
        res.status(500).json({
            message: "An error occurred during search",
            error: error.message,
        });
    }
}
