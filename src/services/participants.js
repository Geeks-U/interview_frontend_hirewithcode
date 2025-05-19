import { supabase } from '../utils/request.js'

const table_name = 'participants'

export const addParticipantInfo = (participantInfo) => {
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

export const getParticipantInfo = (github_id) => {
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
      return {
        success: true,
        message: '获取参与者成功',
        data
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

export const updateParticipantInfo = (github_id, updatedInfo) => {
  return supabase
    .from(table_name)
    .update(updatedInfo)
    .eq('github_id', github_id)
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

export const deleteParticipantInfo = (github_id) => {
  return supabase
    .from(table_name)
    .delete()
    .eq('github_id', github_id)
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

// 调用示例 注意异步
// addParticipantInfo({ github_id: '123456', email: '1728392583@qq.com' })
//   .then(result => console.log(result))

// getParticipantInfo('123456')
//   .then(result => console.log(result))

// updateParticipantInfo('123456', { email: 'newemail@example.com' })
//   .then(result => console.log(result))

// deleteParticipantInfo('123456')
//   .then(result => console.log(result))
