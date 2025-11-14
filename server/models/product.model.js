import mongoose from "mongoose";
// Debit hai tw de hai

// Credit hai tw dena hai
const productSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
    totalAmount: { type: Number },
    balance: { type: Number, },
    payment: {
        type: String,
        enum: ["Debit", "Credit"],
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",  // Must match the model name in category.model.js
        required: true
    },
    status: {
        type: String,
        enum: ["cancel", "pending", "completed"],
        default: "pending",
        required: true
    },
    SKU: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
})
productSchema.pre("save", function (next) {
    // Auto calculate total
    this.totalAmount = this.quantity * this.amount;

    // Auto calculate balance depending on payment type
    if (this.payment === "Debit") {
        this.balance = this.totalAmount;  // You’ll receive money
    } else if (this.payment === "Credit") {
        this.balance = -this.totalAmount; // You owe money
    }

    next();
});
productSchema.post("save", async function (doc) {
    await mongoose.model("Company").findByIdAndUpdate(doc.company, {
        $addToSet: { products: doc._id },
    });
});

const Product = mongoose.model("Products", productSchema)
export default Product