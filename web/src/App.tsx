import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Sidebar from '@/components/Sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import MediaDetail from '@/pages/MediaDetail'
import List from '@/pages/List'
import Stats from '@/pages/Stats'
import Profile from '@/pages/Profile'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="flex min-h-screen bg-bg text-text">
            <Sidebar />
            <main className="ml-60 flex-1 min-w-0">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/media/:type/:id" element={<MediaDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/list" element={<List />} />
                  <Route path="/stats" element={<Stats />} />
                </Route>

                <Route path="/u/:username" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
