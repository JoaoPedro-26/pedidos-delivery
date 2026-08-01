import { ApiError, UNAUTHORIZED_EVENT } from './apiError'
import { tokenStorage } from '@/features/auth/services/tokenStorage'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

interface ApiErrorBody {
  message?: string
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const token = tokenStorage.getToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (response.ok) {
    if (response.status === 204) {
      return undefined as T
    }
    return (await response.json()) as T
  }

  const body = (await response.json().catch(() => null)) as ApiErrorBody | null
  const message = body?.message ?? `Erro na requisição (${response.status}).`

  if (response.status === 401) {
    if (token) {
      tokenStorage.clear()
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }
    throw new ApiError(401, message)
  }

  throw new ApiError(response.status, message)
}
