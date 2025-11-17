import express from "express";
import {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice
} from "../controllers/invoice.controller.js";
import { userauthmiddleware } from "../middlewares/token.middleware.js";

const invoiceRouter = express.Router();

invoiceRouter.use(userauthmiddleware);

invoiceRouter.post("/", createInvoice);
invoiceRouter.get("/", getAllInvoices);
invoiceRouter.get("/:id", getInvoiceById);
invoiceRouter.put("/:id", updateInvoice);
invoiceRouter.delete("/:id", deleteInvoice);

export default invoiceRouter;
