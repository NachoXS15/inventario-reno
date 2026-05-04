'use client'

import { useState } from 'react'
import type { Item, Contact } from '../types'
import { Badge } from './Badge'
import {
  ESTADO,
  UBICACION,
  inputClass,
  today,
  formatDate,
  type InfoFormData,
  type EgresoFormData,
  type DevolucionFormData,
} from './constants'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-zinc-700">{label}</label>
      {children}
    </div>
  )
}

export function Modal({
  item,
  contacts,
  onClose,
  onSaveInfo,
  onRegistrarEgreso,
  onRegistrarDevolucion,
  isPending,
}: {
  item: Item
  contacts: Contact[]
  onClose: () => void
  onSaveInfo: (data: InfoFormData) => void
  onRegistrarEgreso: (data: EgresoFormData) => void
  onRegistrarDevolucion: (data: DevolucionFormData) => void
  isPending: boolean
}) {
  const [activeTab, setActiveTab] = useState<'info' | 'egreso'>('info')
  const [infoForm, setInfoForm] = useState<InfoFormData>({
    nombre: item.nombre,
    categoria: item.categoria,
    descripcion: item.descripcion,
    estado: item.estado,
    ubicacion: item.ubicacion,
  })
  const [egresoForm, setEgresoForm] = useState<EgresoFormData>({
    prestadoA: '',
    fechaEgreso: today(),
    fechaDevolucionEstimada: '',
    motivo: '',
  })
  const [devolucionForm, setDevolucionForm] = useState<DevolucionFormData>({
    fechaDevolucion: today(),
  })
  const [historialOpen, setHistorialOpen] = useState(false)

  const lastEgreso = item.historialEgresos.at(-1)
  const contactoAsignado = lastEgreso
    ? contacts.find((c) => c.nombre === lastEgreso.prestadoA)
    : undefined
  const whatsappUrl = (() => {
    if (!contactoAsignado?.telefono) return null
    const phone = contactoAsignado.telefono.replace(/\D/g, '')
    const msg = encodeURIComponent(
      `¡Hola ${lastEgreso?.prestadoA}! ¿Cómo estás? Te escribimos desde comunicación para consultarte cuándo vas a poder devolver "${item.nombre}".`
    )
    return `https://wa.me/${phone}?text=${msg}`
  })()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl" style={{ maxHeight: '90vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-semibold text-zinc-900">{item.nombre}</h2>
            <div className="mt-2 flex gap-1">
              <button
                onClick={() => setActiveTab('info')}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                  activeTab === 'info'
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                Información
              </button>
              <button
                onClick={() => setActiveTab('egreso')}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                  activeTab === 'egreso'
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                Egreso / Devolución
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5">

          {activeTab === 'info' && (
            <div className="space-y-4">
              <Field label="Nombre">
                <input
                  type="text"
                  value={infoForm.nombre}
                  onChange={(e) => setInfoForm({ ...infoForm, nombre: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Categoría">
                <input
                  type="text"
                  value={infoForm.categoria}
                  onChange={(e) => setInfoForm({ ...infoForm, categoria: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Descripción">
                <textarea
                  value={infoForm.descripcion}
                  onChange={(e) => setInfoForm({ ...infoForm, descripcion: e.target.value })}
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </Field>
              <Field label="Estado">
                <div className="flex items-center gap-3">
                  <Badge config={ESTADO} value={infoForm.estado} />
                  <select
                    value={infoForm.estado}
                    onChange={(e) => setInfoForm({ ...infoForm, estado: e.target.value })}
                    className={`flex-1 ${inputClass}`}
                  >
                    {Object.entries(ESTADO).map(([value, { label }]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </Field>
              <Field label="Ubicación">
                <div className="flex items-center gap-3">
                  <Badge config={UBICACION} value={infoForm.ubicacion} />
                  <select
                    value={infoForm.ubicacion}
                    onChange={(e) => setInfoForm({ ...infoForm, ubicacion: e.target.value })}
                    className={`flex-1 ${inputClass}`}
                  >
                    {Object.entries(UBICACION).map(([value, { label }]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </Field>
            </div>
          )}

          {activeTab === 'egreso' && (
            <div className="space-y-5">

              {!item.prestado && (
                <div className="space-y-4">
                  <p className="text-sm text-zinc-500">Completá los datos para registrar la salida del elemento.</p>
                  <Field label="Prestado a">
                    <select
                      value={egresoForm.prestadoA}
                      onChange={(e) => setEgresoForm({ ...egresoForm, prestadoA: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">Seleccionar contacto…</option>
                      {contacts.map((c) => (
                        <option key={c.id} value={c.nombre}>
                          {c.nombre}{c.telefono ? ` — ${c.telefono}` : ''}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Fecha de egreso">
                    <input
                      type="date"
                      value={egresoForm.fechaEgreso}
                      onChange={(e) => setEgresoForm({ ...egresoForm, fechaEgreso: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Fecha de devolución estimada">
                    <input
                      type="date"
                      value={egresoForm.fechaDevolucionEstimada}
                      onChange={(e) => setEgresoForm({ ...egresoForm, fechaDevolucionEstimada: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Motivo / destino">
                    <textarea
                      placeholder="¿Para qué evento o uso?"
                      value={egresoForm.motivo}
                      onChange={(e) => setEgresoForm({ ...egresoForm, motivo: e.target.value })}
                      rows={2}
                      className={`${inputClass} resize-none`}
                    />
                  </Field>
                </div>
              )}

              {item.prestado && lastEgreso && (
                <div className="space-y-4">
                  {lastEgreso.fechaDevolucionEstimada && lastEgreso.fechaDevolucionEstimada < today() && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex flex-col gap-3 text-sm text-red-800">
                      <div className='flex gap-3'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        <span>La fecha estimada de devolución ya pasó. Contactá a <strong>{lastEgreso.prestadoA}</strong> para coordinar la devolución.</span>
                      </div>
                      {whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-red-900 px-3 py-1.5 w-fit text-red-100 rounded-lg text-xs font-medium hover:bg-red-800 transition-colors"
                        >
                          Enviar mensaje por WhatsApp
                        </a>
                      )}
                    </div>
                  )}
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Tiene</span>
                      <span className="font-medium text-zinc-800">{lastEgreso.prestadoA}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Desde</span>
                      <span className="font-medium text-zinc-800">{formatDate(lastEgreso.fechaEgreso)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Devol. estimada</span>
                      <span className="font-medium text-zinc-800">{formatDate(lastEgreso.fechaDevolucionEstimada)}</span>
                    </div>
                    {lastEgreso.motivo && (
                      <div className="flex justify-between gap-4">
                        <span className="text-zinc-500 shrink-0">Motivo</span>
                        <span className="font-medium text-zinc-800 text-right">{lastEgreso.motivo}</span>
                      </div>
                    )}
                  </div>
                  <Field label="Fecha de devolución real">
                    <input
                      type="date"
                      value={devolucionForm.fechaDevolucion}
                      onChange={(e) => setDevolucionForm({ fechaDevolucion: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                </div>
              )}

              <div className="border-t border-zinc-100 pt-4">
                <button
                  onClick={() => setHistorialOpen(!historialOpen)}
                  className="flex w-full items-center justify-between text-sm font-medium text-zinc-600 hover:text-zinc-900"
                >
                  <span>Historial de egresos ({item.historialEgresos.length})</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform ${historialOpen ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {historialOpen && (
                  <div className="mt-3 space-y-2">
                    {item.historialEgresos.length === 0 ? (
                      <p className="text-sm text-zinc-400">Sin historial de egresos.</p>
                    ) : (
                      [...item.historialEgresos].reverse().map((eg, i) => (
                        <div key={i} className="rounded-lg border border-zinc-200 p-3 text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Prestado a</span>
                            <span className="font-medium text-zinc-800">{eg.prestadoA}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Egreso</span>
                            <span className="font-medium text-zinc-800">{formatDate(eg.fechaEgreso)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Devol. est.</span>
                            <span className="font-medium text-zinc-800">{formatDate(eg.fechaDevolucionEstimada)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Devuelto</span>
                            <span className={`font-medium ${eg.fechaDevolucion ? 'text-green-700' : 'text-amber-600'}`}>
                              {eg.fechaDevolucion ? formatDate(eg.fechaDevolucion) : 'Pendiente'}
                            </span>
                          </div>
                          {eg.motivo && (
                            <div className="flex justify-between gap-4">
                              <span className="text-zinc-500 shrink-0">Motivo</span>
                              <span className="font-medium text-zinc-800 text-right">{eg.motivo}</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-zinc-100 px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Cancelar
          </button>
          {activeTab === 'info' && (
            <button
              onClick={() => onSaveInfo(infoForm)}
              disabled={isPending}
              className="flex-1 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
            >
              {isPending ? 'Guardando…' : 'Guardar cambios'}
            </button>
          )}
          {activeTab === 'egreso' && !item.prestado && (
            <button
              onClick={() => onRegistrarEgreso(egresoForm)}
              disabled={isPending || !egresoForm.prestadoA || !egresoForm.fechaDevolucionEstimada}
              className="flex-1 rounded-lg bg-[#912ac8] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#7a23ab] disabled:opacity-50"
            >
              {isPending ? 'Registrando…' : 'Registrar Egreso'}
            </button>
          )}
          {activeTab === 'egreso' && item.prestado && (
            <button
              onClick={() => onRegistrarDevolucion(devolucionForm)}
              disabled={isPending || !devolucionForm.fechaDevolucion}
              className="flex-1 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-800 disabled:opacity-50"
            >
              {isPending ? 'Registrando…' : 'Registrar Devolución'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
