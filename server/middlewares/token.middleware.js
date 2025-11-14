import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";

const userauthmiddleware = async (req, res, next) => {

    const webtoken = req.header("Authorization")?.split(" ")[1];
    if (!webtoken) {
        return res.status(401).json({ msg: "Unauthorized, Token not provided" });
    }

    console.log('token from authorization', webtoken)

    const token = webtoken;

    try {
        const isVerified = jwt.verify(token, process.env.JWT_SECRET_KEY)
        console.log(isVerified)
        const userData = await User.findOne({ email: isVerified.email }).select({ password: 0 })
        req.user = userData
        req.gettoken = token
        req.userID = req.user._id
        console.log(userData)
        next()
    } catch (error) {
        console.log('JWT Verification Error: ', error.message)
        return res.status(401).json({ msg: "Unauthorized, Invalid Token" })
    }
}
const adminauthmiddleware = async (req, res, next) => {

    const webtoken = req.header("Authorization");
    if (!webtoken) {
        return res.status(401).json({ msg: "Unauthorized HTTP, Token not provided" })
    }
    console.log('token from authorization', webtoken)

    const token = webtoken.replace("Bearer", "").trim()

    try {
        const isVerified = jwt.verify(token, process.env.JWT_SECRET_KEY)
        console.log(isVerified)
        const adminData = await Admin.findOne({ adminemail: isVerified.adminemail }).select({ adminpassword: 0 })
        req.user = adminData
        req.gettoken = token
        req.adminID = req.user._id
        console.log(adminData)
        next()
    } catch (error) {
        console.log('JWT Verification Error: ', error.message)
        return res.status(401).json({ msg: "Unauthorized, Invalid Token" })
    }
}

export { userauthmiddleware, adminauthmiddleware }