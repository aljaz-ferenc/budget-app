import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { updateTransaction } from "../../../server/src/controllers/transactionController";

type Props = {
  children: ReactNode;
};

type Transaction = {
  _id: string;
  amount: number;
  category: string;
  createdAt: Date;
  type: TransactionType;
  item: string
};

enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

type State = Transaction[];

type Action = {
  type: ActionType;
  payload: any;
};

type ContextValue = {
  transactions: Transaction[];
  amount: number
  totalExpenses:number
  setTransactions: (transactions: Transaction[]) => void;
  updateTransaction: (id: string, updates: object) => void;
  deleteTransaction: (id: string) => void;
};

enum ActionType {
  SET = "transactions/set",
  UPDATE = "transaction/update",
  DELETE = "transaction/delete",
}

const TransactionsContext = createContext<ContextValue | null>(null);

const initialState = [] as Transaction[];

function transactionsReducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.SET: {
      return action.payload;
    }
    case ActionType.UPDATE: {
      const id = action.payload.id;
      const updates = action.payload.updates;

      return state.map((transaction) => {
        if (transaction._id === id) {
          return { ...transaction, ...updates };
        }else{
            return transaction;
        }
      });
    }
    case ActionType.DELETE: {
      return state.filter((transaction) => transaction._id !== action.payload);
    }
  }
}

export default function TransactionsContextProvider({
  children,
}: Props): React.JSX.Element {
  const [transactions, dispatch] = useReducer(
    transactionsReducer,
    initialState
  );
  const [amount, setAmount] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0)

  function setTransactions(transactions: Transaction[]) {
    dispatch({ type: ActionType.SET, payload: transactions });
  }

  function updateTransaction(id: string, updates: object) {
    dispatch({ type: ActionType.UPDATE, payload: { id, updates } });
  }

  function deleteTransaction(id: string) {
    dispatch({ type: ActionType.DELETE, payload: id });
  }



  useEffect(() => {
    const amount = transactions.reduce((acc, transaction) => {
      return transaction.type === TransactionType.INCOME
        ? acc + transaction.amount
        : acc - transaction.amount;
    }, 0);
    setAmount(amount)

    const totalExpenses = transactions.reduce((acc, transaction) => {
        if(transaction.type === TransactionType.EXPENSE){
            return acc - transaction.amount
        }
        return acc
    }, 0)
    setTotalExpenses(totalExpenses)
  }, [transactions]);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        amount,
        totalExpenses,
        updateTransaction,
        setTransactions,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactionsContext(): ContextValue {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error(
      "useTransactionsContext must be used within a TransactionsContextProvider"
    );
  }
  return context;
}
