// API基础URL
const API_BASE_URL = '/api'

// 存储认证令牌
const TOKEN_KEY = 'image_gallery_token'

// 获取令牌
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

// 设置令牌
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token)
}

// 移除令牌
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

// 检查是否已认证
export const isAuthenticated = () => {
  return !!getToken()
}

// 请求注册验证码
export const requestRegisterOtp = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register/otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || '发送验证码失败')
    }
    
    return await response.json()
  } catch (error) {
    console.error('发送验证码错误:', error)
    throw error
  }
}

// 验证注册验证码
export const verifyRegisterOtp = async (email, otp) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || '验证验证码失败')
    }
    
    return await response.json()
  } catch (error) {
    console.error('验证验证码错误:', error)
    throw error
  }
}

// 用户注册
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || '注册失败')
    }
    
    return await response.json()
  } catch (error) {
    console.error('注册错误:', error)
    throw error
  }
}

// 用户登录
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || '登录失败')
    }
    
    const data = await response.json()
    // 保存令牌
    setToken(data.access_token)
    return data
  } catch (error) {
    console.error('登录错误:', error)
    throw error
  }
}

// 获取当前用户信息
export const getCurrentUser = async () => {
  try {
    const token = getToken()
    if (!token) {
      throw new Error('未认证')
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      throw new Error('获取用户信息失败')
    }
    
    return await response.json()
  } catch (error) {
    console.error('获取用户信息错误:', error)
    throw error
  }
}

// 更新用户信息
export const updateUser = async (userData) => {
  try {
    const token = getToken()
    if (!token) {
      throw new Error('未认证')
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || '更新用户信息失败')
    }
    
    return await response.json()
  } catch (error) {
    console.error('更新用户信息错误:', error)
    throw error
  }
}

// 修改密码
export const changePassword = async (passwordData) => {
  try {
    const token = getToken()
    if (!token) {
      throw new Error('未认证')
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || '修改密码失败')
    }
    
    return await response.json()
  } catch (error) {
    console.error('修改密码错误:', error)
    throw error
  }
}

// 用户登出
export const logoutUser = () => {
  removeToken()
}

// 请求密码重置验证码
export const requestPasswordResetOtp = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password/otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || '发送验证码失败')
    }
    
    return await response.json()
  } catch (error) {
    console.error('发送验证码错误:', error)
    throw error
  }
}

// 验证密码重置验证码
export const verifyPasswordResetOtp = async (email, otp) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || '验证验证码失败')
    }
    
    return await response.json()
  } catch (error) {
    console.error('验证验证码错误:', error)
    throw error
  }
}

// 重置密码
export const resetPassword = async (resetData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resetData),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || '重置密码失败')
    }
    
    return await response.json()
  } catch (error) {
    console.error('重置密码错误:', error)
    throw error
  }
}

// 上传图片
export const uploadImage = async (formData) => {
  try {
    const token = getToken()
    if (!token) {
      throw new Error('未认证')
    }
    
    const response = await fetch(`${API_BASE_URL}/images/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || '上传图片失败')
    }
    
    return await response.json()
  } catch (error) {
    console.error('上传图片错误:', error)
    throw error
  }
}

// 获取当前用户的图片
export const getUserImages = async (skip = 0, limit = 100) => {
  try {
    const token = getToken()
    if (!token) {
      throw new Error('未认证')
    }
    
    const response = await fetch(`${API_BASE_URL}/images/my/?skip=${skip}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      throw new Error('获取用户图片失败')
    }
    
    return await response.json()
  } catch (error) {
    console.error('获取用户图片错误:', error)
    throw error
  }
}

// 删除图片
export const deleteImage = async (imageId) => {
  try {
    const token = getToken()
    if (!token) {
      throw new Error('未认证')
    }
    
    const response = await fetch(`${API_BASE_URL}/images/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || '删除图片失败')
    }
    
    return await response.json()
  } catch (error) {
    console.error('删除图片错误:', error)
    throw error
  }
}

// 修改图片描述
export const updateImageDescription = async (imageId, title, description) => {
  try {
    const token = getToken()
    if (!token) {
      throw new Error('未认证')
    }
    
    const formData = new FormData()
    if (title) {
      formData.append('title', title)
    }
    if (description !== undefined) {
      formData.append('description', description)
    }
    
    const response = await fetch(`${API_BASE_URL}/images/${imageId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || '修改图片描述失败')
    }
    
    return await response.json()
  } catch (error) {
    console.error('修改图片描述错误:', error)
    throw error
  }
}
