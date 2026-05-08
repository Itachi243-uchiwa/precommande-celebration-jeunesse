'use client'

import { useEffect } from 'react'
import { useCart } from './CartProvider'

export default function ClearCartOnMount() {
  const { clearCart } = useCart()
  useEffect(() => {
    clearCart()
    sessionStorage.removeItem('cj_checkout')
    sessionStorage.removeItem('cj_order_id')
  }, [clearCart])
  return null
}
