import axios from '../utils/common_axios.js'

// 发送用户登录数据到后台进行验证
export const sendAdminData = (data) => {
  return axios({
    url: 'login',
    method: 'post',
    data
  })
}

// 发送分页相关数据到后台获取相关用户信息
export const getUserListData = (params) => {
  return axios({
    url: 'users',
    method: 'get',
    params
  })
}

// 发送新增用户数据到后台进行添加
export const addUserData = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}

// 发送编辑完成的数据到后台进行更新
export const editUserData = (data) => {
  return axios({
    url: `users/${data.id}`,
    method: 'put',
    data: {
      email: data.email,
      mobile: data.mobile
    }
  })
}

// 将用户更改后的权限状态发送给后台进行更新
export const changeUserStatus = (id, status) => {
  return axios({
    url: `users/${id}/state/${status}`,
    method: 'put'
  })
}

// 将需要删除的用户id发送给后台进行删除
export const deleteUser = (id) => {
  return axios({
    url: `users/${id}`,
    method: 'delete'
  })
}
