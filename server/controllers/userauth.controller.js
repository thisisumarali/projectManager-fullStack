import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


const registeringUser = async (req, res) => {
    try {
        const { fullname, username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { username }] })

        if (existingUser) {
            return res.status(400).json({ msg: 'user is already register' })
        }
        const newUser = await User.create({
            fullname,
            username,
            email,
            password
        })
        const token = await newUser.generateToken()

        return res.status(201).json({
            msg: newUser,
            token
        })
    } catch (error) {
        console.error("Error while registration", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}
const login = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const loginUser = await User.findOne({ $or: [{ email }, { username }] });

        if (!loginUser) {
            return res.status(400).json({ msg: 'User is not register' })
        }

        const isMatch = await bcrypt.compare(password, loginUser.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Password is incorrect' })
        }

        const token = await loginUser.generateToken()
        return res.status(200).json({ msg: loginUser, token })

    } catch (error) {
        console.error("Error during login", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}
const usertokencheck = async (req, res) => {
    try {
        const userData = req.user;
        console.log(userData)
        return res.status(200).json({ msg: userData })
    } catch (error) {
        console.log("Error from the user route, ", error)
    }
}


export default { registeringUser, login, usertokencheck }