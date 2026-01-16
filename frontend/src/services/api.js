// API基础URL
const API_BASE_URL = '/api'

// 本地缓存机制
const cache = {
  data: new Map(),
  
  // 设置缓存
  set(key, value, ttl = 30 * 60 * 1000) { // 默认缓存30分钟
    this.data.set(key, {
      value,
      expiry: Date.now() + ttl
    })
  },
  
  // 获取缓存
  get(key) {
    const item = this.data.get(key)
    if (!item) return null
    
    // 检查缓存是否过期
    if (Date.now() > item.expiry) {
      this.data.delete(key)
      return null
    }
    
    return item.value
  },
  
  // 删除缓存
  delete(key) {
    this.data.delete(key)
  },
  
  // 清除所有缓存
  clear() {
    this.data.clear()
  }
}

// 带有缓存的fetch函数
const fetchWithCache = async (url, options = {}) => {
  // 生成缓存键 - 只基于URL，不包括options，这样不同skip参数的请求会使用不同的缓存键
  const cacheKey = url
  
  // 提取forceRefresh选项，不影响缓存键
  const { forceRefresh = false } = options
  
  // 检查缓存
  const cachedData = cache.get(cacheKey)
  if (cachedData && !forceRefresh) {
    return cachedData
  }
  
  // 实际请求 - 移除forceRefresh选项，避免影响fetch请求
  const fetchOptions = { ...options }
  delete fetchOptions.forceRefresh
  
  // 自动添加Authorization头
  const token = localStorage.getItem('image_gallery_token')
  if (token) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      'Authorization': `Bearer ${token}`
    }
  }
  
  const response = await fetch(url, fetchOptions)
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`)
  }
  
  const data = await response.json()
  
  // 存储到缓存
  cache.set(cacheKey, data)
  
  return data
}

// 获取图片列表
export const fetchImages = async (skip = 0, limit = 100, search = '', options = {}) => {
  try {
    // 构建查询参数
    const params = new URLSearchParams()
    params.append('skip', skip)
    params.append('limit', limit)
    if (search) {
      params.append('search', search)
    }
    
    const url = `${API_BASE_URL}/images?${params.toString()}`
    return await fetchWithCache(url, options)
  } catch (error) {
    console.error('Error fetching images:', error)
    throw error
  }
}

// 获取单张图片详情
export const fetchImageById = async (id) => {
  try {
    const url = `${API_BASE_URL}/images/${id}`
    return await fetchWithCache(url)
  } catch (error) {
    console.error('Error fetching image:', error)
    throw error
  }
}

// 清除缓存
export const clearCache = () => {
  cache.clear()
}

// 从auth.js导入认证相关函数
export * from './auth.js'