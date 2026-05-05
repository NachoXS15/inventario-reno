import Image from 'next/image'
import logo from '../../assets/logo.png'
import { LogoutButton } from './LogoutButton'

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-[#912ac8] px-4 py-3 sm:px-6 sm:py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-white sm:text-2xl">Inventario de Oficina</h1>
          <p className="mt-0.5 text-xs text-white/80 sm:text-sm">Gestión de elementos y recursos</p>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <LogoutButton />
          <div className="flex h-10 w-10 shrink-0 items-center sm:h-16 sm:w-16">
            <Image src={logo} alt="" width={50} />
          </div>
        </div>
      </div>
    </header>
  )
}
