import { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, View, Button } from 'react-native'
import Markdown from 'react-native-markdown-display'

const markdownStyles = {
  code_inline: {
    backgroundColor: '#eee',
    padding: 1,
    borderRadius: 4,
    fontSize: 15,
    lineHeight: 16,
    fontFamily: 'Courier',
    marginVertical: 4,
  },
}

export default function HomeScreen() {
  const [mdText, setMdText] = useState('')

  useEffect(() => {
    async function loadMarkdown() {
      try {
        const response = await fetch('/interview_desc.txt')
        const text = await response.text()
        setMdText(text)
      } catch (error) {
        console.error('加载Markdown失败:', error)
      }
    }
    loadMarkdown()
  }, [])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Markdown style={markdownStyles}>{mdText}</Markdown>

      {/* 按钮容器 */}
      <View style={styles.buttonContainer}>
        <Button
          title="接受挑战"
          onPress={() => window.alert('跳转至报名页面')}
        />
        <Button
          title="提交作品"
          onPress={() => window.alert('跳转至作品提交页面')}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  container: {
    backgroundColor: '#f0f0f0',
    flexGrow: 1,
    padding: 20,
  },
})

