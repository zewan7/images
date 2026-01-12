function ImageModal({ image, onClose }) {
  if (!image) return null

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <div className="modal-image-container">
          <img 
            src={image.url} 
            alt={image.title} 
            className="modal-image"
          />
        </div>
        <div className="modal-info">
          <h2 className="modal-title">{image.title}</h2>
          <p className="modal-description">{image.description || '无描述'}</p>
          <div className="modal-meta">
            <div className="meta-item">
              <span className="meta-label">尺寸:</span>
              <span className="meta-value">{image.width} × {image.height}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">上传时间:</span>
              <span className="meta-value">{new Date(image.created_at).toLocaleString()}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">创建人:</span>
              <span className="meta-value">{image.username || '未知用户'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageModal