'use client'

import React, { createContext, useContext, ReactNode } from 'react'

type SimpleUser = {
  email: string | null
}

interface AuthContextType {
  user: SimpleUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const noop = async () => {}

  const value: AuthContextType = {
    user: null,
    loading: false,
    signIn: noop,
    signUp: noop,
    signInWithGoogle: noop,
    resetPassword: noop,
    signOut: noop,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
