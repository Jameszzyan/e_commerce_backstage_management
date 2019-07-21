import axios from '../utils/common_axios.js'

export const sendAdminData = (data) => {
  return axios({
    path: 'login',
    method: 'post',
    data: data
  })
}
