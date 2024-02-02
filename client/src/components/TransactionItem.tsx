import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import Theme from "theme/colors";
import { formatCurrency } from "../../utils";
import { useUserContext } from "context/UserContext";
import { Text } from "react-native-paper";
import { Transaction } from "../../types";
import { useNavigation } from "@react-navigation/native";

type Props = {
  transaction: Transaction;
};


enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
  SAVING = "saving",
}

export default function TransactionItem({ transaction }: Props) {
  const { user } = useUserContext();
  const navigation = useNavigation<any>()
  const budget = user?.budgets.find(
    (budget) => budget.id === transaction.budgetId
  );
  console.log(transaction)

  function handleTransactionPress(){
    navigation.navigate('TransactionNavigator', { screen: 'UpdateTransaction', params:{transaction} })
  }

  return (
    <TouchableOpacity onPress={handleTransactionPress} style={styles.transactionItem}>
      <View style={styles.column}>
        <Text
          variant="bodyLarge"
          style={[styles.item, { color: Theme.colors.text }]}
        >
          {transaction.description}
        </Text>
        <Text variant="bodySmall" style={{ color: Theme.colors.textLight }}>
          {budget?.name}
        </Text>
      </View>
      <View style={styles.column}>
        <Text
          variant="bodyLarge"
          style={[
            styles.amount,
            { color: getTransactionColor(transaction.type) },
          ]}
        >
          {transaction.type === TransactionType.EXPENSE ? "-" : ""}
          {formatCurrency(transaction.amount, "EUR")}
        </Text>
        <Text variant="bodySmall" style={{ color: Theme.colors.textLight }}>
          {new Date(transaction.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function getTransactionColor(transactionType: string) {
  return transactionType === TransactionType.EXPENSE
    ? Theme.colors.danger
    : Theme.colors.success;
}

const styles = StyleSheet.create({
  transactionItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: Theme.colors.secondary,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
    borderColor: Theme.colors.border,
    borderWidth: 1
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  item: {
    fontWeight: "bold",
    fontSize: 16,
  },
  column: {
    gap: 5,
  },
});
