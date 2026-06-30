import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import * as authApi from '../api/auth'

export function useAuth() {
  return useAuthStore()
}

export function useLogin() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ user, accessToken, refreshToken }) => {
      setAuth(user, accessToken, refreshToken)
      navigate('/')
    },
  })
}

export function useRegister() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: ({ user, accessToken, refreshToken }) => {
      setAuth(user, accessToken, refreshToken)
      navigate('/')
    },
  })
}
