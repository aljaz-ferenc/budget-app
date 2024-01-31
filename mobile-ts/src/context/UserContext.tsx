import {
  ReactNode,
  createContext,
  useReducer,
  useContext,
  Dispatch,
} from "react";
import { Transaction, Budget, Saving, TransactionType } from "../../types";

type User = {
  username: string;
  email: string;
  _id: string;
  isLoggedIn: boolean;
  currency: string;
  budgets: Budget[];
  incomes: Transaction[];
  savings: Saving[];
};

const initialState: User = {
  username: "",
  email: "",
  _id: "",
  isLoggedIn: false,
  currency: "",
  budgets: [],
  incomes: [],
  savings: [],
};

type UserContextType = {
  user: User | null;
  updateLoggedInStatus: (isLoggedIn: boolean) => void;
  setUser: (userData: any) => void;
  addBudget: (budget: Budget) => void;
  addSaving: (saving: Saving) => void;
  addTransaction: (transaction: Transaction) => void;
  getAllTransactions: (user: User) => Transaction[];
  getTotalIncome: (user: User) => number;
  getTotalExpenses: (user: User) => number;
  getTotalSavings: (user: User) => number;
  getTotalBudget: (user: User) => number;
  getAllSavings: (user: User) => Saving[];
  updateSaving: (savingId: string, amount: number) => void;
  getTotalSaved: (user: User) => number;
  deleteSaving: (savingId: string) => void;
  deleteTransaction: (transactionId: string, type: TransactionType) => void;
  deleteBudget: (budgetId: string) => void
};

type Props = {
  children: ReactNode;
};

type ReducerAction = {
  type: ActionType;
  payload: any;
};

enum ActionType {
  LOGIN = "LOGIN",
  SETUSER = "SETUSER",
  ADDBUDGET = "ADDBUDGET",
  ADDTRANSACTION = "ADDTRANSACTION",
  ADDSAVING = "ADDSAVING",
  UPDATESAVING = "UPDATESAVING",
  DELETESAVING = "DELETESAVING",
  DELETETRANSACTION = "DELETETRANSACTION",
  DELETEBUDGET = "DELETEBUDGET"
}

function userReducer(state: User, action: ReducerAction) {
  switch (action.type) {
    case ActionType.LOGIN: {
      return { ...state, isLoggedIn: action.payload };
    }

    case ActionType.SETUSER: {
      return { ...state, ...action.payload };
    }

    case ActionType.ADDBUDGET: {
      return { ...state, budgets: [...state.budgets, action.payload] };
    }

    case ActionType.ADDSAVING: {
      if (!state.savings) return { ...state, savings: [action.payload] };
      return { ...state, savings: [...state.savings, action.payload] };
    }

    case ActionType.ADDTRANSACTION: {
      const newTransaction = action.payload;
      switch (newTransaction.type) {
        case "expense": {
          const budgetId = newTransaction.budgetId;
          const updatedBudgets: Budget[] = state.budgets.map((budget) => {
            if (budget.id === budgetId) {
              return {
                ...budget,
                transactions: [...budget.transactions, newTransaction],
              };
            } else return budget;
          });
          return { ...state, budgets: updatedBudgets };
        }
        case "income": {
          return { ...state, incomes: [...state.incomes, action.payload] };
        }
        case "saving": {
          return { ...state, savings: [...state.savings, action.payload] };
        }

        default:
          return state;
      }
    }

    case ActionType.UPDATESAVING: {
      const savingId = action.payload.savingId;
      const amount = action.payload.amount;

      const updatedSavings = state.savings.map((saving) => {
        if (saving.id === savingId) {
          if (!saving.saved) return { ...saving, saved: amount };
          else return { ...saving, saved: (saving.saved += amount) };
        }
        return saving;
      });

      return { ...state, savings: updatedSavings };
    }

    case ActionType.DELETESAVING: {
      const savingId = action.payload;

      const updatedSavings = state.savings.filter(
        (saving) => saving.id !== savingId
      );
      return { ...state, savings: updatedSavings };
    }

    case ActionType.DELETETRANSACTION: {
      const {transactionId, type} = action.payload;

      if(type === 'income'){
        const updatedIncomes = [...state.incomes].filter(income => income._id !== transactionId)
        return {...state, incomes: updatedIncomes}
      }

      const budgets = [...state.budgets];
      const updatedBudgets = [] as Budget[];

      budgets.forEach((budget) => {
        budget.transactions.forEach((transaction) => {
          if (transaction._id === transactionId) {
            const newTransactions = budget.transactions.filter(
              (transaction) => transaction._id !== transactionId
            );
            budget.transactions = newTransactions;
            return;
          }
        });
        updatedBudgets.push(budget);
      });

      return { ...state, budgets: updatedBudgets };
    }

    case ActionType.DELETEBUDGET:{
      const budgetId = action.payload
      const updatedBudgets = [...state.budgets].filter(budget => budget.id !== budgetId)
      return {...state, budgets: updatedBudgets}
    }

    default:
      return state;
  }
}
export const UserContext = createContext<UserContextType | null>(null);

