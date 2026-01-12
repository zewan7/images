import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import ImageCard from '../components/ImageCard.jsx'
import { fetchImages } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

function Home() {
  const { user } = useAuth()
  const [images, setImages] = useState([])
  const [allImages, setAllImages] = useState([]) // 保存所有已加载的图片，用于随机显示
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0) // 用于触发图片列表刷新
  const [searchTerm, setSearchTerm] = useState('') // 搜索关键词
  const [isSearching, setIsSearching] = useState(false) // 搜索状态
  const [showScrollTop, setShowScrollTop] = useState(false) // 控制返回顶部按钮显示

  const [loadMoreLoading, setLoadMoreLoading] = useState(false) // 加载更多状态
  const [hasMore, setHasMore] = useState(true) // 是否还有更多图片
  const [skip, setSkip] = useState(0) // 当前跳过的图片数量
  const [limit] = useState(40) // 每次加载的图片数量

  // 加载图片列表，支持分页和搜索
  const loadImages = async (search = '', isLoadMore = false) => {
    try {
      const currentSkip = isLoadMore ? skip : 0
      
      if (isLoadMore) {
        setLoadMoreLoading(true)
      } else {
        setLoading(true)
      }
      
      const data = await fetchImages(currentSkip, limit, search)
      
      if (isLoadMore) {
        setImages(prevImages => [...prevImages, ...data])
        setAllImages(prevAllImages => [...prevAllImages, ...data])
        setSkip(prevSkip => prevSkip + limit)
        setHasMore(data.length === limit)
      } else {
        setImages(data)
        setAllImages(data)
        setSkip(limit)
        setHasMore(data.length === limit)
      }
    } catch (error) {
      console.error('Failed to load images:', error)
    } finally {
      if (isLoadMore) {
        setLoadMoreLoading(false)
      } else {
        setLoading(false)
        setIsSearching(false)
      }
    }
  }

  // 初始加载和刷新触发
  useEffect(() => {
    loadImages()
  }, [refreshKey])

  // 图片上传成功后刷新列表
  const handleImageUploaded = () => {
    setRefreshKey(prev => prev + 1)
  }

  // 搜索处理函数
  const handleSearch = (e) => {
    e.preventDefault()
    setIsSearching(true)
    loadImages(searchTerm)
  }

  // 清除搜索
  const handleClearSearch = () => {
    setSearchTerm('')
    loadImages()
  }
  
  // 滚动监听，控制返回顶部按钮显示和加载更多
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
      
      // 检测是否滚动到底部，触发加载更多
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && hasMore && !loadMoreLoading && !loading) {
        loadImages(searchTerm, true)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasMore, loadMoreLoading, loading, searchTerm])
  
  // 返回顶部函数
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 随机显示图片函数
  const showRandomImages = () => {
    // 如果有搜索结果，只在搜索结果中随机
    // 否则从所有已加载图片中随机
    const sourceImages = searchTerm ? images : allImages;
    
    if (sourceImages.length > 0) {
      // 创建数组副本并随机打乱
      const shuffledImages = [...sourceImages].sort(() => Math.random() - 0.5);
      
      // 保持与当前显示相同数量的图片，确保布局一致
      setImages(shuffledImages.slice(0, images.length));
    } else {
      // 如果当前没有图片，重新加载图片
      loadImages();
    }
  }

  return (
    <>
      <div className="home-container">
        <Navbar onImageUploaded={handleImageUploaded} />
        
        {/* 搜索栏 */}
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="搜索图片标题、描述或作者..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                disabled={loading}
              />
              <div className="search-actions">
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="clear-button"
                    disabled={loading}
                    title="清除搜索"
                  >
                    ×
                  </button>
                )}
                <button
                  type="submit"
                  className="search-button"
                  disabled={loading || isSearching}
                >
                  {isSearching ? '搜索中...' : '搜索'}
                </button>
                <button
                  type="button"
                  onClick={showRandomImages}
                  className="random-button"
                  disabled={loading}
                  title="随机显示图片"
                >
                  随机
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* 图片网格 */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>正在加载精彩内容...</p>
        </div>
      ) : (
        <>
          {/* 自定义网格布局，每行固定数量图片 */}
          <div className="custom-grid">
            {images.length > 0 ? (
              <>
                {/* 将图片按行分组，实现指定的布局逻辑 */}
                {(() => {
                  const rows = [];
                  let currentIndex = 0;
                  
                  // 定义每行的图片数量（循环使用）
                  const rowCounts = [4, 5, 5, 6, 8];
                  let rowIndex = 0;
                  
                  while (currentIndex < images.length) {
                    // 获取当前行的图片数量
                    const count = rowCounts[rowIndex % rowCounts.length];
                    const rowImages = images.slice(currentIndex, currentIndex + count);
                    
                    rows.push(
                      <div key={rowIndex} className="grid-row">
                        {rowImages.map(image => (
                          <div key={image.id} className="grid-item">
                            <ImageCard 
                              image={image} 
                            />
                          </div>
                        ))}
                      </div>
                    );
                    
                    currentIndex += count;
                    rowIndex++;
                  }
                  
                  return rows;
                })()}
              </>
            ) : (
              <div className="no-results">
                <h2>未找到图片</h2>
                <p>尝试使用其他关键词搜索</p>
                {searchTerm && (
                  <button onClick={handleClearSearch} className="clear-search-btn">
                    查看所有图片
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* 加载更多状态 */}
          {loadMoreLoading && (
            <div className="load-more-container">
              <div className="spinner"></div>
              <p>正在加载更多图片...</p>
            </div>
          )}
          
          {/* 没有更多图片的提示 */}
          {!hasMore && images.length > 0 && (
            <div className="no-more-container">
              <p>已经到底了~</p>
            </div>
          )}
        </>
      )}
        
        {/* 返回顶部按钮 */}
        {showScrollTop && (
          <button 
            className="scroll-top-btn"
            onClick={scrollToTop}
            title="返回顶部"
          >
            ↑
          </button>
        )}
      </div>
      
      {/* 样式 */}
      <style jsx>{`
        .home-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 33%, #16213e 66%, #0f3460 100%);
          background-size: 400% 400%;
          animation: gradientShift 20s ease infinite;
          position: relative;
          overflow: hidden;
        }
        
        .home-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 50% 50%, rgba(74, 144, 226, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
          pointer-events: none;
          z-index: 0;
        }
        
        .home-container::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(74, 144, 226, 0.05)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
          pointer-events: none;
          z-index: 0;
        }
        
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
        
        .search-container {
          max-width: 800px;
          margin: 20px auto;
          padding: 0 20px;
        }
        
        .search-form {
          display: flex;
          justify-content: center;
        }
        
        .search-input-wrapper {
          width: 100%;
          display: flex;
          background: linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 33%, #16213e 66%, #0f3460 100%);
          background-size: 400% 400%;
          animation: gradientShift 20s ease infinite;
          border-radius: 25px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          border: 1px solid rgba(74, 144, 226, 0.2);
        }
        
        .search-input {
          flex: 1;
          padding: 15px 20px;
          font-size: 16px;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
        }
        
        .search-input::placeholder {
          color: #888;
        }
        
        .search-actions {
          display: flex;
          align-items: center;
        }
        
        .clear-button {
          padding: 10px;
          margin: 0 5px;
          background: transparent;
          border: none;
          color: #888;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        
        .clear-button:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }
        
        .search-button {
          padding: 15px 25px;
          background: linear-gradient(135deg, #4a90e2, #357abd);
          color: white;
          border: none;
          border-radius: 25px;
          margin: 5px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .search-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #357abd, #2a6099);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
        }
        
        .search-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        /* 随机按钮样式 */
        .random-button {
          padding: 15px 25px;
          background: linear-gradient(135deg, #4a90e2, #357abd);
          color: white;
          border: none;
          border-radius: 25px;
          margin: 5px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .random-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #357abd, #2a6099);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
        }
        
        .random-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 50vh;
          gap: 20px;
          color: #ffffff;
          z-index: 1;
          position: relative;
        }
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(74, 144, 226, 0.3);
          border-top: 3px solid #4a90e2;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* 自定义网格布局样式 - 调整高度、圆角和间距 */
        .custom-grid {
          display: flex;
          flex-direction: column;
          gap: 7px; /* 上下间距统一7px */
          padding: 0 10px;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        /* 行容器 - 宽度一致，左右对齐，间距统一 */
        .grid-row {
          display: flex;
          gap: 7px; /* 左右间距统一7px */
          justify-content: center;
          width: 100%;
        }
        
        /* 图片项 - 长方体，更细圆角 */
        .grid-item {
          flex: 0 0 auto;
          border-radius: 6px;
          overflow: hidden;
          background-color: #1a1a1a;
        }
        
        /* 图片容器 - 更高的高度，使用aspect-ratio控制比例 */
        .image-container {
          width: 100%;
          overflow: hidden;
          position: relative;
          background-color: #1a1a1a;
          border-radius: 6px;
          aspect-ratio: 1.5 / 1; /* 宽:高 = 1.5:1，高度更高 */
        }
        
        /* 图片 - 填满容器，保持比例，更细圆角 */
        .image-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 6px;
        }
        
        /* 第一行 - 4个图片，统一间距7px */
        .grid-row:nth-child(1) {
          gap: 7px;
        }
        
        .grid-row:nth-child(1) .grid-item {
          width: calc(25% - 5.25px); /* 4个图片，3个间距 */
        }
        
        /* 第二、三行 - 5个图片，统一间距7px */
        .grid-row:nth-child(2),
        .grid-row:nth-child(3) {
          gap: 7px;
        }
        
        .grid-row:nth-child(2) .grid-item,
        .grid-row:nth-child(3) .grid-item {
          width: calc(20% - 5.6px); /* 5个图片，4个间距 */
        }
        
        /* 第四行 - 6个图片，统一间距7px */
        .grid-row:nth-child(4) {
          gap: 7px;
        }
        
        .grid-row:nth-child(4) .grid-item {
          width: calc(16.67% - 5.83px); /* 6个图片，5个间距 */
        }
        
        /* 第五行及以下 - 8个图片，统一间距7px */
        .grid-row:nth-child(5) .grid-item,
        .grid-row:nth-child(n+5) .grid-item {
          width: calc(12.5% - 6.125px); /* 8个图片，7个间距 */
        }
        
        /* 返回顶部按钮 */
        .scroll-top-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4a90e2, #357abd);
          color: white;
          border: none;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
          transition: all 0.3s ease;
          z-index: 1000;
        }
        
        .scroll-top-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(74, 144, 226, 0.6);
        }
        
        /* 加载更多样式 */
        .load-more-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin: 30px 0;
          gap: 15px;
          color: #ffffff;
        }
        
        /* 没有更多图片样式 */
        .no-more-container {
          text-align: center;
          padding: 30px;
          color: #888888;
          font-size: 14px;
        }
        
        .no-results {
          text-align: center;
          padding: 60px 20px;
          color: #ffffff;
        }
        
        .no-results h2 {
          font-size: 2rem;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #ffffff, #4a90e2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .no-results p {
          color: #888;
          margin-bottom: 20px;
        }
        
        .clear-search-btn {
          background: linear-gradient(135deg, #4a90e2, #357abd);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .clear-search-btn:hover {
          background: linear-gradient(135deg, #357abd, #2a6099);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
        }
        
        @media (max-width: 768px) {
        .search-container {
          padding: 0 16px;
        }
        
        .search-form {
          flex-direction: column;
        }
        
        .search-input-wrapper {
          flex-direction: column;
        }
        
        .search-input {
          padding: 12px 15px;
        }
        
        .search-actions {
          justify-content: flex-end;
          padding: 5px 5px 5px 0;
        }
        
        .search-button {
          padding: 12px 20px;
        }
      }
      `}</style>
    </>
  )
}

export default Home