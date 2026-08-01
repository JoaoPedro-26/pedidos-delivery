import { apiRequest } from '@/shared/api/httpClient'
import type { AuthResponse, LoginInput, RegisterInput } from '../types/auth'
import { tokenStorage } from './tokenStorage'

export const authService = {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    })

    tokenStorage.setToken(response.accessToken)
    tokenStorage.setUser(response.user)
    return response
  },

  async login(input: LoginInput): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    })

    tokenStorage.setToken(response.accessToken)
    tokenStorage.setUser(response.user)
    return response
  },

  logout(): void {
    tokenStorage.clear()
  },
}
