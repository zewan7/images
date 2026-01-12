import React, { createContext, useState, useEffect, useContext } from 'react'
import { getCurrentUser, isAuthenticated, removeToken } from '../services/auth.js'

// 创建认证上下文
export const AuthContext = createContext()

// 认证提供者组件
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // 初始化认证状态
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isAuthenticated()) {
          const userData = await getCurrentUser()
          setUser(userData)
          setIsLoggedIn(true)
        }
      } catch (error) {
        console.error('认证初始化错误:', error)
        removeToken()
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  // 登录成功后更新状态
  const loginSuccess = (userData) => {
    setUser(userData)
    setIsLoggedIn(true)
  }

  // 登出
  const logout = () => {
    removeToken()
    setUser(null)
    setIsLoggedIn(false)
  }

  // 更新用户信息
  const updateUser = (userData) => {
    setUser(userData)
  }

  // 上下文值
  const contextValue = {
    user,
    isLoggedIn,
    loading,
    loginSuccess,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// 自定义钩子，用于访问认证上下文
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth必须在AuthProvider内部使用')
  }
  return context
}
