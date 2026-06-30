import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Tv } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { resetPassword } from '@/api/auth'
import { useT } from '@/i18n/translations'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const t = useT()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      setTimeout(() => navigate('/login'), 1800)
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutation.mutate({ email, code, newPassword })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-brand-pink/15 blur-3xl" />
        <div className="absolute bottom-0 -left-20 h-64 w-64 rounded-full bg-brand-blue/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-purple-pink shadow-glow">
            <Tv size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text">{t('reset_password_title')}</h1>
          <p className="mt-1 text-sm text-text-muted">{t('reset_password_subtitle')}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          {mutation.isSuccess ? (
            <p className="rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2.5 text-sm text-green-400">
              {t('reset_password_success')}
            </p>
          ) : (
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
                <label className="mb-1.5 block text-sm font-medium text-text">{t('reset_password_code_placeholder')}</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-center text-lg font-bold tracking-[0.5em] text-text placeholder-text-muted outline-none transition-colors focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-text">{t('reset_password_new_placeholder')}</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                  className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder-text-muted outline-none transition-colors focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50"
                />
              </div>

              {mutation.error && (
                <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-400 border border-red-500/20">
                  {(mutation.error as any)?.response?.data?.error ?? 'Erro ao redefinir senha.'}
                </p>
              )}

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full rounded-xl bg-gradient-purple-pink py-2.5 text-sm font-semibold text-white shadow-glow transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('reset_password_submit')}
              </button>
            </form>
          )}
        </div>

        <p className="mt-5 text-center text-sm text-text-muted">
          <Link to="/login" className="font-semibold text-brand-purple hover:underline">
            {t('reset_password_back_to_login')}
          </Link>
        </p>
      </div>
    </div>
  )
}
