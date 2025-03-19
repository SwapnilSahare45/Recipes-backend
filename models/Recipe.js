import mongoose from "mongoose";

// Recipe schema to validate recipe data
const recipeSchema = mongoose.Schema(
    {
        recipeBy: {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            userName: {
                type: String,
                required: [true, "First name is required"],
                trim: true,
                match: [/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"],
                minlength: [2, "First name must be at least 2 characters long"],
                maxlength: [45, "First name cannot exceed 45 characters"],
            },
        },
        recipeName: {
            type: String,
            required: [true, "Recipe name is required"],
            trim: true,
            minlength: [1, "Recipe name must be at least 1 character long"],
            maxlength: [100, "Recipe name cannot exceed 100 characters"],
        },
        ingredients: {
            type: [String],
            required: [true, "Ingredients are required"],
        },
        cookingInstructions: {
            type: [String],
            required: [true, "Cooking instructions are required"],
        },
        cookingTime: {
            type: Number,
            required: [true, "Cooking time is required"],
        },
        cuisineType: {
            type: String,
            required: [true, "Cuisine type is required"],
            trim: true,
            enum: [
                "indian",
                "italian",
                "chinese",
                "mexican",
                "american",
                "japanese",
                "french",
                "other",
            ],
        },
        dishCategory: {
            type: String,
            required: [true, "Dish category is required"],
            trim: true,
            enum: [
                "breakfast",
                "brunch",
                "lunch",
                "dinner",
                "snacks",
                "desserts",
                "appetizers",
                "drinks",
                "side-dish",
                "soups",
                "salads",
                "other",
            ],
        },
        recipeImage: {
            type: String,
            required: [true, "Recipe image is required"],
        },
    },
    {
        timestamps: true,
    }
);

// Recipe model based on the recipe schema
const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;