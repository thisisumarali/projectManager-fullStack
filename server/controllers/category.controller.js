import Category from "../models/categories.model.js";

// Create Category
export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user._id;

        if (!name) {
            return res.status(400).json({ success: false, msg: "Category name is required" });
        }

        const existingCategory = await Category.findOne({ name: name.trim(), user: userId });
        if (existingCategory) {
            return res.status(400).json({ success: false, msg: "Category already exists" });
        }

        const category = new Category({ name: name.trim(), user: userId });
        await category.save();

        res.status(201).json({
            success: true,
            msg: "Category created successfully",
            category
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Get all categories of logged-in user
export const getAllCategories = async (req, res) => {
    try {
        const userId = req.user._id;
        const categories = await Category.find({ user: userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            categories
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Get category by ID (only if it belongs to the user)
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const category = await Category.findOne({ _id: id, user: userId });
        if (!category) {
            return res.status(404).json({ success: false, msg: "Category not found" });
        }

        res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Update Category
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const userId = req.user._id;

        if (!name) {
            return res.status(400).json({ success: false, msg: "Category name is required" });
        }

        const existingCategory = await Category.findOne({ name: name.trim(), user: userId });
        if (existingCategory && existingCategory._id.toString() !== id) {
            return res.status(400).json({ success: false, msg: "Category name already taken" });
        }

        const category = await Category.findOneAndUpdate(
            { _id: id, user: userId },
            { name: name.trim() },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ success: false, msg: "Category not found" });
        }

        res.status(200).json({
            success: true,
            msg: "Category updated successfully",
            category
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Delete Category
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const category = await Category.findOneAndDelete({ _id: id, user: userId });
        if (!category) {
            return res.status(404).json({ success: false, msg: "Category not found" });
        }

        res.status(200).json({
            success: true,
            msg: "Category deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};
