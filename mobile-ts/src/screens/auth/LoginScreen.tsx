import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import Theme from "theme/colors";
import { useUserContext } from "context/UserContext";
import LinearGradient from "../../components/LnearGradient";
import { loginUser } from "../../../api";
import { useTransactionsContext } from "context/TransactionsContext";
import { Text, TextInput, Button } from "react-native-paper";
import * as SecureStore from "expo-secure-store";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function LoginScreen({ navigation }: Props) {
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({
    email: "a",
    password: "aaaaaa",
  });

  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { user, updateLoggedInStatus, setUser } = useUserContext();
  const { setTransactions } = useTransactionsContext();

  async function handleLogin(userData: LoginUserData) {
    if (!userData.email || userData.password.length < 6) return;

    setError("");
    setIsFetching(true);
    loginUser(userData)
      .then((data) => {
        updateLoggedInStatus(true);
        setUser(data.user);
        navigation.replace('AppNavigator')
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setIsFetching(false));
  }

  return (
    <>
      <LinearGradient />
      <View style={styles.container}>
        <Text variant="displaySmall">
          Welcome Back!
        </Text>
        {error && <Text>{error}</Text>}
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            label="Email"
            mode="outlined"
            value={userData?.email}
            style={styles.input}
            onChangeText={(text) =>
              setUserData((prev) => ({ ...prev, email: text }))
            }
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            mode="outlined"
            label="Password"
            secureTextEntry={passwordIsVisible}
            value={userData?.password}
            style={styles.input}
            right={
              <TextInput.Icon
                icon="eye"
                onPress={() => setPasswordIsVisible(!passwordIsVisible)}
              />
            }
            onChangeText={(text) =>
              setUserData((prev) => ({ ...prev, password: text }))
            }
          />
        </View>
        {isFetching ? (
          <ActivityIndicator 
          size={40} 
          color={Theme.colors.blue} />
        ) : (

          <Button 
          onPress={() => handleLogin(userData)} 
          mode="contained">
            Login
          </Button>
        )}
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text variant="labelLarge">Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text variant="labelLarge" style={styles.link}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    padding: 10,
  },
  inputContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    width: "100%",
  },
  link: {
    color: Theme.colors.blue,
  },
  button: {
    width: "100%",
  },
  disabled: {
    backgroundColor: Theme.colors.gray,
  },
  action: {
    color: Theme.colors.gray,
    fontSize: 24,
    textAlign: "left",
    alignSelf: "flex-start",
  },
});

export type LoginUserData = {
  email: string;
  password: string;
};
