import axios from 'axios'

// === 生成 axios 实例 ===
const instance = axios.create({
  timeout: 1000 * 60
})
// === axios 请求拦截 ===
instance.interceptors.request.use(
  config => {
    // console.log('config',config)
    //生产环境是部署到客户的公网地址上你的，地址是实施人员给的
    let baseURL = '/WinGoWebApi' //开发测试地址

    if (process.env.NODE_ENV === 'development') {
      baseURL = 'http://192.168.200.63:7089/WinGoWebApi'
      
    }
    config.baseURL = baseURL
    // console.log('Authorization',localStorage.getItem('Authorization'))
    if (localStorage.getItem('Authorization')) {
      config.headers.common['Authorization'] = 'bearer ' + localStorage.getItem('Authorization') || ''
  }
    const localRegisterId = localStorage.getItem('yiyun_registerId')
    if (localRegisterId) {
      config.headers.common['registerId'] = localRegisterId
    }



    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// === axios response 拦截 ===
instance.interceptors.response.use(
  res => {
    if (res.status === 200) {
      return Promise.resolve(res.data)
    } else {
      return Promise.reject(res)
    }
  },

  error => {
    const { response } = error
    if (response) {
      return Promise.resolve(response)
    } else {
      // 断网
      if (error.code === 'ECONNABORTED') {
        console.log('aaaa')
      }
    }
  }
)
const get = (url, needLoading = true, config = {}) => {
  Object.assign(config, {
      method: 'get',
      url,
      needLoading
  })
  return instance(config).then(res => {
      return res
  })
}


const post = (url, data, needLoading = true, config = {}) => {
  Object.assign(config, {
      method: 'post',
      url,
      data,
      needLoading
  })
  return instance(config).then(res => {
      return res
  })
}
export default {
  get,
  post,
  defaults: instance
}
