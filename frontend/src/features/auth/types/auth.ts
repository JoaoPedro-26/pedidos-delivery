export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface AuthResponse {
  accessToken: string
  tokenType: string
  user: AuthUser
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}
