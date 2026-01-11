import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Loader2, CheckCircle, ShieldCheck, Ticket } from 'lucide-react';

interface Props { precio: number; onFinish: () => void; }

export default function PagoEvento({ precio, onFinish }: Props) {
  const [estado, setEstado] = useState<'espera' | 'pagando' | 'exito'>('espera');

  const manejarPago = () => {
    setEstado('pagando');
    setTimeout(() => setEstado('exito'), 2000);
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-6 bg-slate-50/50">
      <Card className="w-full max-w-sm p-8 border-0 bg-white rounded-[32px] flex flex-col items-center space-y-8">
        
        {estado === 'exito' ? (
          <div className="text-center space-y-6 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Pago Confirmado</h2>
              <p className="text-sm text-slate-500">Tu comprobante ha sido generado exitosamente.</p>
            </div>
            <Button onClick={onFinish} className="w-full h-12 rounded-xl bg-slate-900 text-white font-bold">
              Finalizar
            </Button>
          </div>
        ) : (
          <div className="w-full space-y-8">
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto">
                <Ticket className="w-7 h-7 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resumen de Compra</p>
                <h2 className="text-4xl font-black text-slate-900">${precio.toFixed(2)}</h2>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Esta es una simulación segura para fines académicos. No se requiere información bancaria real.
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={manejarPago}
                disabled={estado === 'pagando'}
                className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-blue-100"
                style={{ background: 'linear-gradient(135deg, #007BFF 0%, #0B006E 100%)' }}
              >
                {estado === 'pagando' ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  'Confirmar Pago'
                )}
              </Button>
              <button 
                onClick={onFinish} 
                className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Cancelar Transacción
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}