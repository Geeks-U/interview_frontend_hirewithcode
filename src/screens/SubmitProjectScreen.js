import { useState, useRef, useEffect } from 'react'
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Dimensions, Animated } from 'react-native'
import { addProject } from '../services/projects'
import { getParticipantInfo } from '../services/participants'
import Icon from 'react-native-vector-icons/MaterialIcons'

const { width } = Dimensions.get('window')
const isMobile = width < 768
const isTablet = width >= 768 && width < 1024

export default function SubmitProjectScreen({ navigation, route }) {
  const [githubId, setGithubId] = useState(route.params?.githubId || '')
  const [githubUrl, setGithubUrl] = useState('')
  const [vercelUrl, setVercelUrl] = useState('')
  const [authorizationCode, setAuthorizationCode] = useState(route.params?.authorizationCode || '')
  const [showAuthorizationCode, setShowAuthorizationCode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // 淡入动画
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }, [])

  const handleBack = () => {
    // 淡出动画
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('Home')
    })
  }

  const handleSubmit = async () => {
    if (!githubId || !githubUrl || !vercelUrl || !authorizationCode) {
      setError('请填写所有必填字段')
      return
    }

    // Validate URLs
    try {
      new URL(githubUrl)
      new URL(vercelUrl)
    } catch (err) {
      setError('请输入有效的URL地址')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // First validate if the user has registered and authorization code is correct
      const participantResult = await getParticipantInfo(githubId, authorizationCode)
      if (!participantResult.success) {
        setError('验证用户信息失败，请检查GitHub ID和授权码是否正确')
        setIsSubmitting(false)
        return
      }

      const result = await addProject({
        github_id: githubId,
        github_repo_url: githubUrl,
        vercel_url: vercelUrl
      })

      if (result.success) {
        // 淡出动画
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          alert('项目提交成功！')
          navigation.navigate('Home')
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

        <Text style={styles.title}>提交作品</Text>
        <Text style={styles.subtitle}>请提供你的项目信息</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>GitHub ID</Text>
          <TextInput
            style={styles.input}
            value={githubId}
            onChangeText={setGithubId}
            placeholder="请输入你的 GitHub ID"
            placeholderTextColor="#999"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>授权码</Text>
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

        <View style={styles.inputContainer}>
          <Text style={styles.label}>GitHub 仓库地址</Text>
          <TextInput
            style={styles.input}
            value={githubUrl}
            onChangeText={setGithubUrl}
            placeholder="请输入 GitHub 仓库地址"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Vercel 部署地址</Text>
          <TextInput
            style={styles.input}
            value={vercelUrl}
            onChangeText={setVercelUrl}
            placeholder="请输入 Vercel 部署地址"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? '提交中...' : '提交作品'}
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
    elevation: 4,
    maxWidth: 500,
    padding: isMobile ? 20 : isTablet ? 24 : 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: '100%',
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