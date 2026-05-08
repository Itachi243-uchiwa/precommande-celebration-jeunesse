'use client'

import { useActionState } from 'react'
import Image from 'next/image'
import { adminLogin } from '@/app/actions'

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(adminLogin, null)

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4">
      <div className="glass-card rounded-3xl p-8 w-full max-w-sm border border-white/8 space-y-6 animate-slide-up">
        <div className="text-center space-y-3">
          <div className="rounded-xl p-2">
            <Image
                src="/NEW logo compassion bruxelles.png"
                alt="La Compassion Bruxelles"
                width={150}
                height={80}
                className="h-20 sm:h-28 w-auto object-contain drop-shadow-2xl"
                priority
            />
          </div>
          <h1 className="text-xl font-bold text-white">Back-office</h1>
          <p className="text-sm text-white/40">Célébration Jeunesse · Administrateur</p>
        </div>

        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-3 text-red-400 text-sm text-center">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-widest">Mot de passe</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-orange-500/60 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02]"
          >
            {pending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : 'Accéder au back-office'}
          </button>
        </form>
      </div>
    </div>
  )
}
