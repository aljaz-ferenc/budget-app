import { ScrollView, StyleSheet, View } from "react-native";
import React, { ReactNode, useMemo, useState } from "react";
import Theme from "theme/colors";
import { Text, PaperProvider, Button, useTheme } from "react-native-paper";
import NewBudget from "components/NewBudget";
import { useUserContext } from "context/UserContext";

import { formatCurrency } from "../../../utils";
import TransactionItem from "components/TransactionItem";
import { LinearGradient } from "expo-linear-gradient";

type Transaction = {
  _id: string;
  amount: number;
  category: string;
  item: string;
  createdAt: string;
  budgetId: string;
  description: string;
  type: "income" | "expense" | "saving";
  userId: string;
};

export default function HomeScreen({ navigation }: any) {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const { user} = useUserContext();
  const theme = useTheme();
  const {
    getAllTransactions,
    getTotalExpenses,
    getTotalSaved,
    getTotalBudget,
    getTotalIncome
  } = useUserContext();

  if (!user) return;
  const transactions = getAllTransactions(user);

  const totalExpenses = useMemo(() => getTotalExpenses(user), [user.budgets]) || 0;
  const totalIncome = useMemo(() => getTotalIncome(user), [user.incomes]) || 0;
  const totalSavings = useMemo(() => getTotalSaved(user), [user.savings]) || 0;
  const totalBudget = useMemo(() => getTotalBudget(user), [user.budgets]) || 0;
  const totalBalance = totalIncome - totalExpenses

  return (
    <PaperProvider>
      <ScrollView
        style={{ backgroundColor: Theme.colors.primary, paddingTop: 25 }}
      >
        <NewBudget
          modalIsVisible={modalIsVisible}
          setModalIsVisible={setModalIsVisible}
        />
        <View style={styles.container}>
          <View style={styles.display}>
            <LinearGradient
              colors={[Theme.colors.secondary, Theme.colors.primary]}
              style={{
                flex: 1,
                position: "absolute",
                width: "100%",
                height: "100%",
                padding: 20,
                borderRadius: 10,
              }}
            />
            <Text
              variant="bodyMedium"
              style={{ color: Theme.colors.text, marginTop: 20 }}
            >
              Balance
            </Text>
            <View style={styles.balance}>
              <Text
                style={[
                  styles.amount,
                  {
                    color:
                      totalBalance < 0
                        ? Theme.colors.danger
                        : Theme.colors.text,
                  },
                ]}
              >
                {formatCurrency(totalBalance, user!.currency)}
              </Text>
            </View>
            <View style={styles.accountSummary}>
              <AccountSummaryItem type="Income" amount={totalIncome} />
              <AccountSummaryItem type="Expenses" amount={totalExpenses} />
              <AccountSummaryItem type="Savings" amount={totalSavings} />
            </View>
          </View>
          <View style={styles.addBtns}>
            <Button
              mode="outlined"
              textColor={Theme.colors.tertiary}
              style={{ borderColor: Theme.colors.tertiary }}
              onPress={() => {
                navigation.navigate("TransactionNavigator", {
                  screen: "NewIncome",
                });
              }}
            >
              Add Income
            </Button>
            <Button
              mode="contained"
              buttonColor={Theme.colors.tertiary}
              onPress={() => navigation.navigate("Budget")}
            >
              Add Expense
            </Button>
          </View>
          <View style={styles.budgetSummaryContainer}>
            <View style={styles.budgetSummaryTop}>
              <Text
                variant="titleLarge"
                style={{ fontWeight: "bold", color: "white" }}
              >
                Budget summary
              </Text>
              <Text
                onPress={() => navigation.navigate("Budget")}
                style={{
                  color: Theme.colors.link,
                  fontWeight: "bold",
                  textDecorationLine: "underline",
                }}
              >
                Manage budget
              </Text>
            </View>
            <View style={styles.summaryTilesColumnsContainer}>
              <View style={styles.summaryTilesColumn}>
                <BudgetSummaryTile
                  title="Total budget"
                  amount={totalBudget}
                  currency={user?.currency}
                />
                <BudgetSummaryTile
                  title="Budget spent"
                  amount={totalExpenses}
                  currency={user?.currency}
                />
              </View>
              <View style={styles.summaryTilesColumn}>
                <BudgetSummaryTile
                  title="Remaining budget"
                  amount={totalBudget - totalExpenses}
                  currency={user?.currency}
                />
                <BudgetSummaryTile
                  title="Savings"
                  amount={totalSavings|| 0}
                  currency={user?.currency}
                />
              </View>
            </View>
          </View>
          <View style={styles.recentTransactionsContainer}>
            <View style={styles.budgetSummaryTop}>
              <Text
                variant="titleLarge"
                style={{ fontWeight: "bold", color: Theme.colors.text }}
              >
                Recent transactions
              </Text>
              <Text
                onPress={() => navigation.navigate("Transactions")}
                style={{
                  color: Theme.colors.link,
                  fontWeight: "bold",
                  textDecorationLine: "underline",
                }}
              >
                View all
              </Text>
            </View>
            {transactions.map((transaction, i) => {
              if (i < 5) {
                return (
                  <TransactionItem
                    key={transaction._id}
                    transaction={transaction}
                  />
                );
              }
            })}
          </View>
        </View>
      </ScrollView>
    </PaperProvider>
  );
}

