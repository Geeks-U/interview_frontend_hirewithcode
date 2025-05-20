# HireWithCode

## 原项目地址
https://github.com/InfiniteStatesInc/HireWithCode

## 部署
* 前端：https://vercel.com
* 后端：https://supabase.com

## 项目体验地址
https://interview-frontend-self.vercel.app

## 跨平台样式写法
``` javascript
// 跨平台样式写法
import { Platform } from 'react-native'
styleName: {
  /* 通用样式 */
  ...Platform.select({
    ios: { /* 专用样式 */ },
    android: { /* 专用样式 */ },
    web: { /* 专用样式 */ },
  }),
}
```