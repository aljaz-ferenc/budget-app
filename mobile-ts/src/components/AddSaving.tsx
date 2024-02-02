import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { Saving } from "../../types";
import Theme from "theme/colors";
import { useUserContext } from "context/UserContext";
import { deleteSavingApi, updateSavingApi } from "../../api";
import { FontAwesome5 } from "@expo/vector-icons";

type Props = {
  saving: Saving;
  modalIsVisible: boolean;
  setModalIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddSaving({
  saving,
  modalIsVisible,
  setModalIsVisible,
}: Props) {
  const [amount, setAmount] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false)
  const { updateSaving, deleteSaving } = useUserContext();

  function handleAddFunds() {
    setIsFetching(true);
    updateSavingApi(saving.id, +amount)
      .then((data) => {
        if (data.status === "success") {
          updateSaving(saving.id, Number(amount));
          setModalIsVisible(false);
          setAmount("");
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

  function handleRemoveFunds() {
    if(+amount > saving.saved) return
    setIsFetching(true);
    updateSavingApi(saving.id, Number(-amount))
      .then((data) => {
        if (data.status === "success") {
          updateSaving(saving.id, Number(-amount));
          setModalIsVisible(false);
          setAmount("");
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

  function handleDismiss() {
    if(isDeleting || isFetching) return
    setModalIsVisible(false);
    setAmount("");
  }

  function handleDeleteSaving(){
    setIsDeleting(true)
    deleteSavingApi(saving.id)
      .then(data => {
        if(data.status === 'success'){
          deleteSaving(saving.id)
          setModalIsVisible(false)
        }
      })
      .catch(err => {
        console.log(err.message)
      })
      .finally(() => setIsDeleting(false))
  }

  return (
    <Portal>
      <Modal
        style={styles.modal}
        visible={modalIsVisible}
        onDismiss={handleDismiss}
      >
        <View style={styles.container}>
          <View style={styles.top}>
            <Text variant="titleLarge" style={styles.title}>
              {saving.name}
            </Text>
            {isDeleting ?  <ActivityIndicator animating={true} color={Theme.colors.danger}/>:<TouchableOpacity onPress={handleDeleteSaving}>
              <FontAwesome5
                name="trash"
                size={20}
                color={Theme.colors.danger}
              />
            </TouchableOpacity>}
          </View>
          <View>
            <Text style={{ color: Theme.colors.textLight }}>Amount</Text>
            <TextInput
              keyboardType="numeric"
              mode="outlined"
              value={amount}
              onChangeText={(text) => {
                if (text.match(/^(\d*\.{0,1}\d{0,2}$)/)) {
                  setAmount(text);
                }
              }}
            />
          </View>
          {isFetching ? (
            <ActivityIndicator
              animating={true}
              color={Theme.colors.secondary}
            />
          ) : (
            <View style={styles.buttons}>
              <Button
                mode="outlined"
                textColor={Theme.colors.tertiary}
                style={{ borderColor: Theme.colors.tertiary }}
                onPress={handleRemoveFunds}
              >
                Remove funds
              </Button>
              <Button
                mode="contained"
                textColor={Theme.colors.text}
                buttonColor={Theme.colors.tertiary}
                onPress={handleAddFunds}
              >
                Add funds
              </Button>
            </View>
          )}
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    padding: 10,
    borderRadius: 10,
  },
  container: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 10,
    padding: 20,
    gap: 20,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    color: Theme.colors.text,
  },
  buttons: {
    justifyContent: "space-around",
    flexDirection: "row",
  },
});
