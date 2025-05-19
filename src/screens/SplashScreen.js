import { useEffect } from 'react'
import { Image, StyleSheet, Platform, Animated, Dimensions } from 'react-native'

import logo from '../../assets/logo.png'

const { width } = Dimensions.get('window')
const isMobile = width < 768
const isTablet = width >= 768 && width < 1024

export default function SplashScreen({ navigation }) {
  const fadeAnim = new Animated.Value(0)
  const scaleAnim = new Animated.Value(0.8)
  const textFadeAnim = new Animated.Value(0)
  const pageFadeAnim = new Animated.Value(1)

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 10,
          friction: 3,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start()

    const timer = setTimeout(() => {
      // 开始淡出动画
      Animated.timing(pageFadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // 动画结束后再导航
        navigation.navigate('Home')
      })
    }, 3000) // 提前800ms开始淡出动画

    return () => clearTimeout(timer)
  }, [navigation, fadeAnim, scaleAnim, textFadeAnim, pageFadeAnim])

  return (
    <Animated.View style={[styles.container, { opacity: pageFadeAnim }]}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </Animated.View>
      <Animated.Text
        style={[
          styles.welcomeText,
          {
            opacity: textFadeAnim,
          },
        ]}
      >
        欢迎来到 infist 线上面试环节，期待你的加入！
      </Animated.Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    height: Platform.OS === 'web' ? 300 : 200,
    width: Platform.OS === 'web' ? 300 : 200,
  },
  logoContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 8,
    justifyContent: 'center',
    marginBottom: 24,
    padding: isMobile ? 24 : isTablet ? 32 : 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  welcomeText: {
    color: '#2c3e50',
    fontSize: isMobile ? 18 : isTablet ? 20 : 24,
    fontWeight: '600',
    marginTop: 16,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
})
