import { NextFunction, Request, Response } from "express";
import { Collection, ObjectId } from "mongodb";
import { Collections, getCollection } from "../database";
import { RequestWithUserId } from "./authController";
import { CustomError } from "./errorController";

export const updateUser = async (
  req: RequestWithUserId,
  res: Response,
  _next: NextFunction
) => {
  const updates = req.body;
  const userId = req.userId;

  try {
    const usersCollection: Collection = await getCollection(Collections.USERS);
    if (updates.budget) {
      const newBudget = {
        ...updates.budget,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { budgets: newBudget } }
      );

      res.status(200).json({
        status: "success",
        budget: newBudget,
      });
    }

    if (updates.username) {
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { username: updates.username } }
      );
    }

    if (updates.email) {
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { email: updates.email } }
      );
    }
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const getUser = (
  _req: Request,
  _res: Response,
  _next: NextFunction
) => {};

export const addBudget = async (
  req: RequestWithUserId,
  res: Response,
  _next: NextFunction
) => {
  const userId = req.userId;
  const budget = req.body;
  budget.createdAt = new Date();
  budget.id = crypto.randomUUID();

  try {
    const usersCollection: Collection = await getCollection(Collections.USERS);
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { budgets: budget } }
    );

    res.status(201).json({
      status: "success",
      budget,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const deleteBudget = async (
  req: RequestWithUserId,
  res: Response,
  _next: NextFunction
) => {
  const { budgetId } = req.body;
  const userId = req.userId;

  try {
    const usersCollection: Collection = await getCollection(Collections.USERS);
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { budgets: {id: budgetId} } }
    );

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

export const addSaving = async (
  req: RequestWithUserId,
  res: Response,
  _next: NextFunction
) => {
  const userId = req.userId;
  const saving = req.body;
  saving.createdAt = new Date();
  saving.id = crypto.randomUUID();
  saving.saved = 0.0;

  try {
    const usersCollection: Collection = await getCollection(Collections.USERS);
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { savings: saving } }
    );

    res.status(201).json({
      status: "success",
      saving,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const updateSaving = async (
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const { savingId, amount } = req.body;
  if (!savingId || !amount || isNaN(amount))
    return next(new CustomError("Missing or invaid saving amount/id", 400));

  try {
    const usersCollection: Collection = await getCollection(Collections.USERS);
    await usersCollection.updateOne(
      { _id: new ObjectId(userId), "savings.id": savingId },
      { $inc: { "savings.$.saved": parseInt(amount) || 0 } }
    );

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

export const deleteSaving = async (
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const { savingId } = req.body;
  if (!savingId) return next(new CustomError("Missing savingID", 400));

  try {
    const usersCollection: Collection = await getCollection(Collections.USERS);
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { savings: { id: savingId } } }
    );

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
