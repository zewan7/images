import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import MyImages from './pages/MyImages.jsx'
import Profile from './pages/Profile.jsx'
import ImageDetail from './pages/ImageDetail.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/my-images" element={<MyImages />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/image/:id" element={<ImageDetail />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  )
}

export default App