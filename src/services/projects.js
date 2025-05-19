import { supabase } from '../utils/request.js'

const table_name = 'projects'

export const addProject = (projectInfo) => {
  return supabase
    .from(table_name)
    .insert([projectInfo])
    .select()
    .then(({ data, error }) => {
      if (error) {
        return {
          success: false,
          message: `添加项目失败：${error.message}`
        }
      }
      return {
        success: true,
        message: '添加项目成功',
        data
      }
    })
    .catch((err) => {
      return {
        success: false,
        message: `添加项目出现异常：${err.message}`
      }
    })
}

export const getProject = (github_id) => {
  return supabase
    .from(table_name)
    .select('*')
    .eq('github_id', github_id)
    .then(({ data, error }) => {
      if (error) {
        return {
          success: false,
          message: `获取项目失败：${error.message}`,
          data: null
        }
      }
      if (!data || data.length === 0) {
        return {
          success: false,
          message: `没有找到github_id为${github_id}的项目`,
          data: null
        }
      }
      return {
        success: true,
        message: '获取项目成功',
        data
      }
    })
    .catch((err) => {
      return {
        success: false,
        message: `获取项目出现异常：${err.message}`,
        data: null
      }
    })
}

export const updateProject = (github_id, updatedInfo) => {
  return supabase
    .from(table_name)
    .update(updatedInfo)
    .eq('github_id', github_id)
    .select()
    .then(({ data, error }) => {
      if (error) {
        return {
          success: false,
          message: `更新项目失败：${error.message}`
        }
      }
      if (!data || data.length === 0) {
        return {
          success: false,
          message: `没有找到github_id为${github_id}的项目，更新失败`
        }
      }
      return {
        success: true,
        message: '更新项目成功',
        data
      }
    })
    .catch((err) => {
      return {
        success: false,
        message: `更新项目出现异常：${err.message}`
      }
    })
}

export const deleteProject = (github_id) => {
  return supabase
    .from(table_name)
    .delete()
    .eq('github_id', github_id)
    .select()
    .then(({ data, error }) => {
      if (error) {
        return {
          success: false,
          message: `删除项目失败：${error.message}`
        }
      }
      if (!data || data.length === 0) {
        return {
          success: false,
          message: `没有找到github_id为${github_id}的项目，删除失败`
        }
      }
      return {
        success: true,
        message: '删除项目成功',
        data
      }
    })
    .catch((err) => {
      return {
        success: false,
        message: `删除项目出现异常：${err.message}`
      }
    })
}

// 调用示例 注意异步
// addProject({ github_id: '123456', github_repo_url: 'https://github.com/user/repo', vercel_url: 'https://project.vercel.app' })
//   .then(result => console.log(result))

// getProject('123456')
//   .then(result => console.log(result))

// updateProject('123456', { vercel_url: 'https://newproject.vercel.app' })
//   .then(result => console.log(result))

// deleteProject('123456')
//   .then(result => console.log(result))
