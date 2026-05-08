import { supabase } from './supabase'
import type { Order } from './types'

function rowToOrder(row: Record<string, unknown>): Order {
  return {
    id:            row.id            as string,
    nom:           row.nom           as string,
    prenom:        row.prenom        as string,
    email:         row.email         as string,
    telephone:     row.telephone     as string,
    items:         row.items         as Order['items'],
    total:         row.total         as number,
    statut:        row.statut        as Order['statut'],
    dateCommande:  row.date_commande as string,
  }
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('date_commande', { ascending: false })

  if (error) {
    console.error('getOrders:', error.message)
    return []
  }
  return (data ?? []).map(rowToOrder)
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return rowToOrder(data)
}

export async function saveOrder(order: Order): Promise<void> {
  const { error } = await supabase.from('orders').insert({
    id:            order.id,
    nom:           order.nom,
    prenom:        order.prenom,
    email:         order.email,
    telephone:     order.telephone,
    items:         order.items,
    total:         order.total,
    statut:        order.statut,
    date_commande: order.dateCommande,
  })

  if (error) throw new Error(`saveOrder: ${error.message}`)
}

export async function updateOrderStatus(id: string, statut: Order['statut']): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ statut })
    .eq('id', id)

  if (error) throw new Error(`updateOrderStatus: ${error.message}`)
}
