'use client'

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correção de ícones para o Next.js
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon.src || markerIcon,
    shadowUrl: markerShadow.src || markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function Mapa() {
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDadosDoFirebase = async () => {
      try {
        // Buscamos o documento específico que aparece no teu print
        const docRef = doc(db, "lugares", "RcnB7cAF3OlQFINw3dpu");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const dados = docSnap.data();
          
          // Mapeamos os campos do teu documento para uma lista que o mapa entende
          const listaFormatada = Object.keys(dados).map(chave => ({
            id: chave,
            nome: chave,
            posicao: dados[chave] // Aqui estão a latitude e longitude (geopoint)
          }));

          setLugares(listaFormatada);
        } else {
          console.error("Documento não encontrado no Firestore!");
        }
      } catch (error) {
        console.error("Erro ao carregar lugares:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDadosDoFirebase();
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-zinc-900 text-white font-mono">
        <p className="animate-pulse">Sincronizando pontos com Firestore...</p>
      </div>
    );
  }

  return (
    <div style={{ height: 'calc(100vh - 64px)', width: '100%' }}>
      <MapContainer 
        center={[-21.7633, -43.3495]} 
        zoom={14} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {lugares.map((lugar) => {
          // Verificação de segurança para garantir que as coordenadas existem
          if (lugar.posicao && lugar.posicao.latitude) {
            return (
              <Marker 
                key={lugar.id} 
                position={[lugar.posicao.latitude, lugar.posicao.longitude]}
              >
                <Popup>
                  <div className="text-zinc-900">
                    <h2 className="font-bold">{lugar.nome}</h2>
                    <p className="text-xs text-zinc-500 mt-1">Ponto carregado via Firebase</p>
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
}