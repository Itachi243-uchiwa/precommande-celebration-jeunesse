'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/CartProvider'
import type { TShirtSize, TShirtColor } from '@/lib/types'

const SIZES: TShirtSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL']
const DEADLINE = new Date('2026-05-16T23:59:59')

function CartDrawer() {
  const { items, removeItem, updateQuantity, total, itemCount, isOpen, closeCart } = useCart()

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={closeCart} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm glass-card border-l border-white/10 animate-slide-right flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">Mon panier</h2>
            {itemCount > 0 && (
              <p className="text-xs text-white/40 mt-0.5">{itemCount} article{itemCount > 1 ? 's' : ''} · {total} €</p>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-lg glass-card-light flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {items.length === 0 ? (
            <div className="text-center text-white/40 py-12 space-y-3">
              <svg className="w-12 h-12 mx-auto text-white/20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              <p>Votre panier est vide</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={idx} className="glass-card-light rounded-xl p-4 flex gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                  <Image
                    src={`/t-shirt-${item.couleur}.jpeg`}
                    alt={`T-shirt ${item.couleur}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">T-shirt Célébration</p>
                  <p className="text-xs text-white/50 capitalize">{item.couleur} · Taille {item.taille}</p>
                  <p className="text-sm font-bold text-orange-400 mt-1">{item.quantite * item.prixUnitaire} €</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(idx, -1)} className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white hover:bg-orange-500/30 transition-colors text-xs font-bold">−</button>
                    <span className="text-sm font-medium text-white w-4 text-center">{item.quantite}</span>
                    <button onClick={() => updateQuantity(idx, 1)} className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white hover:bg-orange-500/30 transition-colors text-xs font-bold">+</button>
                    <button onClick={() => removeItem(idx)} className="ml-auto text-white/30 hover:text-red-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-5 border-t border-white/10 space-y-3">
          {items.length > 0 ? (
            <>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Total</span>
                <span className="text-xl font-bold text-white">{total} €</span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] animate-glow-orange"
              >
                Passer la commande
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
              <button
                onClick={closeCart}
                className="w-full text-sm text-white/40 hover:text-white/70 transition-colors py-1"
              >
                ← Continuer mes achats
              </button>
            </>
          ) : (
            <button
              onClick={closeCart}
              className="w-full text-sm text-white/40 hover:text-white/70 transition-colors py-1"
            >
              ← Retour à la boutique
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default function BoutiquePage() {
  const { addItem, items, itemCount, total, openCart } = useCart()
  const [selectedColor, setSelectedColor] = useState<TShirtColor>('noir')
  const [selectedSize, setSelectedSize] = useState<TShirtSize | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addedFeedback, setAddedFeedback] = useState<string | null>(null)

  const isPrecommandeOpen = new Date() < DEADLINE

  function handleAdd() {
    if (!selectedSize || !isPrecommandeOpen) return

    addItem({ couleur: selectedColor, taille: selectedSize, quantite: quantity })

    const feedback = `${selectedColor === 'noir' ? '⚫' : '⚪'} ${selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)} · ${selectedSize} ajouté !`
    setAddedFeedback(feedback)

    // Réinitialiser pour permettre d'ajouter un autre article immédiatement
    setSelectedSize(null)
    setQuantity(1)

    setTimeout(() => setAddedFeedback(null), 2500)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <CartDrawer />

      {/* Navbar */}
      <nav className="sticky top-0 z-30 glass-card border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/NEW logo compassion bruxelles.png"
              alt="La Compassion Bruxelles"
              width={180}
              height={48}
              className="h-9 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-3">
            {isPrecommandeOpen && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-orange-400 glass-card-light rounded-full px-3 py-1 border border-orange-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                Ouvert jusqu'au 16 mai
              </span>
            )}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl glass-card-light border border-white/10 text-white/70 hover:text-orange-400 hover:border-orange-500/30 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              {itemCount > 0 && (
                <>
                  <span className="text-sm font-bold text-orange-400">{itemCount}</span>
                  <span className="text-xs text-white/40">{total} €</span>
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse" />
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      {!isPrecommandeOpen ? (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="glass-card rounded-3xl p-12 text-center max-w-md border border-red-500/20">
            <div className="text-6xl mb-6">🔒</div>
            <h2 className="text-2xl font-bold text-white mb-3">Précommandes closes</h2>
            <p className="text-white/50">La période de précommande s'est terminée le 16 mai 2026.</p>
          </div>
        </div>
      ) : (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-8">
            <Link href="/" className="hover:text-white/70 transition-colors">Accueil</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
            <span className="text-white/70">Boutique</span>
          </nav>

          {/* Toast feedback */}
          {addedFeedback && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
              <div className="glass-card border border-green-500/30 bg-green-500/10 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-2xl">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                <span className="text-sm font-semibold text-green-300">{addedFeedback}</span>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* ─── T-shirt image ─── */}
            <div className="lg:sticky lg:top-24">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/15 to-violet-600/20 blur-3xl" />
                <div className="glass-card rounded-3xl p-8 relative">
                  <div className="animate-float">
                    <Image
                      src={`/t-shirt-${selectedColor}.jpeg`}
                      alt={`T-shirt Célébration Jeunesse ${selectedColor}`}
                      width={500}
                      height={500}
                      className="w-full h-auto rounded-2xl object-contain transition-opacity duration-300"
                      priority
                    />
                  </div>
                  <div className="absolute top-6 right-6 bg-orange-500 text-white text-base font-bold px-4 py-1.5 rounded-full shadow-lg">
                    20 €
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-white/30 mt-4">⚠️ Toutes les tailles sont des tailles hommes</p>
            </div>

            {/* ─── Product options ─── */}
            <div className="space-y-7">
              <div>
                <h1 className="text-3xl font-extrabold text-white leading-tight">T-shirt Célébration Jeunesse</h1>
                <p className="text-white/50 mt-2 text-sm">Édition limitée · Paiement par virement</p>
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-4xl font-extrabold gradient-text-orange">20 €</span>
                  <span className="text-white/40 text-sm">par t-shirt</span>
                </div>
              </div>

              {/* Multi-item tip */}
              <div className="flex items-start gap-3 glass-card-light rounded-xl p-3.5 border border-violet-500/20">
                <span className="text-violet-400 text-lg">💡</span>
                <p className="text-xs text-white/60 leading-relaxed">
                  Vous pouvez commander <strong className="text-white/90">plusieurs t-shirts</strong> en variant la couleur et la taille.
                  Choisissez une combinaison, ajoutez-la, puis recommencez pour en ajouter d'autres.
                </p>
              </div>

              {/* Color selector */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-white/80 uppercase tracking-widest">
                  Couleur : <span className="text-orange-400 capitalize font-bold">{selectedColor}</span>
                </label>
                <div className="flex gap-3">
                  {(['noir', 'blanc'] as TShirtColor[]).map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-200 w-28 ${
                        selectedColor === color
                          ? 'border-orange-500 scale-105 shadow-lg shadow-orange-500/20'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <Image
                        src={`/t-shirt-${color}.jpeg`}
                        alt={`T-shirt ${color}`}
                        width={112}
                        height={112}
                        className="w-full h-auto object-cover"
                      />
                      <div className={`absolute inset-0 flex items-end justify-center pb-2 ${
                        selectedColor === color ? 'bg-orange-500/10' : 'bg-black/20'
                      }`}>
                        <span className="text-xs font-bold text-white capitalize">{color}</span>
                      </div>
                      {selectedColor === color && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size selector */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-white/80 uppercase tracking-widest">
                  Taille (homme) :{' '}
                  {selectedSize
                    ? <span className="text-orange-400 font-bold">{selectedSize}</span>
                    : <span className="text-white/30 normal-case font-normal">sélectionnez</span>
                  }
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {SIZES.map(size => {
                    const alreadyInCart = items.some(i => i.couleur === selectedColor && i.taille === size)
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border relative ${
                          selectedSize === size
                            ? 'bg-orange-500 text-white border-orange-500 scale-105 shadow-md shadow-orange-500/25'
                            : 'glass-card-light text-white/70 border-white/10 hover:border-orange-500/40 hover:text-white'
                        }`}
                      >
                        {size}
                        {alreadyInCart && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-[#0A0A0F]" title="Déjà dans le panier" />
                        )}
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-white/30">
                  Un point vert <span className="inline-block w-2 h-2 rounded-full bg-green-500 align-middle" /> = déjà dans votre panier pour ce coloris
                </p>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-white/80 uppercase tracking-widest">Quantité</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-xl glass-card border border-white/10 flex items-center justify-center text-white font-bold text-lg hover:border-orange-500/40 hover:text-orange-400 transition-all"
                  >−</button>
                  <span className="text-2xl font-bold text-white w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(10, q + 1))}
                    className="w-10 h-10 rounded-xl glass-card border border-white/10 flex items-center justify-center text-white font-bold text-lg hover:border-orange-500/40 hover:text-orange-400 transition-all"
                  >+</button>
                  {quantity > 1 && (
                    <span className="text-sm text-white/40">= {quantity * 20} €</span>
                  )}
                </div>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAdd}
                disabled={!selectedSize}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-bold transition-all duration-300 ${
                  !selectedSize
                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-400 text-white hover:scale-[1.02] animate-glow-orange shadow-xl'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                {!selectedSize ? 'Choisissez une taille' : `Ajouter au panier — ${quantity * 20} €`}
              </button>

              {/* Go to checkout */}
              {itemCount > 0 && (
                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-semibold text-white border border-white/15 hover:border-orange-500/30 glass-card-light transition-all duration-200 hover:text-orange-400"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Finaliser ma commande · {itemCount} article{itemCount > 1 ? 's' : ''} · {total} €
                </Link>
              )}

              {/* Trust badges */}
              <div className="flex flex-wrap gap-3 pt-1">
                {[
                  { icon: '🔒', text: 'Paiement sécurisé par virement' },
                  { icon: '📦', text: 'Retrait le 24 mai à la Compassion' },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-white/40">
                    <span>{b.icon}</span>
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart summary at bottom if items */}
          {itemCount > 0 && (
            <div className="mt-12 glass-card rounded-2xl p-5 border border-white/8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white">Articles dans votre panier</h2>
                <button onClick={openCart} className="text-xs text-orange-400 hover:text-orange-300 transition-colors">Voir tout →</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 glass-card-light rounded-xl px-3 py-2 border border-white/8">
                    <div className="w-8 h-8 rounded overflow-hidden">
                      <Image
                        src={`/t-shirt-${item.couleur}.jpeg`}
                        alt=""
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs text-white/70 capitalize">{item.couleur} · {item.taille}</span>
                    <span className="text-xs font-bold text-orange-400">×{item.quantite}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/8">
                <span className="text-white/50 text-sm">Total panier</span>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-extrabold text-white">{total} €</span>
                  <Link
                    href="/checkout"
                    className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all hover:scale-105 animate-glow-orange"
                  >
                    Commander →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  )
}
