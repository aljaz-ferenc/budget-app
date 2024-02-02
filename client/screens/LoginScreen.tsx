import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import Button from '../src/components/Button'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types'

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>
}

export default function LoginScreen({navigation}: Props) {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      <TextInput
        placeholder="Username"
        value={userData?.email}
        style={styles.input}
        onChangeText={(text) =>
          setUserData((prev) => ({ ...prev, username: text }))
        }
      />
      <TextInput
        placeholder="Email"
        value={userData?.email}
        style={styles.input}
        onChangeText={(text) =>
          setUserData((prev) => ({ ...prev, email: text }))
        }
      />
      <Button text='Back' onPress={() => navigation.pop()} style={{width:'50%'}}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 20
  },
  input:{
    borderWidth: 1,
    width:'80%',
    height: 50,
    borderRadius: 7,
    borderColor: '#ddd',
    paddingHorizontal: 10
  },
  heading:{
    fontSize: 30,
    fontWeight:'bold'
  }
})