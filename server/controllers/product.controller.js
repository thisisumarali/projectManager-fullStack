import Product from "../models/product.model.js";
import Category from "../models/categories.model.js";
import Company from "../models/company.model.js";

// Create Product
export const createProduct = async (req, res) => {
    try {
        const {
            company,
            productName,
            quantity,
            amount,
            payment,
            category,
            status,
            SKU,
        } = req.body;

        const userId = req.user._id; // logged-in user

        if (!company || !category || !productName || !quantity || !amount || !SKU) {
            return res.status(400).json({ success: false, msg: "All fields are required." });
        }

        const companyExists = await Company.findById(company);
        if (!companyExists) return res.status(404).json({ success: false, msg: "Company not found." });

        const categoryExists = await Category.findById(category);
        if (!categoryExists) return res.status(404).json({ success: false, msg: "Category not found." });

        const product = new Product({
            company,
            productName,
            quantity,
            amount,
            payment,
            category,
            status,
            SKU,
            user: userId,
        });

        await product.save(); // pre-save hook calculates totalAmount & balance

        res.status(201).json({ success: true, msg: "Product created successfully.", product });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Get all products of logged-in user
export const getAllProducts = async (req, res) => {
    try {
        const userId = req.user._id;
        const products = await Product.find({ user: userId }) // only user's products
            .populate("company", "companyName")
            .populate("category", "name");

        res.status(200).json({ success: true, count: products.length, products });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Get single product (only if it belongs to the user)
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const product = await Product.findOne({ _id: id, user: userId })
            .populate("company", "companyName")
            .populate("category", "name");

        if (!product) return res.status(404).json({ success: false, msg: "Product not found." });

        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Update product (only if it belongs to the user)
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const product = await Product.findOne({ _id: id, user: userId });
        if (!product) return res.status(404).json({ success: false, msg: "Product not found." });

        const { company, productName, quantity, amount, payment, category, status, SKU } = req.body;

        // Validate company and category if provided
        if (company) {
            const companyExists = await Company.findById(company);
            if (!companyExists) return res.status(404).json({ success: false, msg: "Company not found." });
        }
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) return res.status(404).json({ success: false, msg: "Category not found." });
        }

        // Update fields dynamically
        product.company = company ?? product.company;
        product.productName = productName ?? product.productName;
        product.quantity = quantity ?? product.quantity;
        product.amount = amount ?? product.amount;
        product.payment = payment ?? product.payment;
        product.category = category ?? product.category;
        product.status = status ?? product.status;
        product.SKU = SKU ?? product.SKU;

        await product.save();

        res.status(200).json({ success: true, msg: "Product updated successfully.", product });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Delete product (only if it belongs to the user)
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const deleted = await Product.findOneAndDelete({ _id: id, user: userId });
        if (!deleted) return res.status(404).json({ success: false, msg: "Product not found." });

        res.status(200).json({ success: true, msg: "Product deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};
