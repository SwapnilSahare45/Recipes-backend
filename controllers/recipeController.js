import Recipe from "../models/Recipe.js";
import cloudinary from "../utils/cloudinaryConfig.js";


// Controller for adding the recipe
export const addRecipe = async (req, res) => {
    const { recipeBy, recipeName, ingredients, cookingInstructions, cookingTime, cuisineType, dishCategory } = req.body;

    try {
        // Validate required fileds
        if (!recipeBy.userId || !recipeBy.userName || !recipeName || !ingredients || !cookingInstructions || !cookingTime || !cuisineType || !dishCategory) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate recipe image
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

        // Save the data
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

        await newRecipe.save();

        res.status(201).json({
            message: "Recipe added successfully",
            recipe: newRecipe,
        })

    } catch (error) {
        res.status(500).json({
            message: "An error occured during inserting recipe",
            error: error.message,
        });
    }
};


// Controller for show all the recipes
export const showAllRecipe = async (req, res) => {
    try {
        // Read all the recipes
        const recipes = await Recipe.find();

        if (!recipes.length) {
            res.status(400).json({ message: "No recipes found" });
        }

        res.status(200).json({ recipes });

    } catch (error) {
        res.status(500).json({
            message: "An error occured during fetching recipes",
            error: error.message,
        });
    }
};


export const recipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById({ _id: req.params.id });
        if (!recipe) {
            res.status(400).json({ message: "No recipes found" });
        }
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({
            message: "An error occured during fetching my recipes",
            error: error.message,
        })
    }
}

// Controller to see own recipes
export const myRecipes = async (req, res) => {
    try {
        const myRecipes = await Recipe.find({ "recipeBy.userId": req.query.userId });

        if (!myRecipes.length) {
            return res.status(400).json({ message: "No recipes found" });
        }

        res.status(200).json({ myRecipes });
    } catch (error) {
        res.status(500).json({
            message: "An error occured during fetching my recipes",
            error: error.message,
        })
    }
}

// Controller to search
export const searchRecipes = async (req, res) => {
    try {
        const key = req.params.key; // Extract the search key
        const recipes = await Recipe.find({
            "$or": [
                { "recipeBy.userName": { $regex: key, $options: "i" } },
                { recipeName: { $regex: key, $options: "i" } },
                { ingredients: { $regex: key, $options: "i" } },
                { cuisineType: { $regex: key, $options: "i" } },
                { dishCategory: { $regex: key, $options: "i" } },
            ]
        });

        if (!recipes.length) {
            return res.status(400).json({ message: "No recipes found" });
        }

        res.status(200).json({ recipes });
    } catch (error) {
        res.status(500).json({
            message: "An error occured during search",
            error: error.message,
        });
    }
}
