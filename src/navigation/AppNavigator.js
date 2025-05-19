import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SplashScreen from '../screens/SplashScreen'
import HomeScreen from '../screens/HomeScreen'
import AcceptChallengeScreen from '../screens/AcceptChallengeScreen'
import SubmitProjectScreen from '../screens/SubmitProjectScreen'
import ManageParticipantScreen from '../screens/ManageParticipantScreen'

const Stack = createNativeStackNavigator()

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ title: '欢迎' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '引导' }} />
        <Stack.Screen name="AcceptChallenge" component={AcceptChallengeScreen} options={{ title: '接受挑战' }} />
        <Stack.Screen name="SubmitProject" component={SubmitProjectScreen} options={{ title: '提交作品' }} />
        <Stack.Screen name="ManageParticipant" component={ManageParticipantScreen} options={{ title: '管理信息' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
