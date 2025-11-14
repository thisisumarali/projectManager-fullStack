import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: { type: String, required: true },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    const user = this
    if (!user.isModified('password')) {
        return
    }
    try {
        const saltround = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(user.password, saltround)
        user.password = hashpassword
        next()
    } catch (error) {
        console.log(error)
        next(error)
    }
})

userSchema.methods.generateToken = async function () {
    try {
        return jwt.sign({
            userId: this._id.toString(),
            email: this.email,
            username: this.username,
            fullname: this.fullname
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
const User = mongoose.model("User", userSchema)

export default User