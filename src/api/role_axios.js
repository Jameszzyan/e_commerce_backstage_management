import axios from '../utils/common_axios.js'
// 发送获取所有角色信息的请求到后台
export const getAllRoleData = () => {
  return axios({
    url: 'roles',
    method: 'get'
  })
}

// 将更改后的角色相关数据发送给后台进行更改
export const changeRole = (data) => {
  return axios({
    url: `users/${data.id}/role`,
    method: 'put',
    data: {
      rid: data.rid
    }
  })
}

// 获取所有权限信息(不分级)
export const getAllRights = () => {
  return axios({
    url: 'rights/list',
    method: 'get'
  })
}

// 获取所有权限信息（分级）
export const getAllRightsInDegree = () => {
  return axios({
    url: 'rights/tree',
    method: 'get'
  })
}

// 根据发送的id删除该角色的对应授权
export const deleteUserRight = (id, rid) => {
  return axios({
    url: `roles/${id}/rights/${rid}`,
    method: 'delete'
  })
}

// 根据发送的角色相关信息进行后台添加
export const addRoleInfo = (data) => {
  return axios({
    url: 'roles',
    method: 'post',
    data
  })
}

// 根据发送的角色对应id查找相关信息
export const getRoleDataById = (id) => {
  return axios({
    url: `roles/${id}`,
    method: 'get'
  })
}

// 根据发送的角色id以及对应的编辑内容进行更新
export const updateRoleData = (data) => {
  return axios({
    url: `roles/${data.id}`,
    method: 'put',
    data: {
      roleName: data.roleName,
      roleDesc: data.roleDesc
    }
  })
}

// 根据发送的角色id删除对应的角色
export const deleteRole = (id) => {
  return axios({
    url: `roles/${id}`,
    method: 'delete'
  })
}

// 根据发送的角色id以及授权的权限id数组进行更新
export const updateRoleRights = (id, data) => {
  return axios({
    url: `roles/${id}/rights`,
    method: 'post',
    data: {
      rids: data
    }
  })
}
