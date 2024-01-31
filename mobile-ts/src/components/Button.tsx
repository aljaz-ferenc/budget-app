import { StyleSheet, StyleSheetProperties, Text, TouchableOpacity, View, StyleProp, ViewStyle } from 'react-native'
import React from 'react'

type Params = {
    onPress: () => void,
    text: string
    style?: StyleProp<ViewStyle>
}

export default function Button({onPress, text, style}: Params) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[styles.button, style]}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    button:{
        backgroundColor: '#3498db',
        padding: 10, 
        borderRadius: 5,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
      },
      text:{
        color: 'white'
      }
})