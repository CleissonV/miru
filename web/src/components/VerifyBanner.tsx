import { useState } from 'react'
import { Mail } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { resendVerification } from '@/api/auth'
import { useT } from '@/i18n/translations'

export default function VerifyBanner() {
  const { isAuthenticated, user } = useAuthStore()
  const [sent, setSent] = useState(false)
  const t = useT()

  const mutation = useMutation({
    mutationFn: resendVerification,
    onSuccess: () => setSent(true),
  })

  if (!isAuthenticated || !user || user.emailVerified) return null

  return (
    <div className="flex items-center justify-between gap-3 border-b border-yellow-500/20 bg-yellow-500/10 px-6 py-2.5 text-sm">
      <div className="flex items-center gap-2 text-yellow-200">
        <Mail size={15} className="shrink-0" />
        <span>{t('verify_banner_text')}</span>
      </div>
      {sent ? (
        <span className="shrink-0 text-xs font-medium text-green-400">{t('verify_banner_sent')}</span>
      ) : (
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="shrink-0 rounded-lg bg-yellow-500/20 px-3 py-1 text-xs font-semibold text-yellow-200 transition-colors hover:bg-yellow-500/30 disabled:opacity-50"
        >
          {t('verify_banner_resend')}
        </button>
      )}
    </div>
  )
}
