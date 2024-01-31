import { BudgetAsProp } from "components/NewBudget";
import * as SecureStore from "expo-secure-store";
import { Transaction } from "screens/app/NewTransactionScreen";
import { LoginUserData } from "screens/auth/LoginScreen";
import { Saving } from "./types";
import { SavingAsProp } from "components/NewSaving";

const BASE_URL = "http://192.168.1.16:3000/api/v1";

export async function getTransactions(userId: string) {
  try {
    const response = await fetch(`${BASE_URL}/transactions/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "applicaton/json",
        Authorization: `Bearer ${SecureStore.getItem("budget-app")}`,
      },
    });

    const data = await response.json();

    if (data.status === "success") {
      return data.transactions;
    } else {
      throw new Error(data.message);
    }
  } catch (err: any) {
    throw err;
  }
}

export async function loginUser(userData: LoginUserData) {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.status === "success") {
      SecureStore.setItem("budget-app", data.token);

      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (err: any) {
    throw err;
  }
}

export async function autoLogin() {
  try {
    const response = await fetch(`${BASE_URL}/auth/auto-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SecureStore.getItem("budget-app")}`,
      },
    });

    const data = await response.json();
    if (data.status === "success") {
      SecureStore.setItem("budget-app", data.token);

      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (err: any) {
    throw err;
  }
}

export async function updateUser(updates: any) {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "PATCH",
      body: JSON.stringify(updates),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SecureStore.getItem("budget-app")}`,
      },
    });

    const data = await response.json();

    if (data.status === "success") {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (err) {
    throw err;
  }
}

export async function createBudget(budget: BudgetAsProp) {
  try {
    const response = await fetch(`${BASE_URL}/users/budgets`, {
      method: "POST",
      body: JSON.stringify(budget),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SecureStore.getItem("budget-app")}`,
      },
    });

    const data = await response.json();
    if (data.status === "success") {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (err) {
    throw err;
  }
}

export async function deleteBudgetApi(budgetId: string) {
  try {
    const response = await fetch(`${BASE_URL}/users/budgets`, {
      method: "DELETE",
      body: JSON.stringify({budgetId}),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SecureStore.getItem("budget-app")}`,
      },
    });

    const data = await response.json();
    if (data.status === "success") {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (err) {
    throw err;
  }
}

export async function createTransaction(
  transaction: Transaction,
  budgetId?: string
) {
  const body = {
    transaction,
    budgetId,
  };
  try {
    const response = await fetch(`${BASE_URL}/transactions`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SecureStore.getItem("budget-app")}`,
      },
    });

    const data = await response.json();
    if (data.status === "success") {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (err: any) {
    throw err;
  }
}

export async function updateTransactionApi() {}

export async function deleteTransactionApi(
  transactionId: string,
  transactionType: string,
  budgetId?: string,
) {
  const body = { transactionId, transactionType, budgetId };
  console.log('BODY ', body)
  try {
    const response = await fetch(`${BASE_URL}/transactions`, {
      method: "DELETE",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SecureStore.getItem("budget-app")}`,
      },
    });

    const data = await response.json();

    if (data.status === "success") {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (err: any) {
    throw err;
  }
}

export async function logoutUser() {
  try {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SecureStore.getItem("budget-app")}`,
      },
    });

    const data = await response.json();

    if (data.status === "success") {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (err: any) {
    throw err;
  }
}

export async function createSaving(saving: SavingAsProp) {
  try {
    const response = await fetch(`${BASE_URL}/users/savings`, {
      method: "POST",
      body: JSON.stringify(saving),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SecureStore.getItem("budget-app")}`,
      },
    });

    const data = await response.json();
    if (data.status === "success") {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (err) {
    throw err;
  }
}

export async function updateSavingApi(savingId: string, amount: number) {
  const body = { savingId, amount };

  try {
    const response = await fetch(`${BASE_URL}/users/savings`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SecureStore.getItem("budget-app")}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.status === "success") {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (err: any) {
    throw err;
  }
}

export async function deleteSavingApi(savingId: string) {
  const body = { savingId };

  try {
    const response = await fetch(`${BASE_URL}/users/savings`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SecureStore.getItem("budget-app")}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.status === "success") {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (err: any) {
    throw err;
  }
}