export default function UserContextProvider({ children }: Props) {
  const [user, dispatch] = useReducer(userReducer, initialState as User);

  const updateLoggedInStatus = (isLoggedIn: boolean) => {
    dispatch({ type: ActionType.LOGIN, payload: isLoggedIn });
  };

  const setUser = (userData: any) => {
    dispatch({ type: ActionType.SETUSER, payload: userData });
  };

  const addBudget = (budget: Update) => {
    dispatch({ type: ActionType.ADDBUDGET, payload: budget });
  };

  function addTransaction(transaction: Transaction | Budget) {
    dispatch({ type: ActionType.ADDTRANSACTION, payload: transaction });
  }

  function deleteTransaction(transactionId: string, type: TransactionType) {
    dispatch({ type: ActionType.DELETETRANSACTION, payload: {transactionId, type} });
  }

  function addSaving(saving: Saving) {
    dispatch({ type: ActionType.ADDSAVING, payload: saving });
  }

  function updateSaving(savingId: string, amount: number) {
    dispatch({ type: ActionType.UPDATESAVING, payload: { savingId, amount } });
  }

  function deleteSaving(savingId: string) {
    dispatch({ type: ActionType.DELETESAVING, payload: savingId });
  }

  function deleteBudget(budgetId: string){
    dispatch({type: ActionType.DELETEBUDGET, payload: budgetId})
  }

  function getAllTransactions(user: User): Transaction[] {
    const transactions: Transaction[] = [...user.incomes];

    user.budgets.forEach((budget) => {
      if (!budget.transactions || budget.transactions.length === 0) return [];
      transactions.push(...budget.transactions);
    });

    return transactions.sort((a, b) =>
      new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? -1 : 1
    );
  }

  function getAllSavings(user: User): Saving[] {
    if (!user.savings) return [] as Saving[];
    const savings: Saving[] = [...user.savings];
    return savings;
  }

  function getTotalSaved(user: User) {
    const savings = getAllSavings(user);
    if (savings.length === 0) return 0;

    return savings.reduce((acc, saving) => {
      return acc + saving.saved;
    }, 0);
  }

  function getTotalBudget(user: User) {
    if (!user.budgets || user.budgets?.length === 0) return 0;
    return user.budgets.reduce((acc, budget) => {
      return acc + budget.amount || 0;
    }, 0);
  }

  function getTotalIncome(user: User) {
    if (user.incomes.length === 0 || !user.incomes) return 0;

    const totalIncome = user.incomes.reduce((acc, income) => {
      return acc + income.amount;
    }, 0);

    return totalIncome;
  }

  function getTotalExpenses(user: User) {
    const transactions = getAllTransactions(user);
    if (transactions.length === 0) return 0;

    return transactions.reduce((acc, transaction) => {
      if (transaction.type === "expense") return acc + transaction.amount;
      else return acc;
    }, 0);
  }

  function getTotalSavings(user: User) {
    if (!user?.savings || user.savings.length === 0) return 0;
    return (
      user.savings.reduce((acc, saving) => {
        return acc + saving.amount;
      }, 0) || 0
    );
  }

  return (
    <UserContext.Provider
      value={{
        user,
        updateLoggedInStatus,
        setUser,
        addBudget,
        addTransaction,
        getAllTransactions,
        getTotalIncome,
        getTotalExpenses,
        getTotalSavings,
        getTotalBudget,
        addSaving,
        getAllSavings,
        updateSaving,
        getTotalSaved,
        deleteSaving,
        deleteTransaction,
        deleteBudget
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }

  return context;
};

type Update = Budget;
