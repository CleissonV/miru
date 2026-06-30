import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Search, List, BarChart2, User, Sun, Moon, LogOut, Tv } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuthStore } from '@/stores/authStore'
import { useT } from '@/i18n/translations'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const { theme, toggle } = useTheme()
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const t = useT()

  const NAV = [
    { to: '/', icon: Home, label: t('nav_home'), exact: true },
    { to: '/search', icon: Search, label: t('nav_search') },
    { to: '/list', icon: List, label: t('nav_list') },
    { to: '/stats', icon: BarChart2, label: t('nav_stats') },
  ]

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-border bg-surface">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-purple-pink shadow-glow">
          <Tv size={16} className="text-white" />
        </div>
        <span className="text-lg font-bold gradient-text">Miru</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
          {t('nav_menu')}
        </p>
        <div className="space-y-0.5">
          {NAV.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-gradient-purple-pink text-white shadow-glow'
                    : 'text-text-muted hover:bg-surface-2 hover:text-text',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? 'text-white' : ''} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {isAuthenticated && (
          <>
            <p className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
              {t('nav_account')}
            </p>
            <div className="space-y-0.5">
              <NavLink
                to={`/u/${user?.username}`}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-gradient-purple-pink text-white shadow-glow'
                      : 'text-text-muted hover:bg-surface-2 hover:text-text',
                  )
                }
              >
                <User size={18} />
                {t('nav_profile')}
              </NavLink>
            </div>
          </>
        )}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border p-3 space-y-1">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {theme === 'dark' ? t('theme_light') : t('theme_dark')}
        </button>

        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={18} />
            {t('logout')}
          </button>
        ) : (
          <div className="pt-2 space-y-2 px-1">
            <NavLink
              to="/login"
              className="block w-full rounded-xl border border-border py-2 text-center text-sm font-medium text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
            >
              {t('login')}
            </NavLink>
            <NavLink
              to="/register"
              className="block w-full rounded-xl bg-gradient-purple-pink py-2 text-center text-sm font-semibold text-white shadow-glow transition-opacity hover:opacity-90"
            >
              {t('register')}
            </NavLink>
          </div>
        )}

        {/* User info */}
        {isAuthenticated && user && (
          <div className="mt-2 flex items-center gap-3 rounded-xl bg-surface-2 px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-purple-pink text-xs font-bold text-white">
              {(user.displayName ?? user.username).slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-text">
                {user.displayName ?? user.username}
              </p>
              <p className="truncate text-xs text-text-muted">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
