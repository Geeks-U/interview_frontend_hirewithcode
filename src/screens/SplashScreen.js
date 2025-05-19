import { useEffect } from 'react'
import { View, Image, StyleSheet, Platform } from 'react-native'

import logo from '../../assets/logo.png'

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Home')
    }, 2000)

    return () => clearTimeout(timer)
  }, [navigation])

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center'
  },
  logo: {
    height: Platform.OS === 'web' ? 300 : 200,
    width: Platform.OS === 'web' ? 300 : 200
  }
})
