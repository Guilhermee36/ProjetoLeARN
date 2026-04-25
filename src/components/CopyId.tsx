'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CopyId({ id, label }: { id: string; label: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-mono text-slate-600 truncate mt-0.5">{id}</p>
      </div>
      <button onClick={copy}
        className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium shrink-0 transition-colors">
        {copied ? <><Check size={13} /> Copiado!</> : <><Copy size={13} /> Copiar</>}
      </button>
    </div>
  )
}