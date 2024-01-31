import { StyleSheet, View, TouchableOpacity } from "react-native";
import React, { useMemo, useState } from "react";
import { ProgressBar, Text } from "react-native-paper";
import Theme from "theme/colors";
import { useUserContext } from "context/UserContext";
import { formatCurrency } from "../../utils";
import { useNavigation } from "@react-navigation/native";


type Props = {
  budgetId: string;
};

export default function BudgetItem({ budgetId }: Props) {
  const [progress, setProgress] = useState(0);
  const [progressIconWidth, setProgressIconWidth] = useState(0);
  const [progressContainerWidth, setProgressContainerWidth] = useState(0);
  const { user } = useUserContext();
  const navigation = useNavigation<any>();
  
  if(!user) return 
  const budget = user.budgets?.find(budget => budget.id === budgetId)

  if(!budget) return
  const transactionsTotal = useMemo(() => {
    const totalBudgetExpenses = budget.transactions?.reduce((acc, transaction) => {
      if(!transaction) return 0
      else return  (acc + transaction.amount) 
    }, 0)

    setProgress(() => {
      const percentage = (Math.abs(totalBudgetExpenses) / budget.amount || 0)
      return percentage > 1 ? 1 : percentage
    })
    return totalBudgetExpenses || 0
  }, [user.budgets])

  const percetageLeftPosition =
    progressContainerWidth * progress - progressIconWidth / 2;

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => {
        navigation.navigate('TransactionNavigator', { screen: 'NewTransaction', params:{budget} })
      }}
    >
      <View style={[styles.container]}>
        <View style={styles.topRow}>
          <View style={styles.topLeft}>
            <Text style={{ fontWeight: "bold", fontSize: 20, color: Theme.colors.text }}>
              {budget.name}
            </Text>
          </View>
          <View style={styles.topRight}>
            <Text style={{ fontWeight: "bold", fontSize: 20, color: progress >=1 ? Theme.colors.danger : Theme.colors.text }}>
              {formatCurrency(budget.amount - transactionsTotal, user!.currency)}
            </Text>
            <Text variant="bodySmall" style={{color: Theme.colors.textLight}}>Total Budget {budget.amount}&euro;</Text>
          </View>
        </View>
        <View
          onLayout={(e) =>
            setProgressContainerWidth(e.nativeEvent.layout.width)
          }
          style={[styles.progress]}
        >
          <View
            onLayout={(e) => setProgressIconWidth(e.nativeEvent.layout.width)}
            style={[styles.percent, { left: percetageLeftPosition }]}
          >
            <Text variant="labelLarge" style={{color: Theme.colors.text}}>{Math.round(progress * 100)}%</Text>
          </View>
          <ProgressBar
            style={[styles.progressBar, {backgroundColor: Theme.colors.textLight}]}
            
            progress={progress}
            color={progress >= 1 ? Theme.colors.red : Theme.colors.blue}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 10,
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 28,
  },
  topRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15
  },
  topLeft: {},

  topRight: {
    alignItems: "flex-end",
  },
  progress: {},
  percent: {
    borderColor: Theme.colors.lightGray,
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 5,
    alignSelf: "flex-start",
    backgroundColor: Theme.colors.tertiary
  },
  progressBar: {
    backgroundColor: Theme.colors.lightGray,
    height: 10,
    borderRadius: 5,
  },
});
