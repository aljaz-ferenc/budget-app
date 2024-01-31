import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Modal, Portal, TextInput, Text, Button } from "react-native-paper";
import { createSaving } from "../../api";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { useUserContext } from "context/UserContext";
import Theme from "theme/colors";

type Props = {
  modalIsVisible: boolean;
  setModalIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewSaving({
  modalIsVisible,
  setModalIsVisible,
}: Props) {
  const [saving, setSaving] = useState({ name: "", amount: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {addSaving} = useUserContext()

  function onCancel() {
    setModalIsVisible(false);
    setSaving({ name: "", amount: "" });
  }

  function onSubmit() {
    if (!saving.name || !saving.amount) return;
    const newSaving = {
        name: saving.name,
        amount: Number(saving.amount)
    }
    setIsSubmitting(true);
    createSaving(newSaving)
      .then((data) => {
        const saving = data.saving
        addSaving(saving)
        setModalIsVisible(false)
        setSaving({name: '', amount: ''})
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
              New Saving
            </Text>
            <View style={styles.input}>
              <Text style={{color:Theme.colors.textLight}}>What are you saving for?</Text>
              <TextInput
                label="Item"
                mode="outlined"
                value={saving.name}
                onChangeText={(text) =>
                  setSaving((prev) => ({ ...prev, name: text }))
                }
              ></TextInput>
            </View>
            <View style={styles.input}>
              <Text style={{color:Theme.colors.textLight}}>How much will it cost?</Text>
              <TextInput
              keyboardType="numeric"
              mode="outlined"
              label="Amount"
                value={saving.amount}
                onChangeText={(text) =>
                  setSaving((prev) => ({ ...prev, amount: text }))
                }
              ></TextInput>
            </View>
            {isSubmitting ? (
              <ActivityIndicator animating={true} color={Theme.colors.secondary} />
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

export type SavingAsProp = {
    name: string,
    amount: number
}