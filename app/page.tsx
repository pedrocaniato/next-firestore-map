'use client'

import dynamic from 'next/dynamic';

// Import dinâmico para evitar erro de SSR com o Leaflet
const Mapa = dynamic(() => import('../src/components/Mapa'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-zinc-900 text-white">
      <p className="animate-pulse">Carregando mapa e dados do Firebase...</p>
    </div>
  )
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden">
      <header className="bg-zinc-900 text-green-400 p-4 border-b border-green-900/30 z-[1000] flex justify-between items-center">
        <h1 className="text-lg font-mono font-bold uppercase tracking-widest">
          Projeto Romualdo // Firestore Map
        </h1>
        <span className="text-xs font-mono opacity-70">Juiz de Fora - MG</span>
      </header>

      <div className="flex-1 w-full bg-black">
        <Mapa />
      </div>
    </main>
  );
}