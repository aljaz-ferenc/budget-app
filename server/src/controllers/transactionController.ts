import { NextFunction, Request, Response } from "express";
import { RequestWithUserId } from "./authController";
import {CustomError} from './errorController'
import { Collection, Document, InsertOneResult, ObjectId } from "mongodb";
import { Collections, getCollection } from "../database";

export const getTransaction = async (req: Request, res: Response, next: NextFunction) =>{
    const {transactionId} = req.params
    const transactionCollection: Collection = await getCollection(Collections.TRANSACTIONS)

    try{
        const transaction: Document | null = await transactionCollection.findOne({_id: new ObjectId(transactionId)})
        if(!transaction) return next(new CustomError("Transaction not found", 404))

        res.status(200).json({
            status: 'success',
            transaction
        })

    }catch(err: any){
        res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}

export const getTransactionsByUser = async (req: RequestWithUserId, res: Response, next: NextFunction) =>{
    const userId = req.userId 
    const transactionCollection: Collection = await getCollection(Collections.TRANSACTIONS)
    
    if(!userId) return next(new CustomError("User not found", 404))

    try{
        const transactions: Document[]  = await transactionCollection.find({userId: new ObjectId(userId)}).toArray()

        res.status(201).json({
            status: 'success',
            transactions
        })

    }catch(err: any){
        res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}

export const addTransaction = async (req: RequestWithUserId, res: Response, next: NextFunction) =>{
    const userId = req.userId

    const {type, category, amount} = req.body
    if(!userId || !type || !category || !amount) return next(new CustomError('Transaction data incomplete', 400))

    try{
        const transactionsCollection: Collection = await getCollection(Collections.TRANSACTIONS)
        const result: InsertOneResult = await transactionsCollection.insertOne({userId: new ObjectId(userId), type, category, amount, createdAt: Date.now()})

        const transaction: Document | null = await transactionsCollection.findOne({_id: new ObjectId(result.insertedId)})

        res.status(201).json({
            status: 'success',
            transaction
        })
        
    }catch(err: any){
        res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}

export const deleteTransaction = async (req: Request, res: Response, _next: NextFunction) =>{
    const {transactionId} = req.params

    const transactionsCollection: Collection = await getCollection(Collections.TRANSACTIONS)

    try{
        await transactionsCollection.deleteOne({_id: new ObjectId(transactionId)})

        res.status(204).end()
    }catch(err: any){
        res.status(500).json({
            status: 'error',
            message: err.message
        })
    }

}

export const updateTransaction = async (req: Request, res: Response, _next: NextFunction) =>{
    const {transactionId} = req.params
    const transactionsCollection: Collection<Document> = await getCollection(Collections.TRANSACTIONS)
    const updates = req.body

    if(Object.keys(updates).length === 0) res.end()

    try{
        await transactionsCollection.updateOne({_id: new ObjectId(transactionId)}, {$set:{...updates}})

        const transaction: Document | null = await transactionsCollection.findOne({ _id: new ObjectId(transactionId) });

        res.status(200).json({
            status: 'success',
            transaction
        })
    }catch(err: any){
        res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}

