import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import {
  getAccessTokenFromLocalStorage,
  removeAllTokensFromLocalStorage,
} from './localStorage'

const API_PREFIX = '/api/v1'

// Normalize baseURL to remove trailing slashes
const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL || 'https://b.3aa.uk'
  return url.replace(/\/+$/, '')
}

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
})

function withApiPrefix(url: string) {
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith(API_PREFIX)
  ) {
    return url
  }
  return `${API_PREFIX}${url.startsWith('/') ? '' : '/'}${url}`
}

const http = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(withApiPrefix(url), config),
  post: <T = any>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.post<T>(withApiPrefix(url), data, config),
  put: <T = any>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.put<T>(withApiPrefix(url), data, config),
  patch: <T = any>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.patch<T>(withApiPrefix(url), data, config),
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(withApiPrefix(url), config),
}

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken && config.headers) {
      config.headers.authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error: unknown) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes('/auth/login')
    ) {
      removeAllTokensFromLocalStorage()
      window.location.reload()
    }
    return Promise.reject(error)
  }
)

export default http
