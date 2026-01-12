import { Link } from 'react-router-dom'

function ImageCard({ image, onClick, onDelete, onEdit, showActions = false }) {
  // 如果没有提供onClick，则使用默认的Link行为
  const cardContent = (
    <div className="image-card">
      <div className="image-container">
        <img 
          src={image.url} 
          alt={image.title} 
          loading="lazy"
          className="image-thumbnail"
        />
        
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
        onClick={() => onClick(image)}
      >
        {cardContent}
      </div>
    );
  }
  
  return (
    <Link to={`/image/${image.id}`} className="image-card-link">
      {cardContent}
    </Link>
  );
}

export default ImageCard