'use client'

import { useState } from 'react'
import type { Contact } from '../types'
import { inputClass } from './constants'

type ContactForm = { nombre: string, telefono: string, categoria: string }
const emptyForm: ContactForm = { nombre: '', telefono: '', categoria: '' }

function contactToForm(c: Contact): ContactForm {
  return { nombre: c.nombre, telefono: c.telefono, categoria: c.categoria ?? '' }
}

function formToData(f: ContactForm): Omit<Contact, 'id'> {
  const data: Omit<Contact, 'id'> = {
    nombre: f.nombre.trim(), categoria: f.categoria.trim(), telefono: f.telefono.trim()
  }
  if (f.telefono.trim()) data.telefono = f.telefono.trim()
  return data
}

export function ContactsTab({
  contacts,
  onAdd,
  onUpdate,
  onDelete,
}: {
  contacts: Contact[]
  onAdd: (data: Omit<Contact, 'id'>) => void
  onUpdate: (id: string, data: Omit<Contact, 'id'>) => void
  onDelete: (id: string) => void
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState<ContactForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<ContactForm>(emptyForm)

  function submitAdd() {
    if (!addForm.nombre.trim()) return
    onAdd(formToData(addForm))
    setAddForm(emptyForm)
    setShowAdd(false)
  }

  function startEdit(c: Contact) {
    setEditingId(c.id)
    setEditForm(contactToForm(c))
  }

  function submitEdit() {
    if (!editingId || !editForm.nombre.trim()) return
    onUpdate(editingId, formToData(editForm))
    setEditingId(null)
  }

  return (
    <div className="space-y-4">
      {showAdd ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-3">
          <p className="text-sm font-medium text-zinc-700">Nuevo contacto</p>
          <input
            type="text"
            placeholder="Nombre *"
            value={addForm.nombre}
            onChange={(e) => setAddForm({ ...addForm, nombre: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && submitAdd()}
            className={inputClass}
            autoFocus
          />
          <input
            type="text"
            placeholder="Teléfono (opcional)"
            value={addForm.telefono}
            onChange={(e) => setAddForm({ ...addForm, telefono: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && submitAdd()}
            className={inputClass}
          />
          <select
            value={addForm.categoria}
            onChange={(e) => setAddForm({ ...addForm, categoria: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && submitAdd()}
            className={inputClass}
          >
            <option value="Comunicación">Comunicación</option>
            <option value="Externo">Externo</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={submitAdd}
              disabled={!addForm.nombre.trim()}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
            >
              Guardar
            </button>
            <button
              onClick={() => { setShowAdd(false); setAddForm(emptyForm) }}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-500 transition-colors hover:border-zinc-400 hover:text-zinc-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Agregar contacto
        </button>
      )}

      {contacts.length === 0 ? (
        <p className="py-16 text-center text-sm text-zinc-400">No hay contactos aún.</p>
      ) : (
        <div className="space-y-2">
          {contacts.map((contact) =>
            editingId === contact.id ? (
              <div key={contact.id} className="rounded-xl border border-[#912ac8]/30 bg-white p-4 space-y-3">
                <input
                  type="text"
                  value={editForm.nombre}
                  onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && submitEdit()}
                  className={inputClass}
                  autoFocus
                />
                <input
                  type="text"
                  placeholder="Teléfono (opcional)"
                  value={editForm.telefono}
                  onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && submitEdit()}
                  className={inputClass}
                />
                <select
                  value={editForm.categoria}
                  onChange={(e) => setAddForm({ ...addForm, categoria: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && submitAdd()}
                  className={inputClass}
                >
                  <option value="Comunicación">Comunicación</option>
                  <option value="Externo">Externo</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={submitEdit}
                    disabled={!editForm.nombre.trim()}
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div key={contact.id} className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-zinc-900">{contact.nombre}</p>
                  {contact.telefono && (
                    <p className="text-xs text-zinc-500 mt-0.5">{contact.telefono} - {contact.categoria}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(contact)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(contact.id)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
