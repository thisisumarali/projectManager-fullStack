import Admin from "../models/admin.model.js";
import bcrypt from "bcryptjs";

const registeringAdmin = async (req, res) => {
    try {
        const { adminname, adminusername, adminemail, adminpassword } = req.body;
        const existingUser = await Admin.findOne({ $or: [{ adminemail }, { adminusername }] })

        if (existingUser) {
            return res.status(400).json({ msg: 'admin is already register' })
        }
        const newAdmin = await Admin.create({
            adminname,
            adminusername,
            adminemail,
            adminpassword
        })
        const token = await newAdmin.generateToken()

        return res.status(201).json({
            newAdmin,
            token
        })
    } catch (error) {
        console.error("Error while registration in admin", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}

const loginAdmin = async (req, res) => {
    try {
        const { adminusername, adminemail, adminpassword } = req.body;
        const loginAdmin = await Admin.findOne({ $or: [{ adminemail }, { adminusername }] });

        if (!loginAdmin) {
            return res.status(400).json({ msg: 'Admin is not register' })
        }

        const isMatch = await bcrypt.compare(adminpassword, loginAdmin.adminpassword);
        if (!isMatch) {
            return res.status(400).json({ msg: 'adminpassword is incorrect' })
        }

        const token = await loginAdmin.generateToken()
        return res.status(200).json({ msg: loginAdmin, token })

    } catch (error) {
        console.error("Error during Admin", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}

const fetchAdmin = async (req, res) => {
    try {
        const admins = await Admin.find()
        if (!admins) res.status(404).json({ msg: 'Admin is not register' })

        res.status(200).json({ msg: admins })
    } catch (error) {
        console.log("Admin: ", error)
    }
}

const deleteAdmin = async (req, res) => {
    try {
        const adminid = req.params.id;
        const result = await Admin.deleteOne({ _id: adminid });

        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: "Admin not found." });
        }

        return res.status(200).json({ msg: "Admin deleted successfully." });
    } catch (error) {
        console.error("Admin Delete Error:", error);
        return res.status(500).json({ msg: "Server error while deleting admin." });
    }
};

const getAdminById = async (req, res) => {
    try {
        const id = req.params.id
        const response = await Admin.findOne({ _id: id }, { adminpassword: 0 })
        if (!response) {
            return res.status(404).json({ msg: "Admin not found" });
        }
        res.status(200).json({ msg: response })
    } catch (error) {
        console.log(error)
    }
}
const updateAdminByid = async (req, res) => {
    try {
        const _id = req.params.id
        const updateUserDate = { ...req.body }

        if (updateUserDate.adminpassword) {
            const salt = await bcrypt.genSalt(10)
            updateUserDate.adminpassword = await bcrypt.hash(updateUserDate.adminpassword, salt)
        }

        const response = await Admin.findByIdAndUpdate(_id, updateUserDate, {
            new: true,
            runValidators: true,
        })

        if (!response) {
            return res.status(404).json({ msg: "Admin not found" })
        }

        res.status(200).json({ msg: response })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Internal server error" })
    }
}


const admintokencheck = async (req, res) => {
    try {
        const adminData = req.user;
        console.log(adminData)
        return res.status(200).json({ msg: adminData })
    } catch (error) {
        console.log("Error from the admin route, ", error)
    }
}


export default { registeringAdmin, loginAdmin, admintokencheck, fetchAdmin, deleteAdmin, getAdminById, updateAdminByid }