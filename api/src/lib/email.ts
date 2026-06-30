import { Resend } from 'resend'
import { env } from '../config/env'

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null

export async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {
    const link = html.match(/href="([^"]+)"/)?.[1]
    console.log(`\n[Email — RESEND_API_KEY não configurada, exibindo no console]`)
    console.log(`Para: ${to}`)
    console.log(`Assunto: ${subject}`)
    if (link) console.log(`Link: ${link}`)
    console.log(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
    console.log('')
    return
  }

  await resend.emails.send({ from: env.EMAIL_FROM, to, subject, html })
}

export function verificationEmailHtml(verifyUrl: string) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #818cf8;">見 Miru</h2>
      <p>Confirme seu e-mail para ativar sua conta:</p>
      <a href="${verifyUrl}" style="display:inline-block; background:#818cf8; color:#fff; padding:12px 24px; border-radius:10px; text-decoration:none; font-weight:600;">
        Confirmar e-mail
      </a>
      <p style="color:#888; font-size:13px; margin-top:24px;">Se você não criou uma conta no Miru, ignore este e-mail.</p>
    </div>
  `
}

export function resetPasswordEmailHtml(code: string) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #818cf8;">見 Miru</h2>
      <p>Use o código abaixo para redefinir sua senha. Ele expira em 15 minutos.</p>
      <p style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #818cf8;">${code}</p>
      <p style="color:#888; font-size:13px; margin-top:24px;">Se você não solicitou isso, ignore este e-mail.</p>
    </div>
  `
}
