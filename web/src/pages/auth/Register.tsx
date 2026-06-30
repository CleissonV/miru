import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tv } from 'lucide-react'
import { useRegister } from '@/hooks/useAuth'

const INPUT_CLASS =
  'w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder-text-muted outline-none transition-colors focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50'

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    username: '',
    displayName: '',
    password: '',
  })

  const register = useRegister()

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    register.mutate(form)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-brand-pink/15 blur-3xl" />
        <div className="absolute bottom-0 -left-20 h-64 w-64 rounded-full bg-brand-blue/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-purple-pink shadow-glow">
            <Tv size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text">Criar conta</h1>
          <p className="mt-1 text-sm text-text-muted">Grátis, para sempre</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="voce@email.com"
                required
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">Username</label>
              <p className="mb-1.5 text-xs text-text-muted">Letras, números e _ — aparece no seu perfil</p>
              <input
                type="text"
                value={form.username}
                onChange={set('username')}
                placeholder="seu_username"
                minLength={3}
                maxLength={24}
                pattern="^[a-zA-Z0-9_]+$"
                required
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">
                Nome de exibição{' '}
                <span className="text-text-muted font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={form.displayName}
                onChange={set('displayName')}
                placeholder="Seu nome"
                maxLength={50}
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">Senha</label>
              <input
                type="password"
                value={form.password}
                onChange={set('password')}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
                className={INPUT_CLASS}
              />
            </div>

            {register.error && (
              <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {(register.error as any)?.response?.data?.error ?? 'Erro ao criar conta.'}
              </p>
            )}

            <button
              type="submit"
              disabled={register.isPending}
              className="w-full rounded-xl bg-gradient-purple-pink py-2.5 text-sm font-semibold text-white shadow-glow transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {register.isPending ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-text-muted">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-semibold text-brand-purple hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
