import { cookies } from 'next/headers'
import { getOrders } from '@/lib/orders'
import type { Order, OrderStatus } from '@/lib/types'
import AdminLoginForm from './LoginForm'
import AdminStatusSelect from '@/components/AdminStatusSelect'

export const dynamic = 'force-dynamic'


function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/8">
      <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
    </div>
  )
}

export default async function AdminPage() {
  const cookieStore = await cookies()
  const isAuth = cookieStore.get('admin_auth')?.value === 'ok'

  if (!isAuth) {
    return <AdminLoginForm />
  }

  const orders = await getOrders()

  // Stats
  const total = orders.length
  const enAttente = orders.filter(o => o.statut === 'en_attente').length
  const payees = orders.filter(o => o.statut === 'payee').length
  const montantTotal = orders.filter(o => o.statut !== 'annulee').reduce((s, o) => s + o.total, 0)

  // Count by color/size
  const countByColor: Record<string, number> = {}
  const countBySize: Record<string, number> = {}
  orders.filter(o => o.statut !== 'annulee').forEach(o => {
    o.items.forEach(item => {
      countByColor[item.couleur] = (countByColor[item.couleur] ?? 0) + item.quantite
      countBySize[item.taille] = (countBySize[item.taille] ?? 0) + item.quantite
    })
  })

  const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL']

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <header className="glass-card border-b border-white/5 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="font-bold text-white">Back-office · Célébration Jeunesse</span>
          </div>
          <span className="text-xs text-white/30">{total} commande{total !== 1 ? 's' : ''}</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total commandes" value={total} color="text-white" />
          <StatCard label="En attente" value={enAttente} color="text-yellow-400" />
          <StatCard label="Payées" value={payees} color="text-green-400" />
          <StatCard label="Montant total" value={`${montantTotal} €`} color="text-orange-400" />
        </div>

        {/* Color / Size breakdown */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-white/8">
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Par couleur</h2>
            <div className="flex gap-4">
              {Object.entries(countByColor).map(([color, count]) => (
                <div key={color} className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full border-2 ${color === 'noir' ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-300'}`} />
                  <span className="capitalize text-white font-medium">{color}</span>
                  <span className="text-orange-400 font-bold">{count}</span>
                </div>
              ))}
              {Object.keys(countByColor).length === 0 && <p className="text-white/30 text-sm">—</p>}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/8">
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Par taille</h2>
            <div className="flex flex-wrap gap-2">
              {SIZES.map(size => (
                <div key={size} className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  countBySize[size]
                    ? 'glass-card border-orange-500/20 text-orange-400'
                    : 'border-white/5 text-white/20'
                }`}>
                  {size} {countBySize[size] ? <span>× {countBySize[size]}</span> : '—'}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Orders table */}
        <div className="glass-card rounded-2xl border border-white/8 overflow-hidden">
          <div className="p-5 border-b border-white/8 flex items-center justify-between">
            <h2 className="font-bold text-white">Toutes les commandes</h2>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center text-white/30">
              <p className="text-4xl mb-3">📋</p>
              <p>Aucune commande pour l'instant.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-xs text-white/30 uppercase tracking-widest">
                    <th className="text-left px-5 py-3 font-medium">N° commande</th>
                    <th className="text-left px-4 py-3 font-medium">Client</th>
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Contact</th>
                    <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Articles</th>
                    <th className="text-left px-4 py-3 font-medium">Montant</th>
                    <th className="text-left px-4 py-3 font-medium">Statut</th>
                    <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: Order) => (
                    <tr
                      key={order.id}
                      className="border-b border-white/5 hover:bg-white/3 transition-colors"
                    >
                      {/* N° */}
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs font-bold text-orange-400">{order.id}</span>
                      </td>

                      {/* Client */}
                      <td className="px-4 py-4">
                        <p className="font-medium text-white">{order.prenom} {order.nom}</p>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-4 hidden md:table-cell">
                        <p className="text-white/50 text-xs">{order.email}</p>
                        <p className="text-white/40 text-xs">{order.telephone}</p>
                      </td>

                      {/* Articles */}
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <div className="space-y-1">
                          {order.items.map((item, i) => (
                            <p key={i} className="text-white/60 text-xs capitalize">
                              {item.couleur} · {item.taille} · ×{item.quantite}
                            </p>
                          ))}
                        </div>
                      </td>

                      {/* Montant */}
                      <td className="px-4 py-4">
                        <span className="font-bold text-white">{order.total} €</span>
                      </td>

                      {/* Statut */}
                      <td className="px-4 py-4">
                        <AdminStatusSelect orderId={order.id} currentStatus={order.statut} />
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className="text-white/30 text-xs">
                          {new Date(order.dateCommande).toLocaleDateString('fr-BE', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
