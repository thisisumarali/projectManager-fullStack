import Company from "../models/company.model.js";
import Product from "../models/product.model.js";

export const createCompany = async (req, res) => {
    try {
        const { companyName, contact, address } = req.body;
        const userId = req.user.id;

        const existing = await Company.findOne({ companyName, user: userId });
        if (existing) {
            return res.status(400).json({
                success: false,
                msg: "Company already exists"
            });
        }

        const company = await Company.create({
            companyName,
            contact,
            address,
            user: userId
        });

        res.status(201).json({
            success: true,
            msg: "Company created successfully",
            company
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

export const getAllCompanies = async (req, res) => {
    try {
        const userId = req.user.id;

        const companies = await Company.find({ user: userId })
            .populate({
                path: "products",
                select: "productName quantity amount totalAmount balance payment status SKU"
            })
            .sort({ companyName: 1 });

        res.status(200).json({
            success: true,
            count: companies.length,
            companies
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

export const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const company = await Company.findOne({ _id: id, user: userId }).populate({
            path: "products",
            select: "productName quantity amount totalAmount balance payment status SKU category createdAt",
            options: { sort: { createdAt: -1 } },
            populate: { path: "category", select: "categoryName" }
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                msg: "Company not found"
            });
        }

        res.status(200).json({ success: true, company });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { companyName, contact, address } = req.body;

        const company = await Company.findOne({ _id: id, user: userId });
        if (!company) {
            return res.status(404).json({
                success: false,
                msg: "Company not found"
            });
        }

        company.companyName = companyName ?? company.companyName;
        company.contact = contact ?? company.contact;
        company.address = address ?? company.address;

        await company.save();

        res.status(200).json({
            success: true,
            msg: "Company updated successfully",
            company
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

export const deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const company = await Company.findOne({ _id: id, user: userId });
        if (!company) {
            return res.status(404).json({
                success: false,
                msg: "Company not found"
            });
        }

        await Product.deleteMany({ company: company._id });
        await Company.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            msg: "Company and its products deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};
