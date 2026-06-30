import { useEffect, useRef, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle2, XCircle, Loader2, Tv } from 'lucide-react'
import { verifyEmail } from '@/api/auth'
import { useT } from '@/i18n/translations'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const t = useT()
  const calledRef = useRef(false)

  useEffect(() => {
    if (calledRef.current) return
    calledRef.current = true

    if (!token) {
      setStatus('error')
      return
    }
    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-purple-pink shadow-glow">
          <Tv size={22} className="text-white" />
        </div>

        {status === 'loading' && (
          <>
            <Loader2 size={32} className="mx-auto mb-4 animate-spin text-brand-purple" />
            <p className="text-text-muted">{t('verify_email_title')}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 size={40} className="mx-auto mb-4 text-green-400" />
            <p className="mb-6 text-text">{t('verify_email_success')}</p>
            <Link
              to="/login"
              className="inline-block rounded-xl bg-gradient-purple-pink px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition-opacity hover:opacity-90"
            >
              Ir para o login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle size={40} className="mx-auto mb-4 text-red-400" />
            <p className="mb-6 text-text">{t('verify_email_error')}</p>
            <Link
              to="/"
              className="inline-block rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-2"
            >
              {t('verify_email_go_home')}
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
