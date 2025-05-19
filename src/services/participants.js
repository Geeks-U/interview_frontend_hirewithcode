import { supabase } from '../utils/request.js'

const table_name = 'participants'

export const addParticipantInfo = (participantInfo) => {
  if (!participantInfo.authorization_code) {
    return Promise.resolve({
      success: false,
      message: '添加参与者失败：缺少authorization_code'
    })
  }
  return supabase
    .from(table_name)
    .insert([participantInfo])
    .select()
    .then(({ data, error }) => {
      if (error) {
        return {
          success: false,
          message: `添加参与者失败：${error.message}`
        }
      }
      return {
        success: true,
        message: '添加参与者成功',
        data
      }
    })
    .catch((err) => {
      return {
        success: false,
        message: `添加参与者出现异常：${err.message}`
      }
    })
}

export const getParticipantInfo = (github_id, authorization_code) => {
  if (!authorization_code) {
    return Promise.resolve({
      success: false,
      message: '获取参与者失败：缺少authorization_code',
      data: null
    })
  }
  return supabase
    .from(table_name)
    .select('*')
    .eq('github_id', github_id)
    .then(({ data, error }) => {
      if (error) {
        return {
          success: false,
          message: `获取参与者失败：${error.message}`,
          data: null
        }
      }
      if (!data || data.length === 0) {
        return {
          success: false,
          message: `没有找到github_id为${github_id}的参与者`,
          data: null
        }
      }
      if (data[0].authorization_code !== authorization_code) {
        return {
          success: false,
          message: '授权码不匹配',
          data: null
        }
      }
      return {
        success: true,
        message: '获取参与者成功',
        data: data[0]
      }
    })
    .catch((err) => {
      return {
        success: false,
        message: `获取参与者出现异常：${err.message}`,
        data: null
      }
    })
}

export const updateParticipantInfo = (github_id, authorization_code, updatedInfo) => {
  if (!authorization_code) {
    return Promise.resolve({
      success: false,
      message: '更新参与者失败：缺少authorization_code'
    })
  }
  return supabase
    .from(table_name)
    .update(updatedInfo)
    .eq('github_id', github_id)
    .eq('authorization_code', authorization_code)
    .select()
    .then(({ data, error }) => {
      if (error) {
        return {
          success: false,
          message: `更新参与者失败：${error.message}`
        }
      }
      if (!data || data.length === 0) {
        return {
          success: false,
          message: `没有找到github_id为${github_id}的参与者，更新失败`
        }
      }
      return {
        success: true,
        message: '更新参与者成功',
        data
      }
    })
    .catch((err) => {
      return {
        success: false,
        message: `更新参与者出现异常：${err.message}`
      }
    })
}

export const deleteParticipantInfo = (github_id, authorization_code) => {
  if (!authorization_code) {
    return Promise.resolve({
      success: false,
      message: '删除参与者失败：缺少authorization_code'
    })
  }
  return supabase
    .from(table_name)
    .delete()
    .eq('github_id', github_id)
    .eq('authorization_code', authorization_code)
    .select()
    .then(({ data, error }) => {
      if (error) {
        return {
          success: false,
          message: `删除参与者失败：${error.message}`
        }
      }
      if (!data || data.length === 0) {
        return {
          success: false,
          message: `没有找到github_id为${github_id}的参与者，删除失败`
        }
      }
      return {
        success: true,
        message: '删除参与者成功',
        data
      }
    })
    .catch((err) => {
      return {
        success: false,
        message: `删除参与者出现异常：${err.message}`
      }
    })
}

export const checkParticipantExists = (github_id) => {
  return supabase
    .from(table_name)
    .select('github_id')
    .eq('github_id', github_id)
    .then(({ data, error }) => {
      if (error) {
        return {
          success: false,
          message: `检查参与者失败：${error.message}`,
          exists: false
        }
      }
      return {
        success: true,
        message: '检查参与者成功',
        exists: data && data.length > 0
      }
    })
    .catch((err) => {
      return {
        success: false,
        message: `检查参与者出现异常：${err.message}`,
        exists: false
      }
    })
}

// 调用示例 注意异步
// addParticipantInfo({ github_id: '123456', email: '1728392583@qq.com', authorization_code: 'xxx' })
//   .then(result => console.log(result))

// getParticipantInfo('123456', 'xxx')
//   .then(result => console.log(result))

// updateParticipantInfo('123456', 'xxx', { email: 'newemail@example.com' })
//   .then(result => console.log(result))

// deleteParticipantInfo('123456', 'xxx')
//   .then(result => console.log(result))

// checkParticipantExists('123456')
//   .then(result => console.log(result))
