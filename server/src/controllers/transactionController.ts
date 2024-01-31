import { NextFunction, Request, Response } from "express";
import { RequestWithUserId } from "./authController";
import { CustomError } from "./errorController";
import { Collection, Document, InsertOneResult, ObjectId } from "mongodb";
import { Collections, getCollection } from "../database";
// import { type } from "../../../mobile-ts/types";

export const getTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { transactionId } = req.params;
  const transactionCollection: Collection = await getCollection(
    Collections.TRANSACTIONS
  );

  try {
    const transaction: Document | null = await transactionCollection.findOne({
      _id: new ObjectId(transactionId),
    });
    if (!transaction)
      return next(new CustomError("Transaction not found", 404));

    res.status(200).json({
      status: "success",
      transaction,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const getTransactionsByUser = async (
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const transactionCollection: Collection = await getCollection(
    Collections.TRANSACTIONS
  );
  if (!userId) return next(new CustomError("User not found", 404));

  try {
    const transactions: Document[] = await transactionCollection
      .find({ userId: new ObjectId(userId) })
      .toArray();

    res.status(201).json({
      status: "success",
      transactions,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const addTransaction = async (
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  const { transaction, budgetId } = req.body;

  if (!transaction)
    return next(new CustomError("Transaction data incomplete", 400));

  try {
    const transactionsCollection: Collection = await getCollection(
      Collections.TRANSACTIONS
    );

    const result: InsertOneResult = await transactionsCollection.insertOne(
      transaction
    );

    const usersCollection: Collection = await getCollection(Collections.USERS);

    if (transaction.type === "expense") {
      await usersCollection.updateOne(
        { _id: new ObjectId(userId), "budgets.id": budgetId },
        { $push: { "budgets.$.transactions": new ObjectId(result.insertedId) } }
      );
    }

    if (transaction.type === "income") {
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { incomes: new ObjectId(result.insertedId) } }
      );
    }

    if (transaction.type === "saving") {
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { savings: new ObjectId(result.insertedId) } }
      );
    }

    res.status(201).json({
      status: "success",
      transaction,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const deleteTransaction = async (
  req: RequestWithUserId,
  res: Response,
  _next: NextFunction
) => {
  const { transactionId, budgetId, transactionType } = req.body;
  const userId = req.userId;
  console.log(transactionType)

  try {
    const usersCollection: Collection = await getCollection(Collections.USERS);
    const transactionsCollection: Collection = await getCollection(
      Collections.TRANSACTIONS
    );
    if (transactionType === "expense") {

      await usersCollection.updateOne(
        {
          _id: new ObjectId(userId),
          "budgets.id": budgetId,
        },
        {
          $pull: {
            "budgets.$.transactions": new ObjectId(transactionId),
          },
        }
      );
    }
    
    if (transactionType === "income") {
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { incomes: new ObjectId(transactionId) } }
        );
      }

      await transactionsCollection.deleteOne({
        _id: new ObjectId(transactionId),
      });

    res.status(200).json({
      status: "success",
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const updateTransaction = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { transactionId } = req.params;
  const transactionsCollection: Collection<Document> = await getCollection(
    Collections.TRANSACTIONS
  );
  const updates = req.body;

  if (Object.keys(updates).length === 0) res.end();

  try {
    await transactionsCollection.updateOne(
      { _id: new ObjectId(transactionId) },
      { $set: { ...updates } }
    );

    const transaction: Document | null = await transactionsCollection.findOne({
      _id: new ObjectId(transactionId),
    });

    res.status(200).json({
      status: "success",
      transaction,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
