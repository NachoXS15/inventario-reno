'use client'

import { logout } from '../actions-auth'

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      >
        Cerrar sesión
      </button>
    </form>
  )
}
