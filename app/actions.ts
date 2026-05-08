'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { saveOrder, updateOrderStatus } from '@/lib/orders'
import type { CartItem } from '@/lib/types'

const PRECOMMANDE_DEADLINE = new Date('2026-05-16T23:59:59')
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'glowfaith2026'

export async function submitOrder(_prevState: { error?: string } | null, formData: FormData) {
  if (new Date() > PRECOMMANDE_DEADLINE) {
    return { error: 'Les précommandes sont maintenant closes.' }
  }

  const nom = (formData.get('nom') as string)?.trim()
  const prenom = (formData.get('prenom') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const telephone = (formData.get('telephone') as string)?.trim()
  const cartJson = formData.get('cart') as string
  const orderId = (formData.get('orderId') as string)?.trim()

  if (!nom || !prenom || !email || !telephone || !cartJson || !orderId) {
    return { error: 'Données manquantes. Veuillez recommencer depuis le début.' }
  }

  let items: CartItem[]
  try {
    items = JSON.parse(cartJson)
  } catch {
    return { error: 'Panier invalide. Veuillez recommencer.' }
  }

  if (!items.length) {
    return { error: 'Votre panier est vide.' }
  }

  const total = items.reduce((sum, item) => sum + item.quantite * item.prixUnitaire, 0)

  await saveOrder({
    id: orderId,
    nom,
    prenom,
    email,
    telephone,
    items,
    total,
    statut: 'en_attente',
    dateCommande: new Date().toISOString(),
  })

  redirect(`/confirmation/${encodeURIComponent(orderId)}`)
}

export async function adminLogin(_prevState: { error?: string } | null, formData: FormData) {
  const password = (formData.get('password') as string)?.trim()

  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set('admin_auth', 'ok', {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
    })
    redirect('/admin')
  }

  return { error: 'Mot de passe incorrect.' }
}

export async function changeOrderStatus(formData: FormData) {
  const id = formData.get('id') as string
  const statut = formData.get('statut') as 'en_attente' | 'payee' | 'annulee'
  if (id && statut) {
    await updateOrderStatus(id, statut)
    revalidatePath('/admin')
  }
}
