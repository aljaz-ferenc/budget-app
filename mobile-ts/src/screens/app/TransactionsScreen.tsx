import { FlatList, StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { useUserContext } from 'context/UserContext'
import { getTransactions } from '../../../api'
import { useIsFocused } from '@react-navigation/native'
import Toast from 'react-native-root-toast'
import { useTransactionsContext } from 'context/TransactionsContext'
import Theme from 'theme/colors'
import TransactionItem from 'components/TransactionItem'

export default function TransactionsScreen() {
  const [serverError, setServerError]=useState<string>('')
  const {user} = useUserContext()
  const {getAllTransactions} = useUserContext()

if(!user) return
  const transactions = useMemo(() => getAllTransactions(user), [user?.incomes, user?.budgets, user?.savings])

  return (
    <View style={styles.container}>
      {transactions.length > 0 &&<View style={styles.recentTransactions}>
        <FlatList
        keyExtractor={(item) => item._id}
          data={transactions}
          renderItem={({ item }) => <TransactionItem transaction={item} />}
        />
      </View>}
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    padding: 10,
    paddingTop: 25,
    backgroundColor: Theme.colors.primary,
    flex: 1
  },
  recentTransactions: {
  },
})

type Transaction = {
  _id: string,
  amount: number,
  category: string,
  item: string,
  createdAt: string,
  budgetId: string,
  description: string, 
  type: 'income'|'expense'|'saving',
  userId: string
}