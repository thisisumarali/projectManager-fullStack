import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    companyName: { type: String, required: true, unique: true },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
    }],
    contact: { type: String },
    address: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Company = mongoose.model("Company", companySchema);
export default Company;
