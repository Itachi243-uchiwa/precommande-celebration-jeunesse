'use client'

import { changeOrderStatus } from '@/app/actions'
import type { OrderStatus } from '@/lib/types'

const STATUS_COLORS: Record<OrderStatus, string> = {
  en_attente: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  payee:       'text-green-400  bg-green-400/10  border-green-400/20',
  annulee:     'text-red-400    bg-red-400/10    border-red-400/20',
}

export default function AdminStatusSelect({ orderId, currentStatus }: {
  orderId: string
  currentStatus: OrderStatus
}) {
  return (
    <form action={changeOrderStatus}>
      <input type="hidden" name="id" value={orderId} />
      <select
        name="statut"
        defaultValue={currentStatus}
        onChange={e => e.currentTarget.form?.requestSubmit()}
        className={`text-xs font-semibold px-2 py-1 rounded-lg border bg-transparent outline-none cursor-pointer ${STATUS_COLORS[currentStatus]}`}
      >
        <option value="en_attente" className="bg-[#111118] text-yellow-400">En attente</option>
        <option value="payee"      className="bg-[#111118] text-green-400">Payée</option>
        <option value="annulee"    className="bg-[#111118] text-red-400">Annulée</option>
      </select>
    </form>
  )
}
