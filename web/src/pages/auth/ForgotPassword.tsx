import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Tv } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { forgotPassword } from '@/api/auth'
import { useT } from '@/i18n/translations'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const t = useT()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => setSent(true),
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutation.mutate(email)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-brand-purple/15 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-brand-pink/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-purple-pink shadow-glow">
            <Tv size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text">{t('forgot_password_title')}</h1>
          <p className="mt-1 text-sm text-text-muted">{t('forgot_password_subtitle')}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          {sent ? (
            <div className="space-y-4">
              <p className="rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2.5 text-sm text-green-400">
                {t('forgot_password_sent')}
              </p>
              <button
                onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)}
                className="w-full rounded-xl bg-gradient-purple-pink py-2.5 text-sm font-semibold text-white shadow-glow transition-opacity hover:opacity-90"
              >
                {t('forgot_password_continue')}
              </button>
            </div>
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

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full rounded-xl bg-gradient-purple-pink py-2.5 text-sm font-semibold text-white shadow-glow transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('forgot_password_submit')}
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
