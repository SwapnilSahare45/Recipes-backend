import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// User schema to validate user data
const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "Frist name is required"],
            trim: true,
            match: [/^[a-zA-Z]+$/, "Name can only contain letters"],
            minlength: [2, "First name must be 2 characters long"],
            maxlength: [45, "First name cannot more then 45 character"],
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
            match: [/^[a-zA-Z]+$/, "Name can only contain letters"],
            minlength: [2, "Last name must be 2 characters long"],
            maxlength: [45, "Last name cannot more then 45 character"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            unique: true,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please enter a valid email address",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            trim: true,
            minlength: [8, "Password must be 8 characters long"],
            match: [
                /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                "Password must contain at least one uppercase letter, one number, and one special character",
            ],
        },
    },
    {
        timestamps: true,
    }
);

// Pre-save hook for hashing the password
userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
};

// User model based on user schema
const User = mongoose.model("User", userSchema);

export default User;