import { Routes, Route } from 'react-router-dom'
import StartPage from './pages/StartPage'
import ProfilePage from './pages/ProfilePage'
import SearchPage from './pages/SearchPage'
import ResultPage from './pages/ResultPage'

function App() {
  return (
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
  )
}

export default App