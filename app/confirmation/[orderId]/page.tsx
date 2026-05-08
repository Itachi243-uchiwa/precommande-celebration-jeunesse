import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getOrderById } from '@/lib/orders'
import ClearCartOnMount from '@/components/ClearCartOnMount'

export const dynamic = 'force-dynamic'

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params
  const decodedId = decodeURIComponent(orderId)
  const order = await getOrderById(decodedId)

  if (!order) notFound()

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col">
      <ClearCartOnMount />

      {/* Navbar */}
      <nav className="glass-card border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/NEW logo compassion bruxelles.png"
              alt="La Compassion Bruxelles"
              width={180}
              height={48}
              className="h-9 w-auto object-contain"
            />
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full space-y-6 animate-slide-up">
          {/* Success header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-500/30 animate-pulse-scale">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Commande enregistrée !</h1>
              <p className="text-white/50 mt-2">Merci {order.prenom}, votre précommande a bien été reçue.</p>
            </div>
          </div>

          {/* Order number */}
          <div className="glass-card rounded-2xl p-5 border border-orange-500/25 bg-orange-500/5 text-center">
            <p className="text-xs text-orange-400/70 uppercase tracking-widest font-semibold mb-2">Votre numéro de commande</p>
            <p className="text-3xl font-extrabold text-orange-400 tracking-wider">{order.id}</p>
            <p className="text-xs text-white/30 mt-2">Conservez ce numéro — il est indispensable pour le virement</p>
          </div>

          {/* Confirmation message */}
          <div className="glass-card rounded-2xl p-6 border border-white/8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center text-green-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h2 className="font-bold text-white">Que se passe-t-il maintenant ?</h2>
            </div>

            <div className="space-y-3 text-sm text-white/70 leading-relaxed">
              <p>
                Votre commande a bien été enregistrée.
              </p>
              <p>
                Pour finaliser votre précommande, veuillez effectuer un virement bancaire de{' '}
                <strong className="text-white">{order.total} €</strong> sur le compte indiqué ci-dessous.
              </p>
              <p className="text-orange-300 font-medium">
                Important : ajoutez votre numéro de commande <strong>{order.id}</strong> dans la communication du virement.
              </p>
              <p>
                Une fois le virement reçu, votre commande sera validée.
              </p>
              <p className="flex items-center gap-2 text-white/90 font-medium">
                <svg className="w-4 h-4 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Votre t-shirt sera disponible à l'église La Compassion Bruxelles le dimanche 24 mai.
              </p>
            </div>
          </div>

          {/* Order summary */}
          <div className="glass-card rounded-2xl p-6 border border-white/8 space-y-4">
            <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest">Récapitulatif</h2>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
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
                    <p className="text-sm text-white">T-shirt Célébration Jeunesse</p>
                    <p className="text-xs text-white/40 capitalize">
                      {item.couleur} · Taille {item.taille} · Qté {item.quantite}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-orange-400">{item.quantite * item.prixUnitaire} €</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between">
              <span className="text-white/50 text-sm">Total à virer</span>
              <span className="text-xl font-extrabold text-white">{order.total} €</span>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
