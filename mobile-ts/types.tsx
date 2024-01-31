import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Welcome: undefined,
    Login: undefined,
    Register: undefined,
    AppNavigator: undefined
    TransactionNavigator: undefined
}

export type RootTabNavigatorList = {
  Home: undefined
  Settings: undefined
  Transactions: undefined
  Budget: undefined
  Savings: undefined
}

export type TransactionStackParamList={
  UpdateTransaction: undefined
  NewTransaction: undefined
  NewIncome: undefined
}

export type Transaction = {
  _id: string;
  amount: number;
  item: string;
  createdAt: string;
  budgetId?: string;
  description: string;
  type: TransactionType
};

export type Budget  ={
  name: string,
  amount: number,
  createdAt: Date,
  id: string,
  transactions: Transaction[]
}

export type Saving  ={
  name: string,
  amount: number,
  createdAt: Date,
  id: string,
  saved: number
}

export type TransactionType = "income" | "expense" | "saving";