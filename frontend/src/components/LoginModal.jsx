import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { loginUser } from '../services/auth.js'
import ForgotPasswordModal from './ForgotPasswordModal.jsx'

function LoginModal({ show, onClose, onSwitchToRegister }) {
  // 条件渲染：如果不显示，直接返回null，避免hooks调用
  if (!show) return null

  // 所有hooks必须在条件返回之后调用
  const { loginSuccess } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  // 处理登录表单提交
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await loginUser({
        username,
        password,
        remember_me: rememberMe
      })
      
      loginSuccess(response.user)
      onClose()
      
      // 重置表单
      setUsername('')
      setPassword('')
      setRememberMe(false)
    } catch (err) {
      setError(err.message || '登录失败，请检查用户名和密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: '#2d2d2d',
        borderRadius: '8px',
        padding: '24px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
      }}>
        {/* 模态框头部 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ color: '#ffffff', fontSize: '24px', margin: 0 }}>登录</h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              color: '#888888',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: 0,
              width: '30px',
              height: '30px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            &times;
          </button>
        </div>

        {/* 错误信息 */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(231, 76, 60, 0.2)',
            color: '#e74c3c',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* 登录表单 */}
        <form onSubmit={handleSubmit}>
          {/* 用户名输入 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              color: '#ffffff',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              用户名/邮箱
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#404040',
                border: '1px solid #555555',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '16px',
                outline: 'none'
              }}
              placeholder="请输入用户名/邮箱"
              disabled={loading}
            />
          </div>

          {/* 密码输入 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              color: '#ffffff',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#404040',
                border: '1px solid #555555',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '16px',
                outline: 'none'
              }}
              placeholder="请输入密码"
              disabled={loading}
            />
          </div>

          {/* 记住我和忘记密码 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ marginRight: '8px' }}
                disabled={loading}
              />
              <span style={{ color: '#ffffff' }}>记住我</span>
            </label>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setShowForgotPassword(true)
              }}
              style={{ color: '#4a90e2', textDecoration: 'none' }}
            >
              忘记密码？
            </a>
          </div>

          {/* 登录按钮 */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#4a90e2',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.3s ease'
            }}
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        {/* 注册链接 */}
        <div style={{
          textAlign: 'center',
          marginTop: '16px',
          fontSize: '14px',
          color: '#888888'
        }}>
          还没有账号？
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onClose()
              if (onSwitchToRegister) {
                onSwitchToRegister()
              }
            }}
            style={{ color: '#4a90e2', textDecoration: 'none', marginLeft: '8px' }}
          >
            立即注册
          </a>
        </div>
      </div>

      {/* 忘记密码模态框 */}
      <ForgotPasswordModal
        show={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onSuccess={() => {
          // 密码重置成功后可以执行一些操作，比如显示提示
          // 这里可以留空或根据需要添加逻辑
        }}
      />
    </div>
  )
}

export default LoginModal