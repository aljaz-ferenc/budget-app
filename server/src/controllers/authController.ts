import { NextFunction, Request, Response } from "express";
import { Collection, Document, InsertOneResult } from "mongodb";
const { CustomError } = require("./errorController");
const bcrypt = require("bcrypt");
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
const { getCollection, Collections } = require("../database");

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password, passwordConfirm } =
    req.body as RegisterCredentials;

  if (!username || !email || !password || !passwordConfirm)
    return next(new CustomError("Credentials missing", 401));

  if (password !== passwordConfirm)
    return next(new CustomError("Passwords do not match", 400));

  if (password.length < 6)
    return next(
      new CustomError("Password must be at least 6 characters long", 400)
    );

  try {
    const hash: string = await bcrypt.hash(password, 12);
    const usersCollection: Collection = await getCollection(Collections.USERS);
    let inserted: null | InsertOneResult = null;

    try {
      const result: InsertOneResult = await usersCollection.insertOne({
        username,
        email,
        password: hash,
      });
      inserted = result;
      
    } catch (err: any) {
      return next(new CustomError("User with this email already exists", 401));
    }

    const token: string = jwt.sign(
      { userId: inserted.insertedId },
      process.env.JWT_SECRET as Secret,
      { expiresIn: "24h" }
    );

    res.cookie("budget-app", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(201).json({
      status: "success",
      userId: inserted.insertedId,
    });

  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body as LoginCredentials;
  if(!email || !password) return next(new CustomError("Credentials missing", 401))

  const usersCollection: Collection = await getCollection(Collections.USERS);

  const user: Document | null = await usersCollection.findOne({ email });

  if (!user)
    return next(new CustomError("User with this email doesn't exist", 400));

  const passIsValid: boolean = await bcrypt.compare(password, user.password);
  if (!passIsValid) return next(new CustomError("Password incorrect", 400));

  res.status(200).json({
    status: "success",
    userId: user._id,
  });
};

export const protectRoute = async (
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["budget-app"];
  console.log(token);

  if (!token) {
    return next(new CustomError("Not authenticated", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);

    if (isJwtPayload(decoded)) {
      req.userId = decoded.userId;
      next();
    } else {
      return next(new CustomError("Token verification failed", 401));
    }
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

type RegisterCredentials = {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

type LoginCredentials = {
  email: string;
  password: string;
};

export interface RequestWithUserId extends Request {
  userId?: string;
}

function isJwtPayload(decoded: string | JwtPayload): decoded is JwtPayload {
  return typeof decoded !== "string";
}
