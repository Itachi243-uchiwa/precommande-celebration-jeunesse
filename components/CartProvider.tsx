'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import type { CartItem, TShirtColor, TShirtSize } from '@/lib/types'

interface CartContextType {
  items: CartItem[]
  addItem: (item: { couleur: TShirtColor; taille: TShirtSize; quantite: number }) => void
  removeItem: (index: number) => void
  updateQuantity: (index: number, delta: number) => void
  clearCart: () => void
  total: number
  itemCount: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const bounceRef = useRef(false)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('cj_cart')
      if (saved) setItems(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cj_cart', JSON.stringify(items))
    }
  }, [items, mounted])

  const addItem = useCallback((item: { couleur: TShirtColor; taille: TShirtSize; quantite: number }) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.couleur === item.couleur && i.taille === item.taille)
      if (idx !== -1) {
        const updated = [...prev]
        updated[idx] = { ...updated[idx], quantite: updated[idx].quantite + item.quantite }
        return updated
      }
      return [...prev, { ...item, prixUnitaire: 20 }]
    })
    bounceRef.current = true
    // Ne pas auto-ouvrir le drawer — le feedback est géré par le toast dans la boutique
  }, [])

  const removeItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }, [])

  const updateQuantity = useCallback((index: number, delta: number) => {
    setItems(prev => {
      const updated = [...prev]
      const newQty = updated[index].quantite + delta
      if (newQty <= 0) return prev.filter((_, i) => i !== index)
      updated[index] = { ...updated[index], quantite: newQty }
      return updated
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cj_cart')
    }
  }, [])

  const total = items.reduce((sum, item) => sum + item.quantite * item.prixUnitaire, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantite, 0)

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      total, itemCount,
      isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false),
    }}>
      {children}
    </CartContext.Provider>
  )
}
