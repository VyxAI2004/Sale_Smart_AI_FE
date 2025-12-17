import type { TLoginResponse } from '@/types/auth.type'

export const setAccessTokenToLocalStorage = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken)
}

export const setTokenResponseToLocalStorage = (
  tokenResponse: TLoginResponse
) => {
  localStorage.setItem('accessToken', tokenResponse.access_token)
  localStorage.setItem('refreshToken', tokenResponse.refresh_token)
  localStorage.setItem('expiresIn', tokenResponse.expires_in.toString())
  localStorage.setItem('tokenType', tokenResponse.token_type)
}

export const getTokenResponseFromLocalStorage = (): TLoginResponse | null => {
  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')
  const expiresIn = localStorage.getItem('expiresIn')
  const tokenType = localStorage.getItem('tokenType')

  if (!accessToken || !refreshToken || !expiresIn || !tokenType) {
    return null
  }

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: parseInt(expiresIn, 10),
    token_type: tokenType,
  }
}

export const removeAccessTokenFromLocalStorage = () => {
  localStorage.removeItem('accessToken')
}

export const removeAllTokensFromLocalStorage = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('expiresIn')
  localStorage.removeItem('tokenType')
}

export const getAccessTokenFromLocalStorage = () =>
  localStorage.getItem('accessToken')

export const getRefreshTokenFromLocalStorage = () =>
  localStorage.getItem('refreshToken')
