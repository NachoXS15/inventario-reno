import Image from 'next/image'
import logo from '../../assets/logo.png'
import { LogoutButton } from './LogoutButton'

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-[#912ac8] px-6 py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Inventario de Oficina</h1>
          <p className="mt-0.5 text-sm text-white/80">Gestión de elementos y recursos</p>
        </div>
        <div className="flex items-center gap-4">
          <LogoutButton />
          <div className="flex h-16 w-16 shrink-0 items-center">
            <Image src={logo} alt="" width={50} />
          </div>
        </div>
      </div>
    </header>
  )
}
