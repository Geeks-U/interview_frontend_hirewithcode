import { useState, useRef, useEffect } from 'react'
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Dimensions, Animated } from 'react-native'
import { getParticipantInfo, updateParticipantInfo, deleteParticipantInfo } from '../services/participants'
import { getProject, updateProject, deleteProject } from '../services/projects'
import Icon from 'react-native-vector-icons/MaterialIcons'

const { width } = Dimensions.get('window')
const isMobile = width < 768
const isTablet = width >= 768 && width < 1024

export default function ManageParticipantScreen({ navigation }) {
  const [githubId, setGithubId] = useState('')
  const [authorizationCode, setAuthorizationCode] = useState('')
  const [showAuthorizationCode, setShowAuthorizationCode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [participantInfo, setParticipantInfo] = useState(null)
  const [projectInfo, setProjectInfo] = useState(null)
  const [projectAvailable, setProjectAvailable] = useState(true)

  // 添加多个动画值
  const fadeAnim = useRef(new Animated.Value(0)).current
  const verifyFormAnim = useRef(new Animated.Value(0)).current
  const optionsAnim = useRef(new Animated.Value(0)).current
  const updateFormAnim = useRef(new Animated.Value(0)).current
  const deleteFormAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }, [])

  // 监听 isVerified 变化
  useEffect(() => {
    if (isVerified) {
      Animated.parallel([
        Animated.timing(verifyFormAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(optionsAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(verifyFormAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(optionsAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start()
    }
  }, [isVerified])

  // 监听 selectedOption 变化
  useEffect(() => {
    if (selectedOption === 'update') {
      Animated.parallel([
        Animated.timing(updateFormAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(deleteFormAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start()
    } else if (selectedOption === 'delete') {
      Animated.parallel([
        Animated.timing(updateFormAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(deleteFormAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(updateFormAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(deleteFormAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start()
    }
  }, [selectedOption])

  const handleBack = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('Home')
    })
  }

  const handleVerify = async () => {
    if (!githubId || !authorizationCode) {
      setError('请填写所有必填字段')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const [participantResult, projectResult] = await Promise.all([
        getParticipantInfo(githubId, authorizationCode),
        getProject(githubId)
      ])

      if (participantResult.success) {
        setIsVerified(true)
        setParticipantInfo(participantResult.data)

        if (projectResult.success && projectResult.data) {
          const projectData = projectResult.data
          setProjectInfo({
            github_repo_url: projectData.github_repo_url || '',
            vercel_url: projectData.vercel_url || ''
          })
          setProjectAvailable(true)
        } else {
          setProjectInfo({
            github_repo_url: '尚未提交项目信息',
            vercel_url: '尚未提交项目信息'
          })
          setProjectAvailable(false)
        }

        setSelectedOption('update')
      } else {
        setError(participantResult.message)
      }
    } catch (err) {
      console.error('Error:', err)
      setError('验证失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async () => {
    if (!participantInfo) return

    setIsSubmitting(true)
    setError('')

    try {
      const participantPromise = updateParticipantInfo(githubId, authorizationCode, {
        email: participantInfo.email,
        authorization_code: participantInfo.authorization_code
      })

      const projectPromise = projectAvailable
        ? updateProject(githubId, {
          github_repo_url: projectInfo.github_repo_url,
          vercel_url: projectInfo.vercel_url
        })
        : Promise.resolve({ success: true }) // 用成功模拟

      const [participantResult, projectResult] = await Promise.all([
        participantPromise,
        projectPromise
      ])

      if (participantResult.success && projectResult.success) {
        navigation.navigate('Home')
      } else {
        setError(participantResult.message || projectResult.message)
      }
    } catch (err) {
      setError('更新失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsSubmitting(true)
    setError('')

    try {
      const participantPromise = deleteParticipantInfo(githubId, authorizationCode)

      const projectPromise = projectAvailable
        ? deleteProject(githubId)
        : Promise.resolve({ success: true }) // 用成功模拟

      const [participantResult, projectResult] = await Promise.all([
        participantPromise,
        projectPromise,
      ])

      if (participantResult.success && projectResult.success) {
        navigation.navigate('Home')
      } else {
        setError(participantResult.message || projectResult.message)
      }
    } catch (err) {
      setError('删除失败，请稍后重试')
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

        <Text style={styles.title}>管理信息</Text>
        <Text style={styles.subtitle}>验证身份后可以修改或删除信息</Text>

        <Animated.View style={[styles.contentContainer, { opacity: verifyFormAnim }]}>
          {!isVerified && (
            <>
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

              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={handleVerify}
                disabled={isSubmitting}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? '验证中...' : '验证身份'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>

        <Animated.View style={[styles.contentContainer, { opacity: optionsAnim }]}>
          {isVerified && (
            <>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[styles.optionButton, selectedOption === 'update' && styles.optionButtonSelected]}
                  onPress={() => setSelectedOption('update')}
                >
                  <Text style={[styles.optionText, selectedOption === 'update' && styles.optionTextSelected]}>
                    修改信息
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.optionButton, selectedOption === 'delete' && styles.optionButtonSelected]}
                  onPress={() => setSelectedOption('delete')}
                >
                  <Text style={[styles.optionText, selectedOption === 'delete' && styles.optionTextSelected]}>
                    删除信息
                  </Text>
                </TouchableOpacity>
              </View>

              {participantInfo && (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>邮箱</Text>
                    <TextInput
                      style={styles.input}
                      value={participantInfo.email}
                      onChangeText={(text) => setParticipantInfo({ ...participantInfo, email: text })}
                      placeholder="请输入邮箱"
                      placeholderTextColor="#999"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={selectedOption === 'update'}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>授权码</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={[styles.input, styles.passwordInput]}
                        value={participantInfo.authorization_code}
                        onChangeText={(text) => setParticipantInfo({ ...participantInfo, authorization_code: text })}
                        placeholder="请输入授权码"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        secureTextEntry={!showAuthorizationCode}
                        editable={selectedOption === 'update'}
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

                  {projectInfo && (
                    <>
                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>GitHub 仓库地址</Text>
                        <TextInput
                          style={styles.input}
                          value={projectInfo.github_repo_url}
                          onChangeText={(text) => setProjectInfo({ ...projectInfo, github_repo_url: text })}
                          placeholder="请输入 GitHub 仓库地址"
                          placeholderTextColor="#999"
                          autoCapitalize="none"
                          editable={selectedOption === 'update' && projectAvailable}
                        />
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Vercel 部署地址</Text>
                        <TextInput
                          style={styles.input}
                          value={projectInfo.vercel_url}
                          onChangeText={(text) => setProjectInfo({ ...projectInfo, vercel_url: text })}
                          placeholder="请输入 Vercel 部署地址"
                          placeholderTextColor="#999"
                          autoCapitalize="none"
                          editable={selectedOption === 'update' && projectAvailable}
                        />
                      </View>
                    </>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      selectedOption === 'delete' && styles.deleteButton,
                      isSubmitting && styles.submitButtonDisabled
                    ]}
                    onPress={selectedOption === 'update' ? handleUpdate : handleDelete}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.submitButtonText}>
                      {isSubmitting
                        ? (selectedOption === 'update' ? '更新中...' : '删除中...')
                        : (selectedOption === 'update' ? '确认修改' : '确认删除')
                      }
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
        </Animated.View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  optionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 8,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  optionText: {
    color: '#2c3e50',
    fontSize: isMobile ? 14 : isTablet ? 15 : 16,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#fff',
  },
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    padding: 4,
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
  deleteButton: {
    backgroundColor: '#e74c3c',
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
  contentContainer: {
    width: '100%',
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoLabel: {
    color: '#2c3e50',
    fontSize: isMobile ? 14 : isTablet ? 15 : 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  infoText: {
    color: '#666',
    fontSize: isMobile ? 14 : isTablet ? 15 : 16,
    backgroundColor: '#f8f9fa',
    padding: isMobile ? 12 : isTablet ? 14 : 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
}) 