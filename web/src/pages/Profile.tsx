import { useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Globe, Pencil, Check, X, Camera, KeyRound, Loader2,
  Eye, CheckCircle2, Clock, PauseCircle, XCircle, Star, Film,
} from 'lucide-react'
import { api } from '@/api/client'
import { getMediaDetail } from '@/api/media'
import { changePassword, uploadAvatar } from '@/api/users'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { getInitials, cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { STATUS_COLOR, type Entry, type Language, type WatchStatus } from '@/types'
import { useT, useStatusLabel, useMediaLabel } from '@/i18n/translations'
import { FlagBR, FlagUS } from '@/components/ui/Flag'

const STATUS_ICON: Record<WatchStatus, React.ElementType> = {
  WATCHING: Eye,
  COMPLETED: CheckCircle2,
  PLAN_TO_WATCH: Clock,
  ON_HOLD: PauseCircle,
  DROPPED: XCircle,
}

const STATUS_ICON_BG: Record<WatchStatus, string> = {
  WATCHING: 'bg-brand-purple/15 text-brand-purple',
  COMPLETED: 'bg-green-500/15 text-green-400',
  PLAN_TO_WATCH: 'bg-brand-blue/15 text-brand-blue',
  ON_HOLD: 'bg-yellow-500/15 text-yellow-400',
  DROPPED: 'bg-red-500/15 text-red-400',
}

export default function Profile() {
  const { username = '' } = useParams()
  const { user: loggedUser, setUser } = useAuthStore()
  const isOwnProfile = loggedUser?.username === username
  const qc = useQueryClient()
  const t = useT()
  const STATUS_LABEL = useStatusLabel()

  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const invalidateMediaQueries = () => {
    qc.invalidateQueries({ queryKey: ['trending'] })
    qc.invalidateQueries({ queryKey: ['media'] })
    qc.invalidateQueries({ queryKey: ['search'] })
  }

  const updateLanguage = useMutation({
    mutationFn: async (language: Language) => {
      const res = await api.patch('/users/me', { language })
      return res.data
    },
    onSuccess: (updated) => {
      setUser(updated)
      invalidateMediaQueries()
    },
  })

  const updateName = useMutation({
    mutationFn: async (displayName: string) => {
      const res = await api.patch('/users/me', { displayName })
      return res.data
    },
    onSuccess: (updated) => {
      setUser(updated)
      qc.invalidateQueries({ queryKey: ['profile', username] })
      setEditingName(false)
    },
  })

  const avatarMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (updated) => {
      setUser(updated)
      qc.invalidateQueries({ queryKey: ['profile', username] })
    },
  })

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setPasswordMsg({ type: 'ok', text: t('profile_password_changed') })
      setCurrentPassword('')
      setNewPassword('')
    },
    onError: (err: any) => {
      setPasswordMsg({ type: 'err', text: err?.response?.data?.error ?? 'Erro' })
    },
  })

  function handleAvatarClick() {
    fileInputRef.current?.click()
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) avatarMutation.mutate(file)
    e.target.value = ''
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPasswordMsg(null)
    passwordMutation.mutate({ currentPassword, newPassword })
  }

  const { data: profile, isLoading: loadingProfile, error } = useQuery({
    queryKey: ['profile', username],
    queryFn: async () => {
      const res = await api.get(`/users/${username}`)
      return res.data
    },
    enabled: !!username,
  })

  const { data: entries } = useQuery<Entry[]>({
    queryKey: ['profile-entries', username],
    queryFn: async () => {
      const res = await api.get(`/users/${username}/entries`)
      return res.data
    },
    enabled: !!username,
  })

  if (loadingProfile) return <ProfileSkeleton />

  if (error) {
    return (
      <div className="px-8 py-24 text-center">
        <p className="text-text-muted">{t('profile_not_found')}</p>
      </div>
    )
  }

  const byStatus = entries?.reduce(
    (acc, e) => ({ ...acc, [e.status]: (acc[e.status] ?? 0) + 1 }),
    {} as Record<string, number>,
  )

  return (
    <main className="pb-16">
      {/* Hero banner — drop an image at web/public/profile-banner.png to customize */}
      <div
        className="relative h-36 overflow-hidden bg-surface bg-cover bg-center sm:h-44"
        style={{ backgroundImage: "url('/profile-banner.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
      </div>

      <div className="mx-auto max-w-5xl px-8">
        {/* Avatar — overlaps the banner on its own, name block stays clear of it */}
        <div className="relative -mt-12 h-24 w-24 shrink-0">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-bg bg-gradient-purple-pink text-2xl font-bold text-white shadow-glow">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.username}
                className="h-full w-full object-cover"
              />
            ) : (
              getInitials(profile.displayName ?? profile.username)
            )}
          </div>
          <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-bg bg-green-400" />

          {isOwnProfile && (
            <>
              <button
                onClick={handleAvatarClick}
                disabled={avatarMutation.isPending}
                title={t('profile_change_avatar')}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 text-white opacity-0 transition-opacity hover:bg-black/50 hover:opacity-100"
              >
                {avatarMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </>
          )}
        </div>

        {/* Header */}
        <div className="mt-4">
          {isOwnProfile && editingName ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                maxLength={50}
                className="rounded-lg border border-border bg-surface-2 px-2.5 py-1 text-xl font-bold text-text outline-none focus:border-brand-purple"
              />
              <button
                onClick={() => nameInput.trim() && updateName.mutate(nameInput.trim())}
                disabled={updateName.isPending}
                className="rounded-lg bg-green-500/15 p-1.5 text-green-400 hover:bg-green-500/25"
              >
                <Check size={15} />
              </button>
              <button
                onClick={() => setEditingName(false)}
                className="rounded-lg bg-surface-2 p-1.5 text-text-muted hover:bg-surface-3"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <h1 className="group flex items-center gap-2 text-2xl font-bold text-text">
              {profile.displayName ?? profile.username}
              {isOwnProfile && (
                <button
                  onClick={() => {
                    setNameInput(profile.displayName ?? profile.username)
                    setEditingName(true)
                  }}
                  className="text-text-subtle opacity-0 transition-opacity hover:text-brand-purple group-hover:opacity-100"
                  title={t('profile_edit_name')}
                >
                  <Pencil size={14} />
                </button>
              )}
            </h1>
          )}
          <p className="text-sm text-text-muted">@{profile.username}</p>
          {isOwnProfile && loggedUser?.email && (
            <p className="mt-0.5 text-xs text-text-subtle">{loggedUser.email}</p>
          )}
        </div>

        {profile.bio && (
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-muted">{profile.bio}</p>
        )}
        <p className="mt-3 text-xs text-text-subtle">
          {t('profile_member_since')}{' '}
          {new Date(profile.createdAt).toLocaleDateString(loggedUser?.language === 'en' ? 'en-US' : 'pt-BR', {
            month: 'long',
            year: 'numeric',
          })}
        </p>

        {/* Content grid */}
        <div className={cn('mt-10 grid gap-8', isOwnProfile ? 'lg:grid-cols-[1fr_300px]' : 'lg:grid-cols-1')}>
          {/* Main column */}
          <div className="min-w-0 space-y-10">
            {/* Status breakdown */}
            {byStatus && Object.keys(byStatus).length > 0 && (
              <div>
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-muted">
                  {t('profile_summary')}
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {(Object.entries(byStatus) as [WatchStatus, number][]).map(([status, count]) => {
                    const Icon = STATUS_ICON[status]
                    return (
                      <div
                        key={status}
                        className="rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-brand-purple/30"
                      >
                        <div className={cn('mb-3 flex h-8 w-8 items-center justify-center rounded-lg', STATUS_ICON_BG[status])}>
                          <Icon size={16} />
                        </div>
                        <p className="text-2xl font-bold text-text">{count}</p>
                        <p className="mt-0.5 truncate text-xs text-text-muted">{STATUS_LABEL[status]}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Recent activity */}
            {entries && entries.length > 0 ? (
              <section>
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-muted">
                  {t('profile_recent_activity')}
                </h2>
                <div className="space-y-2">
                  {entries.slice(0, 20).map(entry => (
                    <ActivityRow key={entry.id} entry={entry} />
                  ))}
                </div>
              </section>
            ) : (
              <div className="rounded-2xl border border-dashed border-border py-14 text-center">
                <Film size={28} className="mx-auto mb-3 text-text-subtle" />
                <p className="text-sm text-text-muted">Nenhuma atividade ainda</p>
              </div>
            )}
          </div>

          {/* Sidebar — account settings (own profile only) */}
          {isOwnProfile && (
            <aside className="space-y-4">
              <div className="rounded-2xl border border-border bg-surface p-4">
                <div className="mb-2.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                  <Globe size={12} />
                  {t('profile_language_label')}
                </div>
                <div className="flex gap-2">
                  {([
                    { value: 'pt-BR', Flag: FlagBR, label: 'Português' },
                    { value: 'en', Flag: FlagUS, label: 'English' },
                  ] as { value: Language; Flag: typeof FlagBR; label: string }[]).map(({ value, Flag, label }) => (
                    <button
                      key={value}
                      onClick={() => updateLanguage.mutate(value)}
                      disabled={updateLanguage.isPending}
                      title={label}
                      aria-label={label}
                      className={cn(
                        'flex items-center justify-center rounded-xl px-4 py-2.5 transition-all',
                        (loggedUser?.language ?? 'pt-BR') === value
                          ? 'bg-gradient-purple-pink shadow-glow'
                          : 'border border-border bg-surface-2 hover:bg-surface-3',
                      )}
                    >
                      <Flag size={22} />
                    </button>
                  ))}
                </div>
                <p className="mt-2.5 text-xs text-text-subtle">
                  {t('profile_language_hint')}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-4">
                <button
                  onClick={() => setShowPasswordForm(v => !v)}
                  className="flex w-full items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted"
                >
                  <KeyRound size={12} />
                  {t('profile_change_password')}
                </button>

                {showPasswordForm && (
                  <form onSubmit={handlePasswordSubmit} className="mt-3 space-y-2.5">
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      placeholder={t('profile_current_password')}
                      required
                      className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm text-text placeholder-text-muted outline-none transition-colors focus:border-brand-purple"
                    />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder={t('profile_new_password')}
                      minLength={6}
                      required
                      className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm text-text placeholder-text-muted outline-none transition-colors focus:border-brand-purple"
                    />
                    {passwordMsg && (
                      <p className={cn('text-xs', passwordMsg.type === 'ok' ? 'text-green-400' : 'text-red-400')}>
                        {passwordMsg.text}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={passwordMutation.isPending}
                      className="w-full rounded-xl bg-gradient-purple-pink px-4 py-2 text-sm font-semibold text-white shadow-glow transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {t('profile_save')}
                    </button>
                  </form>
                )}
              </div>
            </aside>
          )}
        </div>
      </div>
    </main>
  )
}

function ActivityRow({ entry }: { entry: Entry }) {
  const STATUS_LABEL = useStatusLabel()
  const MEDIA_LABEL = useMediaLabel()

  const { data: media } = useQuery({
    queryKey: ['media', entry.mediaType.toLowerCase(), entry.externalId],
    queryFn: () => getMediaDetail(entry.mediaType.toLowerCase(), entry.externalId),
    staleTime: 1000 * 60 * 60,
  })

  return (
    <Link
      to={`/media/${entry.mediaType.toLowerCase()}/${entry.externalId}`}
      className="flex items-center gap-3.5 rounded-2xl border border-border bg-surface p-3 transition-colors hover:bg-surface-2 hover:border-brand-purple/30"
    >
      <div className="h-16 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-2">
        {media?.poster ? (
          <img src={media.poster} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-text-subtle">見</div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text">
          {media?.title ?? `#${entry.externalId}`}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <Badge>{MEDIA_LABEL[entry.mediaType]}</Badge>
          <span className={cn('text-xs font-medium', STATUS_COLOR[entry.status])}>
            {STATUS_LABEL[entry.status]}
          </span>
        </div>
      </div>

      {entry.rating && (
        <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-yellow-400">
          <Star size={12} fill="currentColor" />
          {entry.rating}
        </span>
      )}
    </Link>
  )
}

function ProfileSkeleton() {
  return (
    <main className="pb-16">
      <Skeleton className="h-36 w-full rounded-none sm:h-44" />
      <div className="px-8">
        <div className="-mt-12 flex items-end gap-6">
          <Skeleton className="h-24 w-24 shrink-0 rounded-full border-4 border-bg" />
          <div className="space-y-2.5 pb-1">
            <Skeleton className="h-7 w-40 rounded-xl" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <div className="mt-10 space-y-2">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-[72px] rounded-2xl" />)}
        </div>
      </div>
    </main>
  )
}
