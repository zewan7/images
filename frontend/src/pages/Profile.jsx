import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import { getCurrentUser, updateUser, changePassword } from '../services/auth.js'
import { useAuth } from '../context/AuthContext.jsx'

function Profile() {
  const { user, updateUser: updateAuthUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [formData, setFormData] = useState({})
  const [passwordData, setPasswordData] = useState({})
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  // 加载用户资料
  const loadUserProfile = async () => {
    try {
      setLoading(true)
      const userData = await getCurrentUser()
      setFormData({
        full_name: userData.full_name || '',
        bio: userData.bio || '',
        avatar_url: userData.avatar_url || ''
      })
    } catch (error) {
      console.error('Failed to load user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    loadUserProfile()
  }, [])

  // 处理表单输入变化
  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // 处理密码表单输入变化
  const handlePasswordChange = (e) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // 提交用户资料更新
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const updatedUser = await updateUser(formData)
      updateAuthUser(updatedUser)
      setIsEditing(false)
      setMessage('资料更新成功')
      setMessageType('success')
      // 3秒后清除消息
      setTimeout(() => {
        setMessage('')
      }, 3000)
    } catch (error) {
      console.error('Failed to update profile:', error)
      setMessage('资料更新失败，请稍后重试')
      setMessageType('error')
    }
  }

  // 提交密码修改
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage('两次输入的密码不一致')
      setMessageType('error')
      return
    }
    
    try {
      await changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      })
      setPasswordData({})
      setIsChangingPassword(false)
      setMessage('密码修改成功')
      setMessageType('success')
      // 3秒后清除消息
      setTimeout(() => {
        setMessage('')
      }, 3000)
    } catch (error) {
      console.error('Failed to change password:', error)
      setMessage('密码修改失败，请检查当前密码是否正确')
      setMessageType('error')
    }
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-wrapper">
      <Navbar />
      
      <div className="profile-container">
        {/* 页面标题 */}
        <h1 className="profile-page-title">个人资料</h1>
        
        {/* 消息提示 */}
        {message && (
          <div className={`message message-${messageType}`}>
            {message}
          </div>
        )}
        
        {/* 个人资料卡片 */}
        <div className="profile-card">
          {/* 头像和基本信息 */}
          <div className="profile-header-section">
            <div className="avatar-container">
              <div className="avatar-wrapper">
                {formData.avatar_url ? (
                  <img 
                    src={formData.avatar_url} 
                    alt="Avatar" 
                    className="avatar-image"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    <span className="avatar-initial">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <h2 className="profile-name">
                {formData.full_name || user.username}
              </h2>
              <p className="profile-username">@{user.username}</p>
            </div>
          </div>
          
          {/* 用户基本信息 */}
          <div className="profile-section">
            <div className="section-header">
              <h3 className="section-title">基本信息</h3>
              <button
                className={`edit-button ${isEditing ? 'cancel' : ''}`}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? '取消' : '编辑资料'}
              </button>
            </div>
            
            {isEditing ? (
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">用户名</label>
                    <input
                      type="text"
                      value={user.username}
                      disabled
                      className="form-input disabled"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">邮箱</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="form-input disabled"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">全名</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name || ''}
                    onChange={handleInputChange}
                    placeholder="请输入全名"
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">个人简介</label>
                  <textarea
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleInputChange}
                    placeholder="请输入个人简介"
                    rows="4"
                    className="form-textarea"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">头像URL</label>
                  <input
                    type="text"
                    name="avatar_url"
                    value={formData.avatar_url || ''}
                    onChange={handleInputChange}
                    placeholder="请输入头像URL"
                    className="form-input"
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="submit-button">
                    保存更改
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-row">
                  <span className="info-label">用户名</span>
                  <span className="info-value">{user.username}</span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">邮箱</span>
                  <span className="info-value">{user.email}</span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">全名</span>
                  <span className="info-value">{formData.full_name || '未设置'}</span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">个人简介</span>
                  <span className="info-value bio-value">{formData.bio || '未设置'}</span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">注册时间</span>
                  <span className="info-value">{new Date(user.created_at).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* 密码修改 */}
          <div className="profile-section">
            <div className="section-header">
              <h3 className="section-title">密码管理</h3>
              <button
                className={`edit-button ${isChangingPassword ? 'cancel' : ''}`}
                onClick={() => setIsChangingPassword(!isChangingPassword)}
              >
                {isChangingPassword ? '取消' : '修改密码'}
              </button>
            </div>
            
            {isChangingPassword && (
              <form className="profile-form password-form" onSubmit={handlePasswordSubmit}>
                <div className="form-group">
                  <label className="form-label">当前密码</label>
                  <input
                    type="password"
                    name="current_password"
                    value={passwordData.current_password || ''}
                    onChange={handlePasswordChange}
                    required
                    placeholder="请输入当前密码"
                    className="form-input"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">新密码</label>
                    <input
                      type="password"
                      name="new_password"
                      value={passwordData.new_password || ''}
                      onChange={handlePasswordChange}
                      required
                      placeholder="请输入新密码"
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">确认新密码</label>
                    <input
                      type="password"
                      name="confirm_password"
                      value={passwordData.confirm_password || ''}
                      onChange={handlePasswordChange}
                      required
                      placeholder="请再次输入新密码"
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="submit-button">
                    确认修改
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      
      {/* 样式 */}
      <style jsx>{`
        .profile-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 33%, #16213e 66%, #0f3460 100%);
          background-size: 400% 400%;
          animation: gradientShift 20s ease infinite;
          position: relative;
          overflow: hidden;
        }
        
        /* 添加与Home页面相同的渐变动画 */
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .profile-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        
        .profile-page-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 30px 0;
          background: linear-gradient(135deg, #ffffff 0%, #4a90e2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        /* 消息提示 */
        .message {
          padding: 16px 20px;
          border-radius: 8px;
          margin-bottom: 24px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .message-success {
          background-color: rgba(46, 204, 113, 0.2);
          color: #2ecc71;
          border-left: 4px solid #2ecc71;
        }
        
        .message-error {
          background-color: rgba(231, 76, 60, 0.2);
          color: #e74c3c;
          border-left: 4px solid #e74c3c;
        }
        
        /* 个人资料卡片 */
        .profile-card {
          background-color: #2d2d2d;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }
        
        /* 头像和基本信息 */
        .profile-header-section {
          background: linear-gradient(135deg, #4a90e2 0%, #2980b9 100%);
          padding: 40px;
          text-align: center;
        }
        
        .avatar-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .avatar-wrapper {
          position: relative;
          margin-bottom: 20px;
        }
        
        .avatar-image {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          border: 5px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease;
        }
        
        .avatar-image:hover {
          transform: scale(1.05);
        }
        
        .avatar-placeholder {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffffff 0%, #f1f1f1 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 5px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .avatar-initial {
          font-size: 60px;
          font-weight: 800;
          color: #4a90e2;
        }
        
        .profile-name {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 8px 0;
        }
        
        .profile-username {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }
        
        /* 资料部分 */
        .profile-section {
          padding: 30px;
          border-bottom: 1px solid #3a3a3a;
        }
        
        .profile-section:last-child {
          border-bottom: none;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .section-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }
        
        /* 编辑按钮 */
        .edit-button {
          background-color: #4a90e2;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .edit-button:hover {
          background-color: #357abd;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
        }
        
        .edit-button.cancel {
          background-color: #e74c3c;
        }
        
        .edit-button.cancel:hover {
          background-color: #c0392b;
          box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
        }
        
        /* 表单样式 */
        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: #cccccc;
        }
        
        .form-input,
        .form-textarea {
          padding: 14px;
          background-color: #404040;
          color: #ffffff;
          border: 2px solid #555555;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
          outline: none;
        }
        
        .form-input:focus,
        .form-textarea:focus {
          border-color: #4a90e2;
          box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
        }
        
        .form-input.disabled {
          background-color: #353535;
          color: #888888;
          cursor: not-allowed;
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 10px;
        }
        
        .submit-button {
          background-color: #4a90e2;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .submit-button:hover {
          background-color: #357abd;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
        }
        
        /* 信息展示 */
        .profile-info {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .info-row {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 20px;
          align-items: center;
        }
        
        .info-label {
          font-size: 14px;
          font-weight: 500;
          color: #888888;
        }
        
        .info-value {
          font-size: 16px;
          color: #ffffff;
        }
        
        .bio-value {
          line-height: 1.6;
          white-space: pre-line;
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
          .profile-container {
            padding: 20px 16px;
          }
          
          .profile-page-title {
            font-size: 2rem;
          }
          
          .profile-header-section {
            padding: 30px 20px;
          }
          
          .profile-section {
            padding: 20px;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .info-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          
          .avatar-image,
          .avatar-placeholder {
            width: 120px;
            height: 120px;
          }
          
          .avatar-initial {
            font-size: 50px;
          }
          
          .profile-name {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </div>
  )
}

export default Profile