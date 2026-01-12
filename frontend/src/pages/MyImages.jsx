import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import ImageCard from '../components/ImageCard.jsx'
import ImageModal from '../components/ImageModal.jsx'
import { getUserImages, deleteImage, updateImageDescription } from '../services/auth.js'
import { useAuth } from '../context/AuthContext.jsx'

function MyImages() {
  const { user, isLoggedIn, logout } = useAuth()
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [editingImage, setEditingImage] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0) // 用于触发图片列表刷新

  // 加载当前用户的图片
  const loadMyImages = async () => {
    try {
      setLoading(true)
      const data = await getUserImages()
      setImages(data)
    } catch (error) {
      console.error('Failed to load my images:', error)
    } finally {
      setLoading(false)
    }
  }

  // 初始加载和刷新触发
  useEffect(() => {
    loadMyImages()
  }, [refreshKey])

  const handleImageClick = (image) => {
    setSelectedImage(image)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
  }

  // 图片上传成功后刷新列表
  const handleImageUploaded = () => {
    setRefreshKey(prev => prev + 1)
  }

  // 删除图片
  const handleDeleteImage = async (imageId) => {
    if (window.confirm('确定要删除这张图片吗？')) {
      try {
        setDeleting(true)
        await deleteImage(imageId)
        // 从列表中移除图片
        setImages(images.filter(img => img.id !== imageId))
      } catch (error) {
        console.error('Failed to delete image:', error)
        alert('删除图片失败：' + error.message)
      } finally {
        setDeleting(false)
      }
    }
  }

  // 打开编辑模态框
  const handleEditImage = (image) => {
    setEditingImage(image)
    setEditTitle(image.title)
    setEditDescription(image.description || '')
  }

  // 关闭编辑模态框
  const handleCloseEditModal = () => {
    setEditingImage(null)
    setEditTitle('')
    setEditDescription('')
  }

  // 保存图片描述修改
  const handleSaveEdit = async () => {
    if (!editingImage) return
    
    try {
      setUpdating(true)
      const updatedImage = await updateImageDescription(
        editingImage.id, 
        editTitle, 
        editDescription
      )
      
      // 更新列表中的图片
      setImages(images.map(img => 
        img.id === editingImage.id ? updatedImage : img
      ))
      
      handleCloseEditModal()
    } catch (error) {
      console.error('Failed to update image description:', error)
      alert('修改图片描述失败：' + error.message)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 33%, #16213e 66%, #0f3460 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 20s ease infinite',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Navbar onImageUploaded={handleImageUploaded} />
      
      <div className="container">
        <h2 style={{ 
          color: '#ffffff', 
          margin: '20px 0',
          background: 'linear-gradient(135deg, #ffffff 0%, #4a90e2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>我的图片</h2>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <p>加载中...</p>
          </div>
        ) : images.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '50vh',
            color: '#888888'
          }}>
            <p>你还没有上传任何图片</p>
            <button
              onClick={() => {
                // 打开上传模态框的逻辑
                document.querySelector('.navbar button:nth-child(2)').click()
              }}
              style={{
                marginTop: '20px',
                backgroundColor: '#4a90e2',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              上传第一张图片
            </button>
          </div>
        ) : (
          <div className="masonry-grid">
            {images.map(image => (
              <ImageCard 
                key={image.id} 
                image={image} 
                onClick={handleImageClick} 
                onDelete={handleDeleteImage}
                onEdit={handleEditImage}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
      
      <ImageModal image={selectedImage} onClose={handleCloseModal} />
      
      {/* 编辑图片模态框 */}
      {editingImage && (
        <div className="modal">
          <div className="modal-content" style={{ maxWidth: '500px', padding: '24px' }}>
            <button 
              className="modal-close"
              onClick={handleCloseEditModal}
              style={{ position: 'absolute', top: '10px', right: '10px' }}
            >
              &times;
            </button>
            
            <h2 style={{ marginBottom: '20px' }}>编辑图片信息</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* 图片预览 */}
              <div style={{ 
                width: '100%', 
                height: '200px', 
                backgroundColor: '#1a1a1a', 
                borderRadius: '8px', 
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img 
                  src={editingImage.url} 
                  alt={editingImage.title} 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    objectFit: 'contain'
                  }}
                />
              </div>
              
              {/* 标题输入 */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: 'bold'
                }}>
                  标题
                </label>
                <input 
                  type="text" 
                  value={editTitle} 
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #555',
                    backgroundColor: '#333',
                    color: '#fff',
                    fontSize: '16px'
                  }}
                  required
                />
              </div>
              
              {/* 描述输入 */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: 'bold'
                }}>
                  描述
                </label>
                <textarea 
                  value={editDescription} 
                  onChange={(e) => setEditDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #555',
                    backgroundColor: '#333',
                    color: '#fff',
                    fontSize: '16px',
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                  placeholder="请输入图片描述..."
                />
              </div>
              
              {/* 操作按钮 */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  onClick={handleCloseEditModal}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '4px',
                    border: '1px solid #555',
                    backgroundColor: '#333',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  取消
                </button>
                <button 
                  onClick={handleSaveEdit}
                  disabled={updating}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: '#4a90e2',
                    color: '#fff',
                    cursor: updating ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    opacity: updating ? 0.7 : 1
                  }}
                >
                  {updating ? '保存中...' : '保存'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 删除确认遮罩 */}
      {deleting && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: '#2d2d2d',
            padding: '20px',
            borderRadius: '8px',
            color: '#fff'
          }}>
            <p>删除中...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyImages