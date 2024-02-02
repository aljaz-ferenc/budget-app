import { FlatList, StyleSheet, View, Button } from "react-native";
import React, { useMemo, useState } from "react";
import BudgetItem from "components/BudgetItem";
import { Text } from "react-native-paper";
import { useUserContext } from "context/UserContext";
import Theme from "theme/colors";
import NewBudget from "components/NewBudget";
import { FAB, Provider } from "react-native-paper";
import { formatCurrency } from "../../../utils";
import { ProgressChart } from "react-native-chart-kit";

export default function BudgetScreen() {
  const { user } = useUserContext();
  const { getTotalBudget, getTotalExpenses } = useUserContext();
  const [modalIsVisible, setModalIsVisible] = useState(false);

  if (!user) return;

  const totalBudget = useMemo(() => getTotalBudget(user), [user.budgets]);
  const totalExpense = useMemo(() => getTotalExpenses(user), [user.budgets]);

  const percentageSpent = useMemo(() => {
    if (!totalBudget || !totalExpense) return 0;
    const result = (totalExpense / totalBudget) * 100;
    if (!result) return 0;
    else return Math.round(result);
  }, [user.budgets]);


  return (
    <Provider>
      <View style={styles.budgets}>
        <FAB
          onPress={() => setModalIsVisible(true)}
          icon="plus"
          color="white"
          style={styles.fab}
        />
        <View style={styles.chart}>
          <NewBudget
            modalIsVisible={modalIsVisible}
            setModalIsVisible={setModalIsVisible}
          />
          <View style={styles.pieContainer}>
            <ProgressChart
              data={[percentageSpent > 1 ? 1 : percentageSpent]}
              hideLegend={true}
              width={300}
              height={300}
              radius={130}
              strokeWidth={20}
              chartConfig={{
                backgroundGradientFrom: Theme.colors.secondary,
                backgroundGradientTo: Theme.colors.secondary,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
            />
            <View style={styles.centerContent}>
              <Text
                variant="displaySmall"
                style={{ fontWeight: "bold", color: Theme.colors.text }}
              >
                {percentageSpent ?? 0}%
              </Text>
              <Text variant="bodyMedium" style={{ color: Theme.colors.text }}>
                {formatCurrency(totalBudget - totalExpense, user.currency)} left
                of {formatCurrency(totalBudget, user.currency)}
              </Text>
            </View>
          </View>
        </View>
       {user.budgets.length > 0 ? <View style={styles.budgetsList}>
          {user?.budgets.length > 0 && (
            <FlatList
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              data={user?.budgets}
              renderItem={({ item }) => {
                return item.id ? <BudgetItem budgetId={item.id} /> : null;
              }}
            />
          )}
        </View> : <Text style={styles.emptyBudgetsText}>Create your first budget</Text>}
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  budgets: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    flex: 1,
    paddingTop: 25,
    padding: 10,
    backgroundColor: Theme.colors.primary,
  },
  chart: {
    borderRadius: 10,
    backgroundColor: Theme.colors.secondary,
  },
  fab: {
    backgroundColor: Theme.colors.blue,
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 10,
    zIndex: 2,
  },
  pieContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerContent: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  budgetsList: {
    padding: 10,
    backgroundColor: Theme.colors.secondary,
    borderRadius: 10,
  },
  emptyBudgetsText:{
    textAlign:'center',
    color: Theme.colors.secondary,
    fontSize: 24,
    flex:1,
    textAlignVertical: 'center'
  }
});
