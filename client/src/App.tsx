import { CommonActions, NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./screens/auth/WelcomeScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import RegisterScreen from "./screens/auth/RegisterScreen";
import {
  RootStackParamList,
  RootTabNavigatorList,
  TransactionStackParamList,
} from "../types";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "screens/app/HomeScreen";
import UserContextProvider from "context/UserContext";
import Theme from "theme/colors";
import {
  BudgetIcon,
  HomeIcon,
  SavingsIcon,
  TransactionsIcon,
} from "components/TabBarIcons";
import TransactionsScreen from "screens/app/TransactionsScreen";
import BudgetScreen from "screens/app/BudgetScreen";
import SavingsScreen from "screens/app/SavingsScreen";
import { RootSiblingParent } from "react-native-root-siblings";
import TransactionsContextProvider from "context/TransactionsContext";
import NewTransactionScreen from "screens/app/NewTransactionScreen";
import { StatusBar } from "expo-status-bar";
import NewIncomeScreen from "screens/app/NewIncomeScreen";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { logoutUser } from "../api";
import  * as SecureStore  from 'expo-secure-store';
import UpdateTransactionScreen from "screens/app/UpdateTransactionScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabNavigatorList>();
const Transaction = createNativeStackNavigator<TransactionStackParamList>();

export default function App() {
  return (
    <TransactionsContextProvider>
      <UserContextProvider>
        <RootSiblingParent>
          <AuthStack />
        </RootSiblingParent>
      </UserContextProvider>
    </TransactionsContextProvider>
  );
}

const AuthStack = () => {
  return (
    <NavigationContainer>
      <StatusBar style={"light"} />
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          animation: "slide_from_left",
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="AppNavigator" component={AppStack} />
        <Stack.Screen
          name="TransactionNavigator"
          component={TransactionStack}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const TransactionStack = () => {
  return (
    <Transaction.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <StatusBar style={Theme.colors.statusBar}/> */}
      <Transaction.Screen
        name="NewTransaction"
        component={NewTransactionScreen}
      />
      <Transaction.Screen
        name="UpdateTransaction"
        component={UpdateTransactionScreen}
      />
      <Transaction.Screen name="NewIncome" component={NewIncomeScreen} />
    </Transaction.Navigator>
  );
};

const AppStack = ({navigation}: any) => {
  
  function logout() {
    logoutUser()
      .then(data => {
        if (data.status === 'success') {
          SecureStore.setItem('budget-app', '');
            navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login' }] // Replace 'LoginScreen' with the actual name of your login screen
            })
          );
        }else{
          throw new Error(data.message)
        }
      })
      .catch(err => {
        console.log('Could not log out')
      })
  }

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveBackgroundColor: Theme.colors.blue,
        tabBarActiveTintColor: "white",
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          backgroundColor: Theme.colors.secondary,
          borderColor: Theme.colors.secondary,
          borderTopWidth: 0,
        },
        // headerShown: false,
        headerTintColor: "white",
        headerRight: () => {
          return (
            <MaterialCommunityIcons
              name="logout"
              size={24}
              color="white"
              style={{ marginRight: 10 }}
              onPress={logout}
            />
          );
        },
        headerStyle: {
          backgroundColor: Theme.colors.secondary,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Overview",
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Budget"
        component={BudgetScreen}
        options={{
          tabBarIcon: ({ focused }) => <BudgetIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TransactionsIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Savings"
        component={SavingsScreen}
        options={{
          tabBarIcon: ({ focused }) => <SavingsIcon focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};
