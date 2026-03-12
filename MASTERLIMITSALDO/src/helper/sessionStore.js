import { defineStore } from 'pinia'

const SESSION_STORAGE_KEY = 'mpm_va_session'

export const useSessionStore = defineStore('session', {
  state: () => ({
    sessionData: {}
  }),
  actions: {
    setSession(data) {
      this.sessionData = data
      // Persist to sessionStorage
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data))
      } catch (e) {
        console.warn('Failed to save session to sessionStorage:', e)
      }
    },
    loadFromStorage() {
      try {
        const stored = sessionStorage.getItem(SESSION_STORAGE_KEY)
        if (stored) {
          this.sessionData = JSON.parse(stored)
          return true
        }
      } catch (e) {
        console.warn('Failed to load session from sessionStorage:', e)
      }
      return false
    },
    clearSession() {
      this.sessionData = {}
      try {
        sessionStorage.removeItem(SESSION_STORAGE_KEY)
      } catch (e) {
        console.warn('Failed to clear session from sessionStorage:', e)
      }
    }
  }
})