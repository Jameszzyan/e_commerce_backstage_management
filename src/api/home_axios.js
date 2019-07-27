import axios from '../utils/common_axios.js'

// 获取用户导航菜单
export const getMenus = () => {
  return axios({
    url: 'menus',
    method: 'get'
  })
}
