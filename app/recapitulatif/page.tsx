'use client'

import { useState, useEffect, useActionState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/CartProvider'
import { submitOrder } from '@/app/actions'
import type { CartItem } from '@/lib/types'

// ⚠️ IMPORTANT : Remplacer par le vrai numéro de compte (demander à Disle)
// Vous pouvez aussi définir la variable d'environnement IBAN dans .env.local
const IBAN = process.env.NEXT_PUBLIC_IBAN ?? 'BE00 0000 0000 0000'
const BANK_HOLDER = process.env.NEXT_PUBLIC_BANK_HOLDER ?? 'Église La Compassion Bruxelles — Média'

function generateOrderId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'CJ-2026-'
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

export default function RecapitulatifPage() {
  const { items, total } = useCart()
  const [mounted, setMounted] = useState(false)
  const [customer, setCustomer] = useState<{ nom: string; prenom: string; email: string; telephone: string } | null>(null)
  const [orderId, setOrderId] = useState('')
  const [copied, setCopied] = useState(false)

  const [state, formAction, pending] = useActionState(submitOrder, null)

  useEffect(() => {
    setMounted(true)
    try {
      const raw = sessionStorage.getItem('cj_checkout')
      if (raw) setCustomer(JSON.parse(raw))
      const existingId = sessionStorage.getItem('cj_order_id')
      if (existingId) {
        setOrderId(existingId)
      } else {
        const newId = generateOrderId()
        sessionStorage.setItem('cj_order_id', newId)
        setOrderId(newId)
      }
    } catch {}
  }, [])

  async function copyIBAN() {
    try {
      await navigator.clipboard.writeText(IBAN)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!customer || items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center gap-6 px-4">
        <div className="glass-card rounded-3xl p-12 text-center max-w-sm border border-white/10">
          <div className="text-5xl mb-5">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Session expirée</h2>
          <p className="text-white/50 text-sm mb-6">Veuillez recommencer depuis le début.</p>
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-105"
          >
            Retour à la boutique
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 glass-card border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/checkout" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            Modifier
          </Link>
          <span className="text-sm font-semibold text-white/60">Récapitulatif</span>
          <div className="w-20" />
        </div>
      </nav>

      {/* Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center gap-2 text-xs">
          {[
            { label: 'Boutique', done: true },
            { label: 'Informations', done: true },
            { label: 'Récapitulatif', active: true },
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 space-y-5">
        <h1 className="text-2xl font-bold text-white">Récapitulatif de votre commande</h1>

        {state?.error && (
          <div className="glass-card rounded-2xl p-4 border border-red-500/30 text-red-400 text-sm">
            {state.error}
          </div>
        )}

        {/* Order ID */}
        <div className="glass-card rounded-2xl p-5 border border-orange-500/25 bg-orange-500/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-orange-400/70 uppercase tracking-widest font-semibold mb-1">Numéro de commande</p>
              <p className="text-2xl font-extrabold text-orange-400 tracking-wider">{orderId}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {/* Customer info */}
          <div className="glass-card rounded-2xl p-5 border border-white/8 space-y-3">
            <h2 className="text-sm font-bold text-white/70 uppercase tracking-widest">Vos informations</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/40">Prénom</span>
                <span className="text-white font-medium">{customer.prenom}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Nom</span>
                <span className="text-white font-medium">{customer.nom}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">E-mail</span>
                <span className="text-white font-medium truncate max-w-[180px]">{customer.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Téléphone</span>
                <span className="text-white font-medium">{customer.telephone}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="glass-card rounded-2xl p-5 border border-white/8 space-y-3">
            <h2 className="text-sm font-bold text-white/70 uppercase tracking-widest">Articles commandés</h2>
            <div className="space-y-3">
              {items.map((item: CartItem, idx: number) => (
                <div key={idx} className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                    <Image
                      src={`/t-shirt-${item.couleur}.jpeg`}
                      alt={`T-shirt ${item.couleur}`}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">T-shirt Célébration Jeunesse</p>
                    <p className="text-xs text-white/40 capitalize">{item.couleur} · Taille {item.taille} · Qté {item.quantite}</p>
                  </div>
                  <span className="text-sm font-bold text-orange-400">{item.quantite * item.prixUnitaire} €</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between items-center">
              <span className="text-white/50 text-sm">Total</span>
              <span className="text-xl font-extrabold text-white">{total} €</span>
            </div>
          </div>
        </div>

        {/* Bank account */}
        <div className="glass-card rounded-2xl p-5 border border-violet-500/25 bg-violet-500/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
              </svg>
            </div>
            <div>
              <p className="text-xs text-violet-400/70 uppercase tracking-widest font-semibold">Paiement par virement bancaire</p>
              <p className="text-xs text-white/40 mt-0.5">{BANK_HOLDER}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-black/30 rounded-xl p-4 border border-white/8">
            <span className="text-lg font-mono font-bold text-white tracking-wider flex-1">{IBAN}</span>
            <button
              onClick={copyIBAN}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                copied
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-white/10 text-white/70 hover:bg-orange-500/20 hover:text-orange-400 border border-white/10'
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  Copié !
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                  </svg>
                  Copier le numéro de compte
                </>
              )}
            </button>
          </div>

          <div className="flex gap-3 bg-orange-500/10 rounded-xl p-4 border border-orange-500/20">
            <svg className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p className="text-sm text-orange-200/80 leading-relaxed">
              <strong className="text-orange-400">Important :</strong> Veuillez prendre note de votre numéro de commande{' '}
              <strong className="text-orange-300">{orderId}</strong> et l'ajouter obligatoirement dans la communication
              de votre virement afin que nous puissions associer votre paiement à votre commande.
            </p>
          </div>
        </div>

        {/* Validate form */}
        <form action={formAction}>
          <input type="hidden" name="nom" value={customer.nom} />
          <input type="hidden" name="prenom" value={customer.prenom} />
          <input type="hidden" name="email" value={customer.email} />
          <input type="hidden" name="telephone" value={customer.telephone} />
          <input type="hidden" name="cart" value={JSON.stringify(items)} />
          <input type="hidden" name="orderId" value={orderId} />

          <button
            type="submit"
            disabled={pending}
            className="w-full flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-400 disabled:bg-white/10 disabled:text-white/20 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] animate-glow-orange text-lg shadow-2xl"
          >
            {pending ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Enregistrement…
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Valider ma commande
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-white/25 pb-4">
          En validant, vous confirmez votre précommande et vous engagez à effectuer le virement dans les 48h.
        </p>
      </main>
    </div>
  )
}
