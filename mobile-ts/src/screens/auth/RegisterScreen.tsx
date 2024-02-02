import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import Theme from "theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useUserContext } from "context/UserContext";
import LinearGradient from "../../components/LnearGradient";
import { Text, TextInput, Button } from "react-native-paper";
import { registerUser } from "../../../api";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function RegisterScreen({ navigation }: Props) {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [passwordConfirmIsVisible, setPasswordConfirmIsVisible] =
    useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { updateLoggedInStatus, setUser } = useUserContext();

  async function handleRegister(userData: RegisterUserData) {
    setIsFetching(true);
    registerUser(userData)
      .then((data) => {
        if (data.status === "success") {
          updateLoggedInStatus(true);
          setUser(data.user);
          navigation.replace("AppNavigator");
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

  return (
    <>
      {/* <LinearGradient /> */}
      <View style={styles.container}>
        <Text variant="displaySmall" style={{color: Theme.colors.text}}>Register!</Text>
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            mode="outlined"
            label="Username"
            value={userData?.username}
            style={styles.input}
            onChangeText={(text) =>
              setUserData((prev) => ({ ...prev, username: text }))
            }
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            mode="outlined"
            label="Email"
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
            label="Password"
            mode="outlined"
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
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            mode="outlined"
            label="Confirm password"
            secureTextEntry={passwordConfirmIsVisible}
            value={userData?.passwordConfirm}
            style={[styles.input]}
            right={
              <TextInput.Icon
                icon="eye"
                onPress={() =>
                  setPasswordConfirmIsVisible(!passwordConfirmIsVisible)
                }
              />
            }
            onChangeText={(text) =>
              setUserData((prev) => ({ ...prev, passwordConfirm: text }))
            }
          />
        </View>
        {isFetching ? (
          <ActivityIndicator size={40} color={Theme.colors.blue} />
        ) : (
          <Button mode="contained" buttonColor={Theme.colors.tertiary} onPress={() => handleRegister(userData)}>
            Register
          </Button>
        )}
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text variant="labelLarge" style={{color: Theme.colors.text}}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text variant="labelLarge" style={styles.link}>
              Login
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
    backgroundColor: Theme.colors.secondary
  },
  inputContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    justifyContent: 'center',
    width: "100%",
  },
  inputActive: {
    borderColor: Theme.colors.blue,
  },
  link: {
    color: Theme.colors.textLight,
    textDecorationLine: 'underline'
  },

});

type RegisterUserData = {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
};
