import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LoginModal from './LoginModal.jsx'
import RegisterModal from './RegisterModal.jsx'
import UploadModal from './UploadModal.jsx'

function Navbar({ onImageUploaded }) {
  const navigate = useNavigate()
  const { user, isLoggedIn, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* 简单的Logo，使用SVG图标 */}
          <div className="navbar-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="24" height="24" rx="4" fill="#4a90e2" />
              <path d="M8 12L16 16L24 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 8L24 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="16" cy="16" r="2" fill="white" />
            </svg>
          </div>
          <h1 className="navbar-title">视觉画廊</h1>
        </Link>

        
        {/* 认证相关按钮 */}
        {isLoggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* 上传按钮 */}
            <button 
              onClick={() => setShowUpload(true)}
              style={{
                backgroundColor: '#4a90e2',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              上传图片
            </button>
            
            {/* 用户菜单 */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  backgroundColor: '#404040',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden'
                }}
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%'
                    }}
                    onError={(e) => {
                      // 图片加载失败时显示用户名首字母
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  style={{
                    display: user.avatar_url ? 'none' : 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%'
                  }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </button>
              
              {/* 用户菜单下拉 */}
              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  backgroundColor: '#2d2d2d',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  width: '180px',
                  zIndex: 1000
                }}>
                  <div style={{
                    padding: '12px',
                    borderBottom: '1px solid #404040'
                  }}>
                    <div style={{ fontWeight: 'bold' }}>{user.username}</div>
                    <div style={{ fontSize: '12px', color: '#888888' }}>{user.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      navigate('/profile')
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      color: 'white',
                      border: 'none',
                      padding: '12px',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    我的资料
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      navigate('/my-images')
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      color: 'white',
                      border: 'none',
                      padding: '12px',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    我的图片
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      logout()
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#e74c3c',
                      border: 'none',
                      padding: '12px',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      borderTop: '1px solid #404040'
                    }}
                  >
                    退出登录
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowLogin(true)}
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid #404040',
                borderRadius: '20px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              登录
            </button>
            <button
              onClick={() => setShowRegister(true)}
              style={{
                backgroundColor: '#4a90e2',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              注册
            </button>
          </div>
        )}
      </div>
      
      {/* 模态框 */}
      <LoginModal show={showLogin} onClose={() => setShowLogin(false)} />
      <RegisterModal show={showRegister} onClose={() => setShowRegister(false)} />
      <UploadModal show={showUpload} onClose={() => setShowUpload(false)} onUploadSuccess={onImageUploaded} />
    </nav>
  )
}

export default Navbar