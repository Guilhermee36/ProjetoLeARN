'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function RecuperarSenhaPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleRecuperar(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/atualizar-senha`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-700">LeARN</CardTitle>
          <CardDescription>Recuperação de senha</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-5xl">📬</div>
              <p className="text-slate-700 font-medium">E-mail enviado!</p>
              <p className="text-sm text-slate-500">
                Verifique sua caixa de entrada e siga o link para redefinir sua senha.
              </p>
              <a href="/login" className="text-blue-600 hover:underline text-sm">
                Voltar ao login
              </a>
            </div>
          ) : (
            <form onSubmit={handleRecuperar} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Seu e-mail institucional</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.edu.br"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <p> className="text-sm text-red-500"{error}</p>}
              <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar link de recuperação'}
              </Button>
              <p className="text-center text-sm">
                <a href="/login" className="text-blue-600 hover:underline">
                  Voltar ao login
                </a>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}