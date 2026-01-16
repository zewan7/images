import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

function ImageCard({ image, onClick, onDelete, onEdit, showActions = false }) {
  const [isVisible, setIsVisible] = useState(false)
  const imgRef = useRef(null)
  const imgElementRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  
  // 使用Intersection Observer实现图片懒加载
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(imgRef.current)
        }
      },
      { threshold: 0.1 }
    )
    
    if (imgRef.current) {
      observer.observe(imgRef.current)
    }
    
    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current)
      }
    }
  }, [])
  
  // 生成缩略图URL
  const getThumbnailUrl = (originalUrl) => {
    // 将日期目录替换为日期_1目录（缩略图目录）
    return originalUrl.replace(/\/images\/(\d{8})\//, '/images/$1_1/')
  }
  
  // 保存滚动位置并导航到详情页
  const handleImageClick = () => {
    // 保存当前滚动位置到sessionStorage
    sessionStorage.setItem('galleryScrollPos', window.scrollY.toString())
    
    // 如果提供了onClick，则调用onClick，否则默认使用Link行为
    if (onClick) {
      onClick(image)
    }
    // 对于Link，不需要额外处理，React Router会自动导航
  };

  // 如果没有提供onClick，则使用默认的Link行为
  const cardContent = (
    <div className="image-card">
      <div className="image-container" ref={imgRef}>
        {/* 懒加载图片 - 渐进式加载，首页显示缩略图 */}
        {isVisible && (
          <img 
            ref={imgElementRef}
            src={getThumbnailUrl(image.url)} 
            alt={image.title} 
            loading="lazy"
            className={`image-thumbnail ${isLoaded ? 'loaded' : ''}`}
            onLoad={() => setIsLoaded(true)}
            onClick={handleImageClick} // 添加点击事件
          />
        )}
        
        {/* 操作按钮 */}
        {showActions && (
          <div className="image-actions">
            <button 
              className="image-action-btn edit-btn"
              onClick={(e) => {
                e.stopPropagation(); // 阻止事件冒泡
                if (onEdit) onEdit(image);
              }}
              title="编辑描述"
            >
              ✏️
            </button>
            <button 
              className="image-action-btn delete-btn"
              onClick={(e) => {
                e.stopPropagation(); // 阻止事件冒泡
                if (onDelete) onDelete(image.id);
              }}
              title="删除图片"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // 如果提供了onClick，则使用div包裹，否则使用Link
  if (onClick) {
    return (
      <div 
        className="image-card-link"
        onClick={handleImageClick}
      >
        {cardContent}
      </div>
    );
  }
  
  return (
    <Link 
      to={`/image/${image.id}`} 
      className="image-card-link"
      onClick={handleImageClick}
    >
      {cardContent}
    </Link>
  );
}

export default ImageCard