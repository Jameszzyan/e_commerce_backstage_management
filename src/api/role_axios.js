import axios from '../utils/common_axios.js'

// 发送获取所有角色信息的请求到后台
export const getRoleData = () => {
  return axios({
    url: 'roles',
    method: 'get'
  })
}

export const changeRole = (data) => {
  return axios({
    url: `users/${data.id}/role`,
    method: 'put',
    data: {
      rid: data.rid
    }
  })
}
