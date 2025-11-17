import express from "express";
import {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
} from "../controllers/company.controller.js";
import { userauthmiddleware } from "../middlewares/token.middleware.js";


const companyRouter = express.Router();
companyRouter.use(userauthmiddleware);

companyRouter.post("/", createCompany);
companyRouter.get("/", getAllCompanies);
companyRouter.get("/:id", getCompanyById);
companyRouter.put("/:id", updateCompany);
companyRouter.delete("/:id", deleteCompany);

export default companyRouter;
