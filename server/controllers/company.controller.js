import Company from "../models/company.model.js";
import Product from "../models/product.model.js";

/**
 * 🏢 Create a new company
 */
export const createCompany = async (req, res) => {
    try {
        const { companyName, contact, address } = req.body;

        const existing = await Company.findOne({ companyName });
        if (existing) {
            return res
                .status(400)
                .json({ success: false, msg: "Company already exists." });
        }

        const company = await Company.create({ companyName, contact, address });

        res.status(201).json({
            success: true,
            msg: "Company created successfully.",
            company,
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

/**
 * 📋 Get all companies (with optional product data)
 */
export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find()
            .populate({
                path: "products",
                select: "productName quantity amount totalAmount balance payment status SKU", // customize fields
            })
            .sort({ companyName: 1 });

        res.status(200).json({
            success: true,
            count: companies.length,
            companies,
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

/**
 * 🔍 Get single company by ID (with products)
 */
export const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findById(id).populate({
            path: "products",
            select: "productName quantity amount totalAmount balance payment status SKU category",
            populate: { path: "category", select: "categoryName" },
        });

        if (!company) {
            return res
                .status(404)
                .json({ success: false, msg: "Company not found." });
        }

        res.status(200).json({ success: true, company });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

/**
 * ✏️ Update a company
 */
export const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { companyName, contact, address } = req.body;

        const company = await Company.findById(id);
        if (!company) {
            return res
                .status(404)
                .json({ success: false, msg: "Company not found." });
        }

        company.companyName = companyName ?? company.companyName;
        company.contact = contact ?? company.contact;
        company.address = address ?? company.address;

        await company.save();

        res.status(200).json({
            success: true,
            msg: "Company updated successfully.",
            company,
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

/**
 * 🗑️ Delete a company (and its products)
 */
export const deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;

        const company = await Company.findById(id);
        if (!company) {
            return res
                .status(404)
                .json({ success: false, msg: "Company not found." });
        }

        // Delete all products belonging to this company
        await Product.deleteMany({ company: company._id });

        // Delete the company itself
        await Company.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            msg: "Company and its products deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};


