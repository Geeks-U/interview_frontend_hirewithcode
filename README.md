# HireWithCode 面试挑战项目

这是基于 [InfiniteStatesInc/HireWithCode](https://github.com/InfiniteStatesInc/HireWithCode) 的完整实现项目

---

## 🌟 项目功能

项目包含四个完整步骤的页面流程：

1. **欢迎页**  

2. **面试引导页**  

3. **接受挑战页**  

4. **完成挑战页**  

5. **信息管理页**  

---

## 🚀 在线体验地址

👉 [https://interview-frontend-self.vercel.app](https://interview-frontend-self.vercel.app)

---

## 🛠️ 技术栈

| 类别     | 技术选型             |
|----------|----------------------|
| 编辑器   | [Cursor](https://www.cursor.sh) |
| 前端     | Expo  + React Native Web |
| 后端     | Supabase（提供 API 和数据库） |
| 部署     | Vercel               |

---

## 📦 部署服务

- 前端托管：🔗 [Vercel](https://vercel.com)
- 后端服务：🔗 [Supabase](https://supabase.com)

---

## 📱 跨平台样式写法示例

```JavaScript
import { Platform } from 'react-native'

styleName: {
  /* 通用样式 */
  ...Platform.select({
    ios: { /* iOS 专用样式 */ },
    android: { /* Android 专用样式 */ },
    web: { /* Web 专用样式 */ },
  }),
}
