import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthProvider } from './context/AuthContext.jsx'

// 懒加载组件
const Home = lazy(() => import('./pages/Home.jsx'))
const MyImages = lazy(() => import('./pages/MyImages.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const ImageDetail = lazy(() => import('./pages/ImageDetail.jsx'))

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Suspense 
            fallback={
              <div className="loading-container">
                <div className="spinner"></div>
                <p>加载中...</p>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/my-images" element={<MyImages />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/image/:id" element={<ImageDetail />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </div>
    </AuthProvider>
  )
}

export default App