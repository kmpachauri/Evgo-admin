import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import useAuth from './useAuth'
import useToastHandler from './useToastHandler'

const isDev = import.meta.env.DEV

export const loginUrl =
  import.meta.env.VITE_LOGIN_URL || 'https://dhantag.com'

export const baseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (isDev ? 'http://localhost:5000' : 'https://node.evgo.site')

export const imgBaseUrl =
  import.meta.env.VITE_IMAGE_BASE_URL || baseUrl

const useAxios = (initialConfig = {}, options = {}) => {
  const { showToast } = useToastHandler()
  const { manual = true } = options
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      key: '5TIvw5cpc0',
    },
  })

  const fetchData = useCallback(
    async ({
      url,
      method = 'GET',
      data: bodyData,
      headers = {},
      showloader = true,
      toast = true,
    } = {}) => {
      setLoading(true)
      setError(null)

      try {
        const response = await axiosInstance({
          ...initialConfig,
          url: url || initialConfig.url,
          method: method || initialConfig.method,
          data: bodyData || initialConfig.data,
          headers: { ...initialConfig.headers, ...headers },
        })

        console.log(response.data)
        const message =
          response.data.message || response.data.msg || response.data.error || 'Success'

        setData(response.data)
        return response.data
      } catch (err) {
        console.error(err)

        // ✅ Handle 401 Unauthorized (token expired)
        if (err.response && err.response.status === 401) {
          console.warn('Session expired. Redirecting to login...')

          // Clear all auth data
          localStorage.removeItem('secureKeytoken')
          localStorage.removeItem('SecureKeyLogged')
          localStorage.removeItem('secureKeyuser')
          localStorage.removeItem('AccessRole')
          localStorage.removeItem('adminAsUser')
          localStorage.removeItem('lastPath')

          // Force redirect (prevents back button from returning to protected pages)
          window.location.replace('/login')
          return
        }

        // ✅ Handle other errors normally
        let msg = err.response?.data?.message || err.message || 'An error occurred'
        showToast(msg, 'error')
        setError(msg)
        throw (
          err.response?.data || {
            success: false,
            message: msg,
            error: msg,
          }
        )
      } finally {
        setLoading(false)
      }
    },
    [initialConfig], // Depend only on the initial configuration
  );

  useEffect(() => {
    if (!manual && initialConfig.url) {
      fetchData()
    }
  }, [fetchData, manual])

  return { data, loading, error, fetchData }
}

export default useAxios
