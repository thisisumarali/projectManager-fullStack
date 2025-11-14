import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema({
    adminname: { type: String, required: true },
    adminusername: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    adminemail: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    adminpassword: { type: String, required: true },
    isAdmin: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });


adminSchema.pre('save', async function (next) {
    const admin = this
    if (!admin.isModified('adminpassword')) {
        return
    }
    try {
        const saltround = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(admin.adminpassword, saltround)
        admin.adminpassword = hashpassword;
        next()
    } catch (error) {
        console.log("error hashing password", error)
        next(error)
    }
})

adminSchema.methods.generateToken = async function () {
    try {
        return jwt.sign({
            id: this._id.toString(),
            adminemail: this.adminemail,
            adminusername: this.adminusername,
            adminname: this.adminname
        },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "30d"
            }
        )
    } catch (error) {
        console.log(error)
    }
}
const Admin = mongoose.model("Admin", adminSchema)

export default Admin