import { NextFunction, Request, Response } from "express";
import { Collection, Document, InsertOneResult, ObjectId } from "mongodb";
const { CustomError } = require("./errorController");
const bcrypt = require("bcrypt");
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import blacklistedTokens from "./blacklistedTokens";
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
    const user: Document | null = await usersCollection.findOne(
      { email, _id: new ObjectId(inserted.insertedId) },
      { projection: { password: 0 } }
    );

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
      user: user,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body as LoginCredentials;
  if (!email || !password)
  return next(new CustomError("Credentials missing", 401));

  try {
    const usersCollection: Collection = await getCollection(Collections.USERS);
    const user = await usersCollection.aggregate([
      {
        $match: {email}
      },
      {
        $lookup: {
          from: 'transactions',
          foreignField: '_id',
          localField: 'incomes',
          as: 'incomes'
        }
      },
      // {
      //   $lookup:{
      //     from :'transactions',
      //     foreignField: '_id',
      //     localField:'savings',
      //     as: 'savings'
      //   }
      // },
      {
        $unwind: { path: "$budgets", preserveNullAndEmptyArrays: true }
      },

      {
        $lookup: {
          from: 'transactions',
          localField: 'budgets.transactions',
          foreignField: '_id',
          as: 'budgets.transactions'
        }
      },
      {
        $group: {
          _id: '$_id',
          username: { $first: '$username' },
          email: { $first: '$email' },
          password: {$first: '$password'},
          currency: { $first: '$currency' },
          incomes: { $first: '$incomes' },
          savings: { $first: '$savings' },
          budgets: { $push: '$budgets' },
        }
      }

    ]).toArray()
    console.log(user)

    if (!user)
      return next(new CustomError("User with this email doesn't exist", 400));

    const passIsValid: boolean = await bcrypt.compare(password, user[0].password);
    if (!passIsValid) return next(new CustomError("Password incorrect", 400));

    if (!user) return next(new CustomError("Not authenticated", 401));

    const transactonsCollection: Collection = await getCollection(Collections.TRANSACTIONS)
  const incomes = transactonsCollection.find({type: 'income'})
    

    user[0].password = undefined;

    const token: string = jwt.sign(
      { userId: user[0]._id },
      process.env.JWT_SECRET as Secret,
      { expiresIn: "24h" }
    );

    res.cookie("budget-app", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      status: "success",
      user: user[0],
      token,
      incomes
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const protectRoute = async (
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return next(new CustomError("Not authenticated", 401));
  }
  const token = authorizationHeader.split(" ")[1];

  if(blacklistedTokens.includes(token)) return next(new CustomError("Note authenticated", 401))

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

export const autoLogin = async (
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId
  const usersCollection: Collection = await getCollection(Collections.USERS);
  const transactonsCollection: Collection = await getCollection(Collections.TRANSACTIONS)
  const incomes = transactonsCollection.find({type: 'income'})

  try {
      const user = await usersCollection.aggregate([
        {
          $match: {_id: new ObjectId(userId)}
        },
        {
          $lookup: {
            from: 'transactions',
            foreignField: '_id',
            localField: 'incomes',
            as: 'incomes'
          }
        },
        // {
        //   $lookup:{
        //     from :'transactions',
        //     foreignField: '_id',
        //     localField:'savings',
        //     as: 'savings'
        //   }
        // },
        {
          $unwind: { path: "$budgets", preserveNullAndEmptyArrays: true }
        },

        {
          $lookup: {
            from: 'transactions',
            localField: 'budgets.transactions',
            foreignField: '_id',
            as: 'budgets.transactions'
          }
        },
        {
          $group: {
            _id: '$_id',
            username: { $first: '$username' },
            email: { $first: '$email' },
            currency: { $first: '$currency' },
            incomes: { $first: '$incomes' },
            savings: { $first: '$savings' },
            budgets: { $push: '$budgets' }
          }
        }

      ]).toArray()

      console.log(user)
            

      if (!user) return next(new CustomError("Not authenticated", 401));

      const token: string = jwt.sign(
        { userId },
        process.env.JWT_SECRET as Secret,
        { expiresIn: "24h" }
      );


      res.status(200).json({
        status: "success",
        user: user[0],
        token,
        incomes
      });
    
  } catch (err: any) {
    res.status(500).end();
  }
};

export const logoutUser = async (req: RequestWithUserId, res: Response, next: NextFunction) => {
  try{
    const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return next(new CustomError("Not authenticated", 401));
  }
  const token = authorizationHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);

    if (isJwtPayload(decoded)) {
      req.userId = decoded.userId;
      next();
    } else {
      return next(new CustomError("Token verification failed", 401));
    }

    blacklistedTokens.push(token)

    res.status(200).json({
      status: 'success'
    })

  }catch(err: any){
    res.status(500).json({
      status: 'error',
      message: err.message
    })
  }

}

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

