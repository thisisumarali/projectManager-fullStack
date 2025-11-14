import express from "express";
import {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
} from "../controllers/company.controller.js";

const companyRouter = express.Router();

companyRouter.post("/", createCompany);
companyRouter.get("/", getAllCompanies);
companyRouter.get("/:id", getCompanyById);
companyRouter.put("/:id", updateCompany);
companyRouter.delete("/:id", deleteCompany);

export default companyRouter;
