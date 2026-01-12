// API基础URL
const API_BASE_URL = '/api'

// 获取图片列表
export const fetchImages = async (skip = 0, limit = 100, search = '') => {
  try {
    // 构建查询参数
    const params = new URLSearchParams()
    params.append('skip', skip)
    params.append('limit', limit)
    if (search) {
      params.append('search', search)
    }
    
    const response = await fetch(`${API_BASE_URL}/images?${params.toString()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch images')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching images:', error)
    throw error
  }
}

// 获取单张图片详情
export const fetchImageById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/images/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch image')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching image:', error)
    throw error
  }
}

// 从auth.js导入认证相关函数
export * from './auth.js'