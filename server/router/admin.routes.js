import express from 'express'

import { adminauthmiddleware } from '../middlewares/token.middleware.js'
import adminController from '../controllers/admin.controller.js'
import adminCheckmiddleware from '../middlewares/admin.middleware.js'

const adminRouter = express.Router()
//Admin Routes

adminRouter.route("/register").post(adminController.registeringAdmin)
adminRouter.route("/login").post(adminController.loginAdmin)
adminRouter.route("/admintokencheck").get(adminauthmiddleware, adminCheckmiddleware, adminController.admintokencheck)
adminRouter.route('/admindetails').get(adminauthmiddleware, adminCheckmiddleware, adminController.fetchAdmin)

adminRouter.route("/update/:id").get(adminauthmiddleware, adminCheckmiddleware, adminController.getAdminById)
adminRouter.route("/update/:id").put(adminauthmiddleware, adminCheckmiddleware, adminController.updateAdminByid)
adminRouter.route("/delete/:id").delete(adminauthmiddleware, adminCheckmiddleware, adminController.deleteAdmin)

export default adminRouter