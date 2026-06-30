import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, List, BarChart2, LogOut, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold text-accent transition-opacity hover:opacity-80"
        >
          <span className="text-2xl leading-none">見</span>
          <span className="tracking-tight">Miru</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/search" active={isActive('/search')}>
            <Search size={15} />
            <span className="hidden sm:inline">Buscar</span>
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/list" active={isActive('/list')}>
                <List size={15} />
                <span className="hidden sm:inline">Lista</span>
              </NavLink>

              <NavLink to="/stats" active={isActive('/stats')}>
                <BarChart2 size={15} />
                <span className="hidden sm:inline">Stats</span>
              </NavLink>

              <NavLink to={`/profile/${user?.username}`} active={location.pathname.startsWith('/profile')}>
                <User size={15} />
                <span className="hidden sm:inline">{user?.displayName ?? user?.username}</span>
              </NavLink>

              <button
                onClick={handleLogout}
                title="Sair"
                className="ml-1 flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" active={isActive('/login')}>
                Entrar
              </NavLink>
              <Link
                to="/register"
                className="ml-1 rounded-md bg-accent px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
              >
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

function NavLink({
  to,
  active,
  children,
}: {
  to: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors',
        active
          ? 'bg-zinc-800 text-zinc-100'
          : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200',
      )}
    >
      {children}
    </Link>
  )
}
