import { useEffect, useState, useRef } from 'react'
import { StyleSheet, ScrollView, View, TouchableOpacity, Text, Dimensions, Platform, Animated } from 'react-native'
import Markdown from 'react-native-markdown-display'

const { width } = Dimensions.get('window')
const isMobile = width < 768
const isTablet = width >= 768 && width < 1024

const markdownStyles = {
  body: {
    fontSize: isMobile ? 15 : isTablet ? 16 : 18,
    lineHeight: isMobile ? 22 : isTablet ? 24 : 26,
    color: '#333',
  },
  code_inline: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: isMobile ? 13 : isTablet ? 14 : 15,
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  heading1: {
    fontSize: isMobile ? 24 : isTablet ? 28 : 32,
    marginBottom: 12,
    color: '#2c3e50',
    fontWeight: '700',
  },
  heading2: {
    fontSize: isMobile ? 20 : isTablet ? 24 : 28,
    marginBottom: 10,
    color: '#34495e',
    fontWeight: '600',
  },
  paragraph: {
    marginBottom: 12,
  },
}

function SkeletonLoader() {
  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonText} />
      <View style={styles.skeletonText} />
      <View style={styles.skeletonText} />
      <View style={styles.skeletonText} />
      <View style={styles.skeletonText} />
    </View>
  )
}

export default function HomeScreen() {
  const [mdText, setMdText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    async function loadMarkdown() {
      try {
        const response = await fetch('/interview_desc.txt')
        const text = await response.text()
        setMdText(text)
      } catch (error) {
        console.error('加载Markdown失败:', error)
      } finally {
        setIsLoading(false)
        // 开始淡入动画
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start()
      }
    }
    loadMarkdown()
  }, [])

  if (isLoading) {
    return null
  }

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          <View style={styles.markdownBox}>
            <Markdown style={markdownStyles}>{mdText}</Markdown>
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              title="接受挑战"
              onPress={() => window.alert('跳转至报名页面')}
            />
            <CustomButton
              title="提交作品"
              onPress={() => window.alert('跳转至作品提交页面')}
            />
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  )
}

function CustomButton({ title, onPress }) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    ':hover': {
      backgroundColor: '#2980b9',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    },
    alignItems: 'center',
    backgroundColor: '#3498db',
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginHorizontal: isMobile ? 8 : isTablet ? 12 : 16,
    minWidth: isMobile ? 100 : isTablet ? 140 : 160,
    paddingHorizontal: isMobile ? 16 : isTablet ? 24 : 32,
    paddingVertical: isMobile ? 10 : isTablet ? 14 : 16,
    transition: 'all 0.3s ease',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isMobile ? 16 : isTablet ? 24 : 32,
    justifyContent: 'center',
    marginTop: isMobile ? 24 : isTablet ? 28 : 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: isMobile ? 15 : isTablet ? 16 : 18,
    fontWeight: '600',
  },
  container: {
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
  },
  contentWrapper: {
    alignSelf: 'center',
    maxWidth: 1500,
    padding: isMobile ? 16 : isTablet ? 24 : 32,
    width: '100%',
  },
  markdownBox: {
    ':hover': {
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
    },
    backgroundColor: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    padding: isMobile ? 8 : isTablet ? 16 : 24,
    transition: 'all 0.3s ease',
  },
  skeletonContainer: {
    gap: 12,
  },
  skeletonTitle: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    height: isMobile ? 24 : isTablet ? 28 : 32,
    width: '70%',
  },
  skeletonText: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    height: isMobile ? 15 : isTablet ? 16 : 18,
    width: '100%',
  },
})
