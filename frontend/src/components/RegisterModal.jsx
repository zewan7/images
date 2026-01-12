import React, { useState, useEffect } from 'react'
import { registerUser, requestRegisterOtp } from '../services/auth.js'

function RegisterModal({ show, onClose }) {
  // 条件渲染：如果不显示，直接返回null，避免hooks调用
  if (!show) return null

  // 所有hooks必须在条件返回之后调用
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // 倒计时效果
  useEffect(() => {
    let timer = null
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [countdown])

  // 请求验证码
  const handleRequestOtp = async () => {
    setError('')
    setSuccess('')
    setOtpLoading(true)

    if (!email) {
      setError('请先输入邮箱')
      setOtpLoading(false)
      return
    }

    try {
      await requestRegisterOtp(email)
      setOtpSent(true)
      setSuccess('验证码已发送到您的邮箱，有效期5分钟')
      setCountdown(60) // 60秒后可重新发送
    } catch (err) {
      setError(err.message || '发送验证码失败，请稍后重试')
    } finally {
      setOtpLoading(false)
    }
  }

  // 处理注册表单提交
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // 验证密码是否匹配
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      setLoading(false)
      return
    }

    // 验证验证码
    if (!otp) {
      setError('请输入验证码')
      setLoading(false)
      return
    }

    try {
      await registerUser({
        username,
        email,
        password,
        otp
      })
      
      setSuccess('注册成功！请登录您的邮箱进行验证，然后使用您的账号登录。')
      
      // 重置表单
      setUsername('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setOtp('')
      setOtpSent(false)
      
      // 3秒后自动关闭模态框
      setTimeout(() => {
        onClose()
        setSuccess('')
      }, 3000)
    } catch (err) {
      setError(err.message || '注册失败，请稍后重试')
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#ffffff', fontSize: '24px', margin: 0 }}>注册</h2>
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

        {/* 成功信息 */}
        {success && (
          <div style={{
            backgroundColor: 'rgba(46, 204, 113, 0.2)',
            color: '#2ecc71',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {success}
          </div>
        )}

        {/* 注册表单 */}
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
              用户名
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
              placeholder="请输入用户名"
              disabled={loading}
            />
          </div>

          {/* 邮箱输入 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              color: '#ffffff',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="请输入邮箱"
              disabled={loading || otpLoading}
            />
          </div>

          {/* 验证码输入 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: '#ffffff',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              验证码
              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={otpLoading || countdown > 0 || loading}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#4a90e2',
                  fontSize: '14px',
                  cursor: otpLoading || countdown > 0 || loading ? 'not-allowed' : 'pointer',
                  opacity: otpLoading || countdown > 0 || loading ? 0.5 : 1,
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                {otpLoading ? '发送中...' : countdown > 0 ? `${countdown}秒后重发` : '获取验证码'}
              </button>
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              minLength={6}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#404040',
                border: '1px solid #555555',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '16px',
                outline: 'none',
                letterSpacing: '2px',
                textAlign: 'center'
              }}
              placeholder="请输入6位验证码"
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
              minLength={8}
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
              placeholder="请输入密码（至少8个字符）"
              disabled={loading}
            />
          </div>

          {/* 确认密码输入 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#ffffff',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              确认密码
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
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
              placeholder="请再次输入密码"
              disabled={loading}
            />
          </div>

          {/* 注册按钮 */}
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
            {loading ? '注册中...' : '注册'}
          </button>
        </form>

        {/* 登录链接 */}
        <div style={{
          textAlign: 'center',
          marginTop: '16px',
          fontSize: '14px',
          color: '#888888'
        }}>
          已有账号？
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              // 关闭注册模态框，打开登录模态框
              onClose()
              // 这里需要一个方法来打开登录模态框，可以通过props传递
            }}
            style={{ color: '#4a90e2', textDecoration: 'none', marginLeft: '8px' }}
          >
            立即登录
          </a>
        </div>
      </div>
    </div>
  )
}

export default RegisterModal