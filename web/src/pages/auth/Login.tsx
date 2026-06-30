import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Tv } from 'lucide-react'
import { useLogin } from '@/hooks/useAuth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const login = useLogin()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    login.mutate({ email, password })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-brand-purple/15 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-brand-pink/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-purple-pink shadow-glow">
            <Tv size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text">Entrar no Miru</h1>
          <p className="mt-1 text-sm text-text-muted">Bem-vindo de volta</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="voce@email.com"
                required
                className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder-text-muted outline-none transition-colors focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-sm font-medium text-text">Senha</label>
                <Link to="/forgot-password" className="text-xs font-medium text-brand-purple hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 pr-10 text-sm text-text placeholder-text-muted outline-none transition-colors focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {login.error && (
              <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-400 border border-red-500/20">
                {(login.error as any)?.response?.data?.error ?? 'Erro ao entrar. Tente novamente.'}
              </p>
            )}

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full rounded-xl bg-gradient-purple-pink py-2.5 text-sm font-semibold text-white shadow-glow transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {login.isPending ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-text-muted">
          Não tem uma conta?{' '}
          <Link to="/register" className="font-semibold text-brand-purple hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}
