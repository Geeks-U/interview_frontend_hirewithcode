import { useState, useRef, useEffect } from 'react'
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Dimensions, Animated, FlatList, Pressable, Linking } from 'react-native'
import { addProject, getProjectCount, getProjectList } from '../services/projects'
import { getParticipantInfo } from '../services/participants'
import Icon from 'react-native-vector-icons/MaterialIcons'

const { width } = Dimensions.get('window')
const isMobile = width < 768
const isTablet = width >= 768 && width < 1024

export default function SubmitProjectScreen({ navigation, route }) {
  const [projectCount, setProjectCount] = useState('...')
  const [githubId, setGithubId] = useState(route.params?.githubId || '')
  const [githubUrl, setGithubUrl] = useState('')
  const [vercelUrl, setVercelUrl] = useState('')
  const [authorizationCode, setAuthorizationCode] = useState(route.params?.authorizationCode || '')
  const [showAuthorizationCode, setShowAuthorizationCode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const [projectList, setProjectList] = useState([])
  const [error, setError] = useState('')
  const fadeAnim = useRef(new Animated.Value(0)).current
  const drawerAnim = useRef(new Animated.Value(width)).current

  useEffect(() => {
    // 淡入动画
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start()
    // 获取参赛作品数
    getProjectCount().then(res => {
      if (res.success) {
        setProjectCount(res.data.count)
      } else {
        console.warn(res.message)
      }
    })
  }, [])

  // 参赛作品列表 isMobile ? 0.5 : isTablet ? 0.7 : 0.8,
  useEffect(() => {
    Animated.timing(drawerAnim, {
      toValue: showDrawer ? width * (isMobile ? 0.5 : isTablet ? 0.7 : 0.8) : width,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [showDrawer])

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

  // 显示参赛作品列表
  const showProjectsList = async () => {
    try {
      const res = await getProjectList()
      if (res.success) {
        setProjectList(res.data)
        setShowDrawer(true)
      } else {
        alert(res.message)
      }
    } catch (err) {
      console.warn('获取项目详情失败', err)
    }
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
        setError(participantResult.message)
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
          useNativeDriver: false,
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
        <TouchableOpacity
          style={styles.helloTextWrapper}
          onPress={showProjectsList}
        >
          <Text style={styles.helloText}>当前参赛作品数：{projectCount}</Text>
        </TouchableOpacity>
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
      {showDrawer && (
        <Pressable style={styles.overlay} onPress={() => setShowDrawer(false)}>
          <Pressable style={styles.drawerWrapper} onPress={() => { }}>
            {/* 抽屉组件 */}
            <Animated.View style={[styles.drawer, { left: drawerAnim }]}>
              <View style={styles.drawerHeader}>
                <Text style={styles.drawerTitle}>参赛作品列表</Text>
                <TouchableOpacity onPress={() => setShowDrawer(false)}>
                  <Icon name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={projectList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.projectItem}>
                    <Text style={styles.projectTitle}>
                      <TouchableOpacity onPress={() => { Linking.openURL(item.github_repo_url) }}>
                        <Text>{item.github_repo_url.split('/')[3]}</Text>
                      </TouchableOpacity>
                    </Text>
                    <Text style={styles.projectSubtitle}>
                      <TouchableOpacity onPress={() => Linking.openURL(item.vercel_url)}>
                        <Text style={styles.projectLink}>{item.vercel_url}</Text>
                      </TouchableOpacity>
                    </Text>
                  </View>
                )}
              />
            </Animated.View>
          </Pressable>
        </Pressable>
      )}
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
  drawer: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderLeftWidth: 1,
    boxShadow: '-2px 0 4px rgba(0, 0, 0, 0.1)',
    height: '100%',
    padding: 20,
    position: 'absolute',
    top: 0,
    width: width * (isMobile ? 0.5 : isTablet ? 0.3 : 0.2),   // 宽度自定义为 0.2 (isMobile ? 0.5 : isTablet ? 0.3 : 0.2)
    zIndex: 10,
  },
  drawerHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  drawerTitle: {
    color: '#2c3e50',
    fontSize: 18,
    fontWeight: '700',
  },
  drawerWrapper: {
    height: '100%',          // 高度占满父元素
    width: isMobile ? '50%' : isTablet ? '30%' : '20%', // 宽度自定义为 20% (isMobile ? 50% : isTablet ? 30% : 20%)
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
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    bottom: 0, left: 0, position: 'absolute', right: 0,
    top: 0,
    zIndex: 999,
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
  projectItem: {
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 12,
  },
  projectLink: {
    color: '#3498db',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  projectSubtitle: {
    color: '#888',
    fontSize: 14,
  },
  projectTitle: {
    color: '#34495e',
    fontSize: 16,
    fontWeight: '600',
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
  }
}) 