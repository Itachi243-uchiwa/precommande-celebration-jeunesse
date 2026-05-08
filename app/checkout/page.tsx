'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartProvider'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, itemCount, removeItem, updateQuantity } = useCart()
  const [mounted, setMounted] = useState(false)
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => { setMounted(true) }, [])

  // Pre-fill if returning from summary
  useEffect(() => {
    if (!mounted) return
    try {
      const saved = sessionStorage.getItem('cj_checkout')
      if (saved) {
        const data = JSON.parse(saved)
        setNom(data.nom ?? '')
        setPrenom(data.prenom ?? '')
        setEmail(data.email ?? '')
        setTelephone(data.telephone ?? '')
      }
    } catch {}
  }, [mounted])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center gap-6 px-4">
        <div className="glass-card rounded-3xl p-12 text-center max-w-sm border border-white/10">
          <div className="text-5xl mb-5">🛒</div>
          <h2 className="text-xl font-bold text-white mb-2">Panier vide</h2>
          <p className="text-white/50 text-sm mb-6">Ajoutez d'abord un t-shirt à votre panier.</p>
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-105"
          >
            Voir la boutique
          </Link>
        </div>
      </div>
    )
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!prenom.trim()) e.prenom = 'Requis'
    if (!nom.trim()) e.nom = 'Requis'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Adresse e-mail invalide'
    if (!telephone.trim() || !/^\+?[\d\s\-()]{7,}$/.test(telephone)) e.telephone = 'Numéro invalide'
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    sessionStorage.setItem('cj_checkout', JSON.stringify({ nom: nom.trim(), prenom: prenom.trim(), email: email.trim(), telephone: telephone.trim() }))
    router.push('/recapitulatif')
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 glass-card border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/boutique" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            Boutique
          </Link>
          <span className="text-sm font-semibold text-white/60">Vos informations</span>
          <div className="w-20" />
        </div>
      </nav>

      {/* Steps indicator */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center gap-2 text-xs">
          {[
            { label: 'Boutique', done: true },
            { label: 'Informations', active: true },
            { label: 'Récapitulatif', done: false },
            { label: 'Confirmation', done: false },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              {i > 0 && <div className="w-6 h-px bg-white/10" />}
              <span className={`font-medium ${step.active ? 'text-orange-400' : step.done ? 'text-white/50' : 'text-white/20'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* ─── Form ─── */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/8">
          <h1 className="text-2xl font-bold text-white mb-6">Vos informations</h1>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid sm:grid-cols-2 gap-5">
              {/* Prénom */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-widest">Prénom *</label>
                <input
                  type="text"
                  value={prenom}
                  onChange={e => { setPrenom(e.target.value); setErrors(err => ({ ...err, prenom: '' })) }}
                  placeholder="Jean"
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-orange-500/60 focus:bg-white/8 transition-all ${errors.prenom ? 'border-red-500/60' : 'border-white/10'}`}
                />
                {errors.prenom && <p className="text-xs text-red-400">{errors.prenom}</p>}
              </div>

              {/* Nom */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-widest">Nom *</label>
                <input
                  type="text"
                  value={nom}
                  onChange={e => { setNom(e.target.value); setErrors(err => ({ ...err, nom: '' })) }}
                  placeholder="Dupont"
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-orange-500/60 focus:bg-white/8 transition-all ${errors.nom ? 'border-red-500/60' : 'border-white/10'}`}
                />
                {errors.nom && <p className="text-xs text-red-400">{errors.nom}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-widest">Adresse e-mail *</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(err => ({ ...err, email: '' })) }}
                placeholder="jean.dupont@email.com"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-orange-500/60 focus:bg-white/8 transition-all ${errors.email ? 'border-red-500/60' : 'border-white/10'}`}
              />
              {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
            </div>

            {/* Téléphone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-widest">Numéro de téléphone *</label>
              <input
                type="tel"
                value={telephone}
                onChange={e => { setTelephone(e.target.value); setErrors(err => ({ ...err, telephone: '' })) }}
                placeholder="+32 470 00 00 00"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-orange-500/60 focus:bg-white/8 transition-all ${errors.telephone ? 'border-red-500/60' : 'border-white/10'}`}
              />
              {errors.telephone && <p className="text-xs text-red-400">{errors.telephone}</p>}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] animate-glow-orange mt-2 text-base"
            >
              Continuer vers le récapitulatif
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </button>
          </form>
        </div>

        {/* ─── Cart summary ─── */}
        <div className="glass-card rounded-3xl p-6 border border-white/8 space-y-4">
          <h2 className="text-sm font-bold text-white/70 uppercase tracking-widest">Récapitulatif du panier</h2>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                  <Image
                    src={`/t-shirt-${item.couleur}.jpeg`}
                    alt={`T-shirt ${item.couleur}`}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white">T-shirt Célébration</p>
                  <p className="text-xs text-white/40 capitalize">{item.couleur} · {item.taille}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button onClick={() => updateQuantity(idx, -1)} className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-white text-xs hover:bg-orange-500/30 transition-colors">−</button>
                    <span className="text-xs text-white">{item.quantite}</span>
                    <button onClick={() => updateQuantity(idx, 1)} className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-white text-xs hover:bg-orange-500/30 transition-colors">+</button>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-orange-400">{item.quantite * item.prixUnitaire} €</p>
                  <button onClick={() => removeItem(idx)} className="text-white/20 hover:text-red-400 transition-colors mt-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">{itemCount} article{itemCount > 1 ? 's' : ''}</span>
              <span className="font-bold text-white text-lg">{total} €</span>
            </div>
            <p className="text-xs text-white/30">Paiement par virement bancaire après confirmation</p>
          </div>
        </div>
      </main>
    </div>
  )
}
