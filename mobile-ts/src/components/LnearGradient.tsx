import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import Theme from 'theme/colors'

export default function LnearGradient() {
  return (
    <LinearGradient 
    colors={[Theme.colors.blue, 'transparent']}
    style={styles.background}
    />
  )
}

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
        width:'100%'
      }
})