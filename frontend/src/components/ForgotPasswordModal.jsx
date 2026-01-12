import React, { useState, useEffect } from 'react'
import { requestPasswordResetOtp, verifyPasswordResetOtp, resetPassword } from '../services/auth.js'

function ForgotPasswordModal({ show, onClose, onSuccess }) {
  // 条件渲染：如果不显示，直接返回null，避免hooks调用
  if (!show) return null

  // 所有hooks必须在条件返回之后调用
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
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
      await requestPasswordResetOtp(email)
      setOtpSent(true)
      setSuccess('验证码已发送到您的邮箱，有效期5分钟')
      setCountdown(60) // 60秒后可重新发送
    } catch (err) {
      setError(err.message || '发送验证码失败，请稍后重试')
    } finally {
      setOtpLoading(false)
    }
  }

  // 验证验证码
  const handleVerifyOtp = async () => {
    setError('')
    setSuccess('')
    setLoading(true)

    if (!otp) {
      setError('请输入验证码')
      setLoading(false)
      return
    }

    try {
      const response = await verifyPasswordResetOtp(email, otp)
      setResetToken(response.reset_token)
      setOtpVerified(true)
      setSuccess('验证码验证成功')
      setTimeout(() => setSuccess(''), 2000)
    } catch (err) {
      setError(err.message || '验证验证码失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 处理重置密码表单提交
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // 验证密码是否匹配
    if (newPassword !== confirmPassword) {
      setError('两次输入的密码不一致')
      setLoading(false)
      return
    }

    try {
      await resetPassword({
        token: resetToken,
        new_password: newPassword
      })
      
      setSuccess('密码重置成功！')
      
      // 重置表单
      setEmail('')
      setOtp('')
      setNewPassword('')
      setConfirmPassword('')
      setResetToken('')
      setOtpSent(false)
      setOtpVerified(false)
      
      // 3秒后自动关闭模态框
      setTimeout(() => {
        onClose()
        if (onSuccess) onSuccess()
        setSuccess('')
      }, 3000)
    } catch (err) {
      setError(err.message || '重置密码失败，请稍后重试')
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
          <h2 style={{ color: '#ffffff', fontSize: '24px', margin: 0 }}>忘记密码</h2>
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

        {!otpVerified ? (
          // 验证码验证步骤
          <form onSubmit={(e) => {
            e.preventDefault()
            if (otpSent) {
              handleVerifyOtp()
            } else {
              handleRequestOtp()
            }
          }}>
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
                placeholder="请输入您的邮箱"
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

            {/* 下一步按钮 */}
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
              {loading ? '处理中...' : otpSent ? '验证验证码' : '发送验证码'}
            </button>
          </form>
        ) : (
          // 重置密码步骤
          <form onSubmit={handleResetPassword}>
            {/* 新密码输入 */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#ffffff',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                新密码
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                placeholder="请输入新密码（至少8个字符）"
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
                placeholder="请再次输入新密码"
                disabled={loading}
              />
            </div>

            {/* 重置密码按钮 */}
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
              {loading ? '重置中...' : '重置密码'}
            </button>
          </form>
        )}

        {/* 返回登录链接 */}
        <div style={{
          textAlign: 'center',
          marginTop: '16px',
          fontSize: '14px',
          color: '#888888'
        }}>
          返回登录？
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onClose()
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

export default ForgotPasswordModal
