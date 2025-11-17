import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    Invoice: { type: Number, required: true },
    Client: { type: String, required: true },
    Date: { type: Date, default: Date.now, required: true },
    DueDate: { type: Date, required: true },

    Amount: { type: Number, required: true },
    PaidAmount: { type: Number, default: 0 },
    Status: {
        type: String,
        enum: ["sent", "partially paid", "paid", "overdue"],
        default: "sent"
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
