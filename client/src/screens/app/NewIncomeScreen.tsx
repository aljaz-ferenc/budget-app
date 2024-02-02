import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { formatDate } from "../../../utils";
import { Calendar } from "react-native-calendars";
import Theme from "theme/colors";
import { useNavigation } from "@react-navigation/native";
import { createTransaction } from "../../../api";
import { useUserContext } from "context/UserContext";
import { TransactionWithoutId } from "../../../types";

const today = new Date();
const todayString = `${today.getFullYear()}-${(today.getMonth() + 1)
  .toString()
  .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

export default function NewIncomeScreen({ route }: any) {
  // const { budget } = route.params;
  const [date, setDate] = useState(todayString);
  const [amount, setAmount] = useState<string>();
  const [description, setDescription] = useState("");
  const navigation = useNavigation();
  const { addTransaction } = useUserContext();
  const [isFetching, setIsFetching] = useState(false);

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
    console.log(amount, description, date)
    if (!amount || !description || !date) return;
    const transaction: TransactionWithoutId = {
      createdAt: date === todayString ? new Date() : new Date(date),
      amount: Number(amount),
      description,
      type: "income",
    };

    setIsFetching(true);
    createTransaction(transaction)
      .then((data) => {
        if (data.status === "success") {
          addTransaction(data.transaction);
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

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={{ color: Theme.colors.text, marginTop: 20 }}>
        New Income
      </Text>
      <View style={styles.inputs}>
        <View>
          <Text style={{ color: Theme.colors.textLight }}>
            How much did you earn?
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
            How did you earn it?
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
    padding: 10,
    justifyContent: "space-around",
    backgroundColor: Theme.colors.secondary,
    flex: 1,
    height: '100%'
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
  budgetId?: string;
  createdAt: Date;
};
