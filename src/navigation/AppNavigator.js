import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SplashScreen from '../screens/SplashScreen'
import HomeScreen from '../screens/HomeScreen'

const Stack = createNativeStackNavigator()

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ title: '欢迎' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '引导' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
