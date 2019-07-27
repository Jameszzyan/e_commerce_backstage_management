import axios from '../utils/common_axios.js'

// 根据分页参数返回商品相关渲染数据
export const getGoodsData = (params) => {
  return axios({
    url: 'goods',
    method: 'get',
    params
  })
}

// 返回商品所有分类
export const getAllCategories = () => {
  return axios({
    url: 'categories',
    method: 'get',
    params: {
      type: [1, 2, 3]
    }
  })
}

// 获取对应分类id的动态参数或者静态属性
export const getAttrs = (id, sel) => {
  return axios({
    url: `categories/${id}/attributes`,
    method: 'get',
    params: {
      sel
    }
  })
}

// 上传新增商品相关信息到后台进行存储
export const addGoodsData = (data) => {
  return axios({
    url: 'goods',
    method: 'post',
    data
  })
}
