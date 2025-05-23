import { useState, useRef, useEffect } from 'react'
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Dimensions, Animated } from 'react-native'
import { addParticipantInfo, getParticipantCount } from '../services/participants'
import Icon from 'react-native-vector-icons/MaterialIcons'

const { width } = Dimensions.get('window')
const isMobile = width < 768
const isTablet = width >= 768 && width < 1024

// 邮箱验证正则表达式
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export default function AcceptChallengeScreen({ navigation }) {
  const [participantCount, setParticipantCount] = useState('...')
  const [githubId, setGithubId] = useState('')
  const [email, setEmail] = useState('')
  const [authorizationCode, setAuthorizationCode] = useState('')
  const [showAuthorizationCode, setShowAuthorizationCode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // 淡入动画
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start()
    // 获取参赛人数
    getParticipantCount().then(res => {
      if (res.success) {
        setParticipantCount(res.data.count)
      } else {
        console.warn(res.message)
      }
    })
  }, [])

  const handleBack = () => {
    // 淡出动画
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      navigation.navigate('Home')
    })
  }

  const showParticipantsList = () => {
    window.alert('参赛者列表不予展示')
  }

  const validateEmail = (email) => {
    return EMAIL_REGEX.test(email)
  }

  const handleSubmit = async () => {
    if (!githubId || !email || !authorizationCode) {
      setError('请填写所有必填字段')
      return
    }

    if (!validateEmail(email)) {
      setError('请输入有效的邮箱地址')
      return
    }

    if (authorizationCode.length < 6) {
      setError('授权码至少需要6位')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const result = await addParticipantInfo({
        github_id: githubId,
        email: email,
        authorization_code: authorizationCode
      })

      if (result.success) {
        // 淡出动画
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          navigation.navigate('SubmitProject', {
            githubId: githubId,
            authorizationCode: authorizationCode
          })
        })
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('提交失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.formContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>

        <Text style={styles.title}>接受挑战</Text>
        <TouchableOpacity
          style={styles.helloTextWrapper}
          onPress={showParticipantsList}
        >
          <Text style={styles.helloText}>当前参赛人数：{participantCount}</Text>
        </TouchableOpacity>
        <Text style={styles.subtitle}>请填写以下信息开始你的挑战之旅</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>GitHub ID</Text>
          <TextInput
            style={styles.input}
            value={githubId}
            onChangeText={setGithubId}
            placeholder="请输入你的 GitHub ID"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>邮箱</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="请输入你的邮箱"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>授权码(用于管理个人信息)</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={authorizationCode}
              onChangeText={setAuthorizationCode}
              placeholder="请输入授权码"
              placeholderTextColor="#999"
              autoCapitalize="none"
              secureTextEntry={!showAuthorizationCode}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowAuthorizationCode(!showAuthorizationCode)}
            >
              <Icon
                name={showAuthorizationCode ? 'visibility' : 'visibility-off'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? '提交中...' : '接受挑战'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  backButton: {
    left: isMobile ? 16 : isTablet ? 20 : 24,
    position: 'absolute',
    top: isMobile ? 16 : isTablet ? 20 : 24,
    zIndex: 1,
  },
  backButtonText: {
    color: '#3498db',
    fontSize: isMobile ? 14 : isTablet ? 15 : 16,
    fontWeight: '500',
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    flex: 1,
    justifyContent: 'center',
    padding: isMobile ? 16 : isTablet ? 24 : 32,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  eyeIcon: {
    padding: 4,
    position: 'absolute',
    right: 12,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: 500,
    padding: isMobile ? 20 : isTablet ? 24 : 32,
    width: '100%',
  },
  helloText: {
    color: '#3498db',
    fontSize: isMobile ? 14 : isTablet ? 15 : 16,
    fontWeight: '500',
  },
  helloTextWrapper: {
    position: 'absolute',
    right: isMobile ? 16 : isTablet ? 20 : 24,
    top: isMobile ? 16 : isTablet ? 20 : 24,
    zIndex: 1,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: isMobile ? 14 : isTablet ? 15 : 16,
    padding: isMobile ? 12 : isTablet ? 14 : 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#2c3e50',
    fontSize: isMobile ? 14 : isTablet ? 15 : 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  passwordContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 40,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#3498db',
    borderRadius: 8,
    marginTop: 8,
    padding: isMobile ? 14 : isTablet ? 16 : 18,
  },
  submitButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: isMobile ? 16 : isTablet ? 17 : 18,
    fontWeight: '600',
  },
  subtitle: {
    color: '#666',
    fontSize: isMobile ? 14 : isTablet ? 16 : 18,
    marginBottom: 24,
    textAlign: 'center',
  },
  title: {
    color: '#2c3e50',
    fontSize: isMobile ? 24 : isTablet ? 28 : 32,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
}) 