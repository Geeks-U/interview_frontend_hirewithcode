import { View, Text, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  }
})

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello Animal</Text>
    </View>
  )
}
