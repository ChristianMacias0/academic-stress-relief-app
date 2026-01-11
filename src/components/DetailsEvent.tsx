import React from 'react';
import { Evento } from './eventsData';
import { Button } from './ui/button';
import { ArrowLeft, MapPin, Zap, Info, Ticket } from 'lucide-react';

interface Props { evento: Evento; onBack: () => void; onPay: (m: number) => void; }

export default function DetailsEvent({ evento, onBack, onPay }: Props) {
  const rachaActual = 7;
  const progreso = (rachaActual / evento.rachaRequerida) * 100;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className=" h-48 flex items-end p-6" style={{ background: 'linear-gradient(135deg, #0B006E 0%, #007BFF 100%)' }}>
        <div>
        <button onClick={onBack} className=" left p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute top-6 right-6 p-2 bg-white/10 backdrop-blur-md rounded-xl text-white/80 text-[10px] font-black border border-white/20">
          EVENTO #{evento.id}026
        </div>
        <div>
          <span className="text-blue-200 text-xs font-bold text-white uppercase tracking-widest">{evento.categoria}</span>
          <h1 className="text-3xl font-black text-white">{evento.titulo}</h1>
        </div>
        
      </div>
              </div>


      <div className="p-6 space-y-6 -mt-4 bg-slate-50 rounded-t-[32px] z-20 flex-1">
        <div className="flex gap-4">
          <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-blue-50">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Fecha</p>
            <p className="text-sm font-black text-slate-700">{evento.fecha}</p>
          </div>
          <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-blue-50">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Ubicación</p>
            <p className="text-sm font-black text-slate-700">Campus Principal</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-900 font-bold">
            <Info className="w-4 h-4" /> <span>Sobre el evento</span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">{evento.descripcion}</p>
        </div>

        {/* Gamificación de Racha */}
        <div className="bg-white p-6 rounded-[24px] shadow-xl shadow-blue-900/5 border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap className="w-12 h-12 text-blue-600" />
          </div>
          
          <h4 className="text-sm font-black text-blue-900 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" /> MODO RECOMPENSA
          </h4>
          
          <p className="text-xs font-bold text-slate-600 mb-2">
            Alcanza los <span className="text-blue-600">{evento.rachaRequerida} días de racha</span> para obtener tu entrada GRATIS.
          </p>

          <div className="relative w-full h-4 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-700" style={{ width: `${progreso}%` }} />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-blue-500">PROGRESO ACTUAL</span>
            <span className="text-[10px] font-black text-slate-400 italic">¡Te faltan {evento.rachaRequerida - rachaActual} días!</span>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white border-t border-slate-100">
        <Button 
          className="w-full h-14 rounded-2xl text-lg font-black shadow-lg transition-transform active:scale-95"
          style={{ background: evento.comprado ? '#10b981' : 'linear-gradient(135deg, #007BFF 0%, #0B006E 100%)', opacity: evento.comprado ? 0.7 : 1 }}
          onClick={() => !evento.comprado && onPay(evento.precio)}
          disabled={evento.comprado}
        >
          {evento.comprado ? 'ENTRADA YA ADQUIRIDA' : `ADQUIRIR POR $${evento.precio.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
}