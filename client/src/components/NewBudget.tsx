import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Modal, Portal, TextInput, Text, Button, HelperText } from "react-native-paper";
import { createBudget, updateUser } from "../../api";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { useUserContext } from "context/UserContext";
import Theme from "theme/colors";

type Props = {
  modalIsVisible: boolean;
  setModalIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewBudget({
  modalIsVisible,
  setModalIsVisible,
}: Props) {
  const [budget, setBudget] = useState({ name: "", amount: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {addBudget} = useUserContext()

  function onCancel() {
    setModalIsVisible(false);
    setBudget({ name: "", amount: "" });
  }

  function onSubmit() {
    if (!budget.name || !budget.amount) return;
    const newBudget = {
        name: budget.name,
        amount: Number(budget.amount)
    }
    setIsSubmitting(true);
    createBudget(newBudget)
      .then((data) => {
        const budget = data.budget
        budget.transactions = []
        addBudget(budget)
        setModalIsVisible(false)
        setBudget({name: '', amount: ''})
      })
      .catch((err) => console.log(err))
      .finally(() => setIsSubmitting(false));
  }

  return (
    <Portal>
      <Modal
        contentContainerStyle={{
          backgroundColor: Theme.colors.primary,
          padding: 10,
          borderRadius: 10,
        }}
        visible={modalIsVisible}
        onDismiss={() => setModalIsVisible(false)}
        style={styles.modalContainer}
      >
        <View style={styles.newBudgetContainer}>
          <View style={styles.newBudgetContent}>
            <Text variant="titleLarge" style={styles.newBudgetHeading}>
              New Budget
            </Text>
            <View style={styles.input}>
              <Text style={{color:Theme.colors.textLight}}>What expense do you want to track?</Text>
              <TextInput
                label="Name"
                mode="outlined"
                value={budget.name}
                onChangeText={(text) =>
                  setBudget((prev) => ({ ...prev, name: text }))
                }
              ></TextInput>
            </View>
            <View style={styles.input}>
              <Text style={{color:Theme.colors.textLight}}>How much do you want to spend on it?</Text>
              <TextInput
              keyboardType="numeric"
              mode="outlined"
              label="Amount"
                value={budget.amount}
                onChangeText={(text) =>
                  setBudget((prev) => ({ ...prev, amount: text }))
                }
              ></TextInput>
            </View>
            {isSubmitting ? (
              <ActivityIndicator animating={true} color={MD2Colors.red800} />
              ) : (
              <View style={styles.buttons}>
                <Button style={{ flex: 1}} buttonColor={Theme.colors.tertiary} textColor={Theme.colors.text} mode="contained" onPress={onSubmit}>
                  Save
                </Button>
                <Button
                  style={{ flex: 1, borderColor: Theme.colors.danger }}
                  mode="outlined"
                  textColor={Theme.colors.danger}
                  onPress={onCancel}
                >
                  Cancel
                </Button>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  newBudgetContainer: {
    padding: 20
  },
  newBudgetContent: {},
  newBudgetHeading: {
    marginBottom: 20,
    color:Theme.colors.text,
  fontWeight: 'bold'
  },
  modalContainer: {
    padding: 20,
  },
  input: {
    marginBottom: 10,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
});

export type BudgetAsProp = {
  name: string;
  amount: number;
};
