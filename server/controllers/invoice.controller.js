import Invoice from "../models/invoice.model.js";

// Create invoice
export const createInvoice = async (req, res) => {
    try {
        const { InvoiceNumber, Client, Amount, DueDate } = req.body;
        const userId = req.user.id;

        const invoice = await Invoice.create({
            Invoice: InvoiceNumber,
            Client,
            Amount,
            DueDate,
            PaidAmount: 0,
            Status: "sent",
            user: userId
        });

        res.status(201).json({
            success: true,
            msg: "Invoice created",
            invoice
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Get all invoices
export const getAllInvoices = async (req, res) => {
    try {
        const userId = req.user.id;

        const invoices = await Invoice.find({ user: userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: invoices.length,
            invoices
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Get invoice by ID
export const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const invoice = await Invoice.findOne({ _id: id, user: userId });

        if (!invoice) {
            return res.status(404).json({ success: false, msg: "Invoice not found" });
        }

        res.status(200).json({ success: true, invoice });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Update invoice (e.g., payments or other fields)
export const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { Client, Amount, PaidAmount, DueDate } = req.body;

        const invoice = await Invoice.findOne({ _id: id, user: userId });
        if (!invoice) {
            return res.status(404).json({ success: false, msg: "Invoice not found" });
        }

        invoice.Client = Client ?? invoice.Client;
        invoice.Amount = Amount ?? invoice.Amount;
        invoice.PaidAmount = PaidAmount ?? invoice.PaidAmount;
        invoice.DueDate = DueDate ?? invoice.DueDate;

        // Update status
        if (invoice.PaidAmount === 0) {
            invoice.Status = "sent";
        } else if (invoice.PaidAmount < invoice.Amount) {
            invoice.Status = "partially paid";
        } else if (invoice.PaidAmount >= invoice.Amount) {
            invoice.Status = "paid";
        }

        // Check overdue
        if (new Date() > new Date(invoice.DueDate) && invoice.PaidAmount < invoice.Amount) {
            invoice.Status = "overdue";
        }

        await invoice.save();

        res.status(200).json({ success: true, msg: "Invoice updated", invoice });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Delete invoice
export const deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const invoice = await Invoice.findOne({ _id: id, user: userId });
        if (!invoice) {
            return res.status(404).json({ success: false, msg: "Invoice not found" });
        }

        await Invoice.findByIdAndDelete(id);

        res.status(200).json({ success: true, msg: "Invoice deleted" });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};
