import express from 'express'

import authController from '../controllers/userauth.controller.js'
import { userauthmiddleware } from '../middlewares/token.middleware.js'

const router = express.Router()
// User Routes
router.route('/register').post(authController.registeringUser)
router.route('/login').post(authController.login)
router.route('/user').get(userauthmiddleware, authController.usertokencheck)


export default router