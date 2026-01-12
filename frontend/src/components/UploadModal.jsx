import React, { useState } from 'react'
import { uploadImage } from '../services/auth.js'

function UploadModal({ show, onClose, onUploadSuccess }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)

  if (!show) return null

  // 处理文件选择
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      // 验证文件类型
      if (!selectedFile.type.startsWith('image/')) {
        setError('请选择图片文件')
        return
      }
      
      // 验证文件大小（20MB）
      if (selectedFile.size > 20 * 1024 * 1024) {
        setError('图片大小不能超过20MB')
        return
      }
      
      setFile(selectedFile)
      setError('')
      
      // 生成预览
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!file) {
      setError('请选择要上传的图片')
      setLoading(false)
      return
    }

    try {
        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        formData.append('file', file)

        await uploadImage(formData)
        
        setSuccess('图片上传成功！')
        
        // 重置表单
        setTitle('')
        setDescription('')
        setFile(null)
        setPreview(null)
        
        // 触发上传成功回调，刷新图片列表
        if (onUploadSuccess) {
          onUploadSuccess()
        }
        
        // 2秒后自动关闭模态框
        setTimeout(() => {
          onClose()
          setSuccess('')
        }, 2000)
    } catch (err) {
        setError(err.message || '图片上传失败，请稍后重试')
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
        maxWidth: '500px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
      }}>
        {/* 模态框头部 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#ffffff', fontSize: '24px', margin: 0 }}>上传图片</h2>
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

        {/* 上传表单 */}
        <form onSubmit={handleSubmit}>
          {/* 图片预览 */}
          {preview && (
            <div style={{
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              <img
                src={preview}
                alt="预览"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  borderRadius: '4px',
                  objectFit: 'contain'
                }}
              />
            </div>
          )}

          {/* 文件选择 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              color: '#ffffff',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              选择图片
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#404040',
                border: '1px solid #555555',
                borderRadius: '4px',
                color: '#ffffff',
                cursor: 'pointer'
              }}
              disabled={loading}
            />
            <div style={{
            fontSize: '12px',
            color: '#888888',
            marginTop: '4px'
          }}>
            支持 JPG, PNG, GIF 格式，大小不超过 20MB
          </div>
          </div>

          {/* 标题输入 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              color: '#ffffff',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              placeholder="请输入图片标题"
              disabled={loading}
            />
          </div>

          {/* 描述输入 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#ffffff',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              描述（可选）
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#404040',
                border: '1px solid #555555',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '16px',
                outline: 'none',
                resize: 'vertical',
                minHeight: '100px'
              }}
              placeholder="请输入图片描述"
              disabled={loading}
            />
          </div>

          {/* 提交按钮 */}
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
            {loading ? '上传中...' : '上传图片'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UploadModal