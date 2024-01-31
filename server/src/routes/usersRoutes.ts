import express from 'express'
import { updateUser,getUser, addBudget, addSaving, updateSaving, deleteSaving,deleteBudget } from '../controllers/userController'
import {  protectRoute } from '../controllers/authController';

const router = express.Router()

router.route('/')
    .get(getUser)
    .patch(protectRoute, updateUser)

router.route('/budgets')
    .post(protectRoute, addBudget)
    .delete(protectRoute, deleteBudget)

router.route('/savings')
    .post(protectRoute, addSaving)
    .patch(protectRoute, updateSaving)
    .delete(protectRoute, deleteSaving)
    
export default router