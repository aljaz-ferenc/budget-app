import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import Theme from "theme/colors";
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  focused: boolean;
};

function setIconColor(focused: boolean) {
  return focused ? "white" : Theme.colors.gray;
}

function setTextColor(focused: boolean) {
  return focused ? "white" : Theme.colors.gray;
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 12,
  },
});

function setIconSize(focused: boolean){
    return focused ? 35 : 26
}

export function HomeIcon({ focused }: Props) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="home"
        size={setIconSize(focused) * 1.1}
        color={setIconColor(focused)}
      />
      {!focused && <Text style={[{ color: setTextColor(focused) }, styles.text]}>Home</Text>}
    </View>
  );
}
export function TransactionsIcon({ focused }: Props) {
  return (
    <View style={styles.container}>
      <FontAwesome6
        name="money-bill-transfer"
        size={setIconSize(focused) * .9}
        color={setIconColor(focused)}
      />
      {!focused && <Text style={[{ color: setTextColor(focused) }, styles.text]}>
        Transactions
      </Text>}
    </View>
  );
}

export function BudgetIcon({ focused }: Props) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="google-analytics"
        size={setIconSize(focused)}
        color={setIconColor(focused)}
      />
      {!focused && <Text style={[{ color: setTextColor(focused) }, styles.text]}>
        Budget
      </Text>}
    </View>
  );
}

export function SavingsIcon({ focused }: Props) {
    return (
      <View style={styles.container}>
        <MaterialIcons
          name="savings"
          size={setIconSize(focused)}
          color={setIconColor(focused)}
        />
        {!focused && <Text style={[{ color: setTextColor(focused) }, styles.text]}>
          Savings
        </Text>}
      </View>
    );
  }