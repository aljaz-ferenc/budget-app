import express from 'express'
import {addTransaction, getTransaction, updateTransaction, deleteTransaction, getTransactionsByUser} from '../controllers/transactionController';
import { protectRoute } from '../controllers/authController';

const router = express.Router()

router.route('/')
    .post(protectRoute, addTransaction)
    .delete(protectRoute, deleteTransaction)

router.route('/:transactionId')
    .get(protectRoute, getTransaction)
    .patch(protectRoute, updateTransaction)

router.route('/user/:userId')
    .get(protectRoute, getTransactionsByUser)

export default router