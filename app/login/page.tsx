'use client'

import { useActionState } from 'react'
import Image from 'next/image'
import logo from '../../assets/logo.png'
import { login } from '../actions-auth'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null)

  return (
    <div className="min-h-screen bg-zinc-50 font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#912ac8]">
            <Image src={logo} alt="" width={50} />
          </div>
          <h1 className="text-2xl font-semibold text-zinc-900">Inventario de Oficina</h1>
          <p className="mt-1 text-sm text-zinc-500">Ingresá para continuar</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <form action={action} className="space-y-4">
            {state?.error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {state.error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-700">Email</label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="tu@email.com"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#912ac8] focus:outline-none focus:ring-2 focus:ring-[#912ac8]/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-700">Contraseña</label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#912ac8] focus:outline-none focus:ring-2 focus:ring-[#912ac8]/20"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="mt-2 w-full rounded-lg bg-[#912ac8] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#7a23ab] disabled:opacity-50"
            >
              {pending ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
