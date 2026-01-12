import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import { fetchImageById } from '../services/api.js'
import { useParams, useNavigate } from 'react-router-dom'

function ImageDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true)
        const data = await fetchImageById(id)
        setImage(data)
      } catch (err) {
        setError('Failed to load image')
        console.error('Error loading image:', err)
      } finally {
        setLoading(false)
      }
    }

    loadImage()
  }, [id])

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  if (error || !image) {
    return (
      <div>
        <Navbar />
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
          <h1>图片加载失败</h1>
          <p>{error || '图片不存在或已被删除'}</p>
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              marginTop: '20px'
            }}
          >
            返回首页
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="image-detail-wrapper">
      <Navbar />
      
      <div className="image-detail-container">
        {/* 图片主体 */}
        <div className="image-main">
          <div className="image-display">
            <img 
              src={image.url} 
              alt={image.title} 
              className="detail-image"
            />
          </div>
        </div>
        
        {/* 图片信息 */}
        <div className="image-info-panel">
          <div className="info-section">
            <h1 className="image-title">{image.title}</h1>
            <p className="image-description">
              {image.description || '无描述'}
            </p>
          </div>
          
          <div className="info-section metadata">
            <div className="info-item">
              <span className="info-label">创建人:</span>
              <span className="info-value">{image.username || '未知用户'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">尺寸:</span>
              <span className="info-value">{image.width} × {image.height} 像素</span>
            </div>
            <div className="info-item">
              <span className="info-label">上传时间:</span>
              <span className="info-value">{new Date(image.created_at).toLocaleString()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">文件名称:</span>
              <span className="info-value">{image.filename}</span>
            </div>
          </div>
          
          <div className="action-buttons">
            <button
              className="back-button"
              onClick={() => navigate('/')}
            >
              返回画廊
            </button>
            <button
              className="download-button"
              onClick={() => window.open(image.url, '_blank')}
            >
              查看原图
            </button>
          </div>
        </div>
      </div>
      
      {/* 样式 */}
      <style jsx>{`
        .image-detail-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        }
        
        .image-detail-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 40px;
          align-items: start;
        }
        
        /* 图片主体 */
        .image-main {
          background-color: #2d2d2d;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }
        
        .image-display {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #000000;
          border-radius: 8px;
          overflow: hidden;
          min-height: 400px;
        }
        
        .detail-image {
          max-width: 100%;
          max-height: 70vh;
          object-fit: contain;
        }
        
        /* 图片信息面板 */
        .image-info-panel {
          background-color: #2d2d2d;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          position: sticky;
          top: 100px;
        }
        
        .info-section {
          margin-bottom: 30px;
        }
        
        .info-section:last-child {
          margin-bottom: 0;
        }
        
        .image-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 16px 0;
          background: linear-gradient(135deg, #ffffff 0%, #4a90e2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .image-description {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #cccccc;
          margin: 0;
          white-space: pre-line;
        }
        
        /* 元数据 */
        .metadata {
          background-color: #353535;
          padding: 20px;
          border-radius: 8px;
        }
        
        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #4a4a4a;
        }
        
        .info-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        
        .info-label {
          font-size: 14px;
          font-weight: 500;
          color: #888888;
        }
        
        .info-value {
          font-size: 14px;
          color: #ffffff;
          text-align: right;
        }
        
        /* 操作按钮 */
        .action-buttons {
          display: flex;
          gap: 12px;
          margin-top: 30px;
        }
        
        .back-button,
        .download-button {
          flex: 1;
          padding: 14px 20px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .back-button {
          background-color: #404040;
          color: #ffffff;
        }
        
        .back-button:hover {
          background-color: #505050;
          transform: translateY(-1px);
        }
        
        .download-button {
          background-color: #4a90e2;
          color: #ffffff;
        }
        
        .download-button:hover {
          background-color: #357abd;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
        }
        
        /* 响应式设计 */
        @media (max-width: 1024px) {
          .image-detail-container {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .image-info-panel {
            position: static;
          }
        }
        
        @media (max-width: 768px) {
          .image-detail-container {
            padding: 20px 16px;
          }
          
          .image-title {
            font-size: 1.8rem;
          }
          
          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default ImageDetail