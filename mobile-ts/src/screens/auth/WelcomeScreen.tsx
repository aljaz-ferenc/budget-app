import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import { RouteProp } from "@react-navigation/native";
// import Button from "../../components/Button";
import LinearGradient from "../../components/LnearGradient";
import { ActivityIndicator, Button } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { autoLogin } from "../../../api";
import { useUserContext } from "context/UserContext";
import { useTransactionsContext } from "context/TransactionsContext";
import Theme from "theme/colors";

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Welcome">;
}

export default function WelcomeScreen({ navigation }: Props) {
  const [isFetching, setIsFetching] = useState(false);
  const { user, updateLoggedInStatus, setUser } = useUserContext();
  const { setTransactions } = useTransactionsContext();

  useEffect(() => {
    const token = SecureStore.getItem("budget-app");
    if (!token) return;
    setIsFetching(true);
    autoLogin()
      .then((data) => {
        updateLoggedInStatus(true);
        setUser(data.user);
        navigation.replace("AppNavigator");
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => setIsFetching(false));
  }, []);

  return (
    <>
      {isFetching ? (
        <View style={styles.fetching}>
          <ActivityIndicator size={80} color={Theme.colors.blue} />
        </View>
      ) : (
        <View style={styles.container}>
          {/* <LinearGradient /> */}
          <Button
            mode="contained"
            style={{ width: "50%" }}
            buttonColor={Theme.colors.tertiary}

            onPress={() => navigation.replace("Login")}
          >
            Login
          </Button>
          <Button
            mode="contained"
            style={{ width: "50%" }}
            buttonColor={Theme.colors.tertiary}
            onPress={() => navigation.replace("Register")}
          >
            Register
          </Button>
        </View>
      )}
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
    backgroundColor: Theme.colors.secondary
  },
  image: {
    flex: 1,
    justifyContent: "center",
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  fetching:{
    flex:1,
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  }
});
