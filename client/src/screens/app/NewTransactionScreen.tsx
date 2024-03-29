import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { formatDate } from "../../../utils";
import { Calendar } from "react-native-calendars";
import Theme from "theme/colors";
import { useNavigation } from "@react-navigation/native";
import { createTransaction, deleteBudgetApi } from "../../../api";
import { useUserContext } from "context/UserContext";
import { FontAwesome5 } from "@expo/vector-icons";

const today = new Date();
const todayString = `${today.getFullYear()}-${(today.getMonth() + 1)
  .toString()
  .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

export default function NewTransactionScreen({ route }: any) {
  const { budget } = route.params;
  const [date, setDate] = useState(todayString);
  const [amount, setAmount] = useState<string>();
  const [description, setDescription] = useState("");
  const navigation = useNavigation();
  const { addTransaction } = useUserContext();
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteBudget } = useUserContext();

  const markedDays = date
    ? {
        [date]: {
          selected: true,
          marked: true,
          selectedColor: Theme.colors.blue,
        },
      }
    : {};

  function submit() {
    if (!amount || !description || !date) return;
    const transaction: Transaction = {
      createdAt: date === todayString ? new Date() : new Date(date),
      amount: Number(amount),
      description,
      type: "expense",
    };

    setIsFetching(true);
    createTransaction(transaction, budget.id)
      .then((data) => {
        if (data.status === "success") {
          const newTransaction = data.transaction;
          newTransaction.budgetId = budget.id;
          addTransaction(newTransaction);
          navigation.goBack();
        } else {
          throw new Error(data.message);
        }
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }

  function cancel() {
    navigation.goBack();
  }

  function handleDeleteBudget() {
    setIsDeleting(true);
    deleteBudget(budget.id);
    deleteBudgetApi(budget.id)
      .then((data) => {
        if (data.status === "success") {
          navigation.goBack();
        } else {
          throw new Error(data.message);
        }
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text variant="headlineMedium" style={{ color: Theme.colors.text }}>
          {budget.name}
        </Text>
        <TouchableOpacity onPress={handleDeleteBudget}>
          <FontAwesome5 name="trash" size={20} color={Theme.colors.danger} />
        </TouchableOpacity>
      </View>
      <View style={styles.inputs}>
        <View>
          <Text style={{ color: Theme.colors.textLight }}>
            How much did you spend?
          </Text>
          <TextInput
            label="Amount"
            keyboardType="numeric"
            mode="outlined"
            onChangeText={(text) => {
              if (text.match(/^(\d*\.{0,1}\d{0,2}$)/)) {
                setAmount(text);
              }
            }}
            value={amount?.toString()}
          />
        </View>
        <View>
          <Text style={{ color: Theme.colors.textLight }}>
            What did you buy?
          </Text>

          <TextInput
            label="Description"
            mode="outlined"
            onChangeText={(text) => setDescription(text)}
          />
        </View>
      </View>
      <View>
        <Text style={{ color: Theme.colors.textLight, marginBottom: 5 }}>
          Pick the date of the transaction
        </Text>
        <Calendar
          style={styles.calendar}
          markedDates={markedDays}
          onDayPress={(day) => setDate(day.dateString)}
        />
      </View>
      {isFetching ? (
        <ActivityIndicator size={40} color={Theme.colors.blue} />
      ) : (
        <View style={styles.buttons}>
          <Button
            style={styles.cancel}
            mode="outlined"
            textColor={Theme.colors.danger}
            onPress={cancel}
          >
            Cancel
          </Button>
          <Button
            style={styles.add}
            textColor={Theme.colors.text}
            buttonColor={Theme.colors.tertiary}
            mode="contained"
            onPress={submit}
          >
            Add Transaction
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    padding: 10,
    justifyContent: "space-around",
    backgroundColor: Theme.colors.secondary,
    flex: 1,
    height: "100%",
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  inputs: {
    gap: 10,
  },
  calendar: {
    borderRadius: 10,
    width: "90%",
    alignSelf: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cancel: {
    borderColor: Theme.colors.danger,
  },
  add: {},
});

export type Transaction = {
  type: string;
  amount: number;
  description: string;
  createdAt: Date;
};