type SummaryItemProps = {
  type: string;
  amount: number;
};

function AccountSummaryItem({ type, amount }: SummaryItemProps) {
  const { user } = useUserContext();
  return (
    <View
      style={{
        backgroundColor: Theme.colors.secondary,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Theme.colors.border
      }}
    >
      <Text
        variant="bodySmall"
        style={{ color: Theme.colors.text, textAlign: "center" }}
      >
        {type}
      </Text>
      <Text
        variant="bodyMedium"
        style={{
          color: Theme.colors.text,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {formatCurrency(amount, user!.currency)}
      </Text>
    </View>
  );
}

type BudgetSummaryTileProps = {
  title: string;
  amount: number;
  currency?: string;
};

function BudgetSummaryTile({
  title,
  amount,
  currency,
}: BudgetSummaryTileProps) {
  currency = currency || "%";

  return (
    <View style={styles.budgetSummaryTileContainer}>
      <View style={styles.budgetSummaryTileLeft}></View>
      <View style={styles.budgetSummaryTileRight}>
        <Text variant="bodySmall" style={styles.budgetSummaryTileTitle}>
          {title}
        </Text>
        <Text variant="bodyLarge" style={styles.budgetSummaryTileAmount}>
          {formatCurrency(amount, currency)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: Theme.colors.primary,
  },
  display: {
    width: "100%",
    backgroundColor: Theme.colors.secondary,
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  amount: {
    color: Theme.colors.text,
    fontSize: 35,
    fontFamily: "monospace",
    fontWeight: "bold",
  },
  totalExpenses: {
    color: Theme.colors.danger,
    fontWeight: "bold",
    marginBottom: 20,
  },
  balance: {
    flexDirection: "row",
    marginVertical: 20,
  },
  budgetSummaryContainer: {
    marginBottom: 30,
  },
  accountSummary: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  budgetSummaryTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 20,
  },
  budgetSummaryTileContainer: {
    flexDirection: "row",
    borderRadius: 5,
    backgroundColor: Theme.colors.secondary,
    padding: 10,
    borderWidth: 1,
    borderColor: Theme.colors.border
  },
  summaryTiles: { flexDirection: "row", justifyContent: "space-between" },
  budgetSummaryTileTitle: {
    color: Theme.colors.text,
  },
  budgetSummaryTileAmount: {
    fontWeight: "bold",
    color: Theme.colors.text,
  },
  budgetSummaryTileLeft: {},
  budgetSummaryTileRight: {},
  summaryTilesColumn: {
    flexDirection: "column",
    width: "50%",
    gap: 15,
  },
  summaryTilesColumnsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 15,
  },
  addBtns: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 30,
  },
  recentTransactionsContainer: {},
});
