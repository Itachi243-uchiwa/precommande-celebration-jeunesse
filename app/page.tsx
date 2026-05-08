'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const DEADLINE = new Date('2026-05-16T23:59:59')

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    function tick() {
      const now = new Date()
      const diff = DEADLINE.getTime() - now.getTime()
      if (diff <= 0) {
        setIsOpen(false)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return { timeLeft, isOpen }
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="glass-card rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center border border-orange-500/20">
        <span className="text-2xl sm:text-3xl font-bold gradient-text-orange tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs text-white/50 uppercase tracking-widest">{label}</span>
    </div>
  )
}

export default function HomePage() {
  const { timeLeft, isOpen } = useCountdown()
  const [selectedColor, setSelectedColor] = useState<'noir' | 'blanc'>('noir')

  return (
    <div className="min-h-screen flex flex-col">
      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/NEW logo compassion bruxelles.png"
              alt="La Compassion Bruxelles"
              width={180}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          <Link
            href="/boutique"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 animate-glow-orange"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            Commander
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="bg-hero flex-1 flex flex-col items-center justify-center pt-24 pb-16 px-4 relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-violet-600/10 blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute bottom-20 right-[10%] w-72 h-72 rounded-full bg-orange-500/10 blur-3xl pointer-events-none animate-float-slow stagger-3" />

        <div className="max-w-5xl w-full mx-auto text-center space-y-8 relative z-10">
          {/* Badge */}
          <div className="animate-slide-up opacity-0 stagger-1 inline-flex items-center gap-2 glass-card-light rounded-full px-4 py-2 text-sm text-orange-400 border border-orange-500/20 mx-auto">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Précommandes ouvertes jusqu'au 16 mai
          </div>

          {/* Logo */}
          <div className="animate-slide-up opacity-0 stagger-2 flex justify-center">
            <div className="animate-glow-orange rounded-2xl p-2">
              <Image
                src="/NEW logo compassion bruxelles.png"
                alt="La Compassion Bruxelles"
                width={280}
                height={120}
                className="h-24 sm:h-28 w-auto object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Title */}
          <div className="animate-slide-up opacity-0 stagger-3 space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none">
              <span className="gradient-text">Célébration</span>
              <br />
              <span className="text-white">Jeunesse</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/60 font-light">
              T-shirt officiel · Édition limitée · 20 €
            </p>
          </div>

          {/* Countdown */}
          {isOpen ? (
            <div className="animate-slide-up opacity-0 stagger-4 space-y-3">
              <p className="text-white/40 text-sm uppercase tracking-wider">Fermeture des commandes dans</p>
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <CountdownUnit value={timeLeft.days} label="jours" />
                <span className="text-2xl font-bold text-orange-500/60 mb-5">:</span>
                <CountdownUnit value={timeLeft.hours} label="heures" />
                <span className="text-2xl font-bold text-orange-500/60 mb-5">:</span>
                <CountdownUnit value={timeLeft.minutes} label="min" />
                <span className="text-2xl font-bold text-orange-500/60 mb-5">:</span>
                <CountdownUnit value={timeLeft.seconds} label="sec" />
              </div>
            </div>
          ) : (
            <div className="animate-slide-up opacity-0 stagger-4 glass-card rounded-2xl p-4 border border-red-500/20 text-red-400">
              Les précommandes sont closes.
            </div>
          )}

          {/* CTA */}
          {isOpen && (
            <div className="animate-slide-up opacity-0 stagger-5">
              <Link
                href="/boutique"
                className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-400 text-white text-lg font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 animate-glow-orange shadow-2xl"
              >
                Commander mon t-shirt
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ─── T-SHIRTS SHOWCASE ─── */}
      <section className="py-24 px-4 bg-surface-2">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Le t-shirt officiel</h2>
            <p className="text-white/50">Disponible en noir et en blanc · Tailles hommes XS à XXXXL</p>
          </div>

          {/* Color toggle */}
          <div className="flex justify-center gap-3 mb-10">
            {(['noir', 'blanc'] as const).map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 border ${
                  selectedColor === color
                    ? 'bg-orange-500 text-white border-orange-500 scale-105'
                    : 'glass-card text-white/60 border-white/10 hover:border-orange-500/30'
                }`}
              >
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <div className="relative max-w-sm w-full animate-float">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-orange-500/20 to-violet-600/20 blur-2xl" />
              <div className="glass-card rounded-3xl p-8 relative">
                <Image
                  src={`/t-shirt-${selectedColor}.jpeg`}
                  alt={`T-shirt ${selectedColor}`}
                  width={400}
                  height={400}
                  className="w-full h-auto rounded-2xl object-contain transition-opacity duration-300"
                  priority
                />
                <div className="absolute top-4 right-4 bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  20 €
                </div>
              </div>
            </div>
          </div>

          {isOpen && (
            <div className="text-center mt-10">
              <Link
                href="/boutique"
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
              >
                Choisir ma taille et commander
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ─── INFOS ─── */}
      <section className="py-20 px-4 bg-[#0A0A0F]">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              ),
              title: 'Précommande',
              desc: 'Commandez avant le 16 mai',
              color: 'orange',
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                </svg>
              ),
              title: 'Paiement',
              desc: 'Virement bancaire uniquement',
              color: 'violet',
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              ),
              title: 'Retrait',
              desc: 'Dimanche 24 mai — La Compassion Bruxelles',
              color: 'orange',
            },
          ].map((item, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 flex flex-col gap-4 hover:border-orange-500/20 transition-colors duration-300 border border-white/5">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color === 'orange' ? 'bg-orange-500/15 text-orange-400' : 'bg-violet-500/15 text-violet-400'}`}>
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-white/50 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 py-8 px-4 text-center text-white/30 text-sm space-y-1">
        <p>© 2026 Église La Compassion Bruxelles · Célébration Jeunesse</p>
        <p className="text-white/15 text-xs">Powered by Martinez Muzela</p>
      </footer>
    </div>
  )
}
