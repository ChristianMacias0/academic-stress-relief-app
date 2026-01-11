import React, { useState } from 'react';
import { EVENTOS_DATA, Evento } from './eventsData';
import { Card } from './ui/card';
import { Calendar, Star, Ticket, CheckCircle, DollarSign, Clock, TrendingUp, Filter } from 'lucide-react';

interface Props { onSelectEvent: (evento: Evento) => void; }

export default function Events({ onSelectEvent }: Props) {
  const [listaEventos, setListaEventos] = useState<Evento[]>(EVENTOS_DATA);
  const [filtroActivo, setFiltroActivo] = useState<string>('');

  // Lógica de ordenamiento funcional
  const aplicarOrden = (criterio: 'precio' | 'fecha' | 'importancia') => {
    setFiltroActivo(criterio);
    const copiaOrdenada = [...listaEventos].sort((a, b) => {
      if (criterio === 'precio') return a.precio - b.precio;
      if (criterio === 'fecha') return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
      if (criterio === 'importancia') return b.importancia - a.importancia;
      return 0;
    });
    setListaEventos(copiaOrdenada);
  };


  return (
    <div className=" h-40 flex flex-col  p-6" style={{ background: 'linear-gradient(135deg, #0B006E 0%, #007BFF 100%)' }}>

    <div className="p-6 space-y-6 bg-slate-50 min-h-full">
      <div className="space-y-1">
        
        <h1 className="text-4xl font-black tracking-tight" style={{ color: '#ffffff' }}>Eventos </h1>
        <p className="text-sm text-blue-600 font-medium text-white">Canjea tus rachas o adquiere entradas</p>
      </div>
    </div>
      <div className="p-6 space-y-6 bg-slate-50 min-h-full">

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl  border-slate-100">
          
          <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
            {[
              { id: 'precio', label: 'Precio', icon: <DollarSign className="w-3 h-3" /> },
              { id: 'fecha', label: 'Fecha', icon: <Clock className="w-3 h-3" /> },
              { id: 'importancia', label: 'Nivel', icon: <TrendingUp className="w-3 h-3" /> }
            ].map((f) => (
              <button 
                key={f.id} 
                onClick={() => aplicarOrden(f.id as any)}
                className={`flex items-center gap-2 text-[11px] font-bold px-4 py-2 rounded-xl transition-all border ${
                  filtroActivo === f.id 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 scale-105' 
                  : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
                }`}
              >
                {f.icon}
                {f.label}
              </button>
            ))}
          </div>
        </div>
      <div className="space-y-5">
        {listaEventos.map((evento) => (
          <Card 
            key={evento.id} 
            className={`relative overflow-hidden cursor-pointer transition-all hover:scale-[1.02] border-none shadow-xl ${evento.comprado ? 'opacity-90' : ''}`}
            onClick={() => onSelectEvent(evento)}
          >
            <div className="flex">
              {/* Parte Izquierda: Color/Icono */}
              <div className="w-4" style={{ background: evento.comprado ? '#10b981' : 'linear-gradient(to bottom, #007BFF, #0B006E)' }} />
              
              <div className="p-5 flex-1 bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">{evento.categoria}</span>
                    <h3 className="font-bold text-lg text-slate-800 leading-tight">{evento.titulo}</h3>
                  </div>
                  {evento.comprado ? (
                    <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-black">
                      <CheckCircle className="w-3 h-3" /> ADQUIRIDO
                    </div>
                  ) : (
                    <div className="text-right">
                      <p className="text-lg font-black text-blue-600">${evento.precio.toFixed(2)}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                    <Calendar className="w-3 h-3" /> {evento.fecha}
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < evento.importancia ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Efecto de Ticket (muescas laterales) */}
            <div className="absolute top-1/2 -left-2 w-4 h-4 bg-slate-50 rounded-full" />
            <div className="absolute top-1/2 -right-2 w-4 h-4 bg-slate-50 rounded-full" />
          </Card>
        ))}
      </div>
    </div>
    </div>
  );
}