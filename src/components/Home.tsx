import { Calendar, TrendingUp, MessageCircle, CheckSquare, Gift, Sparkles, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  reward: number;
  dueDate: string;
}

interface HomeProps {
  userName: string;
  tasks: Task[];
  onNavigate: (screen: 'home' | 'chat' | 'tasks' | 'rewards' | 'profile' | 'psychologists') => void;
}

export function Home({ userName, tasks, onNavigate }: HomeProps) {
  const [chatInput, setChatInput] = useState('');
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedToday = tasks.filter(t => t.completed).length;

  const handleChatSubmit = () => {
    if (chatInput.trim()) {
      // Si el usuario escribe algo, navegar al chat
      onNavigate('chat');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleChatSubmit();
    }
  };

  return (
    <div className="min-h-full relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #E0E7FF 0%, #F5F3FF 50%, #FEF3C7 100%)' }}>
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #007BFF 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)' }} />
      
      {/* Contenido principal */}
      <div className="relative z-10 p-6 pt-8 space-y-6">
        {/* Saludo personalizado con animación */}
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-2" style={{ background: 'linear-gradient(135deg, #007BFF 0%, #0B006E 100%)', boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)' }}>
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            <span className="text-white">¡Bienvenido de vuelta!</span>
          </div>
          <h1 className="text-4xl" style={{ color: '#0B006E', fontWeight: 700 }}>Hola {userName}</h1>
          <p className="text-lg" style={{ color: '#0B006E', opacity: 0.8 }}>
            ¿Qué deseas hacer hoy?
          </p>
        </div>

        {/* Resumen rápido mejorado */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-5 border-0 shadow-lg transform transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #DBEAFE 0%, #93C5FD 100%)' }}>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md" style={{ backgroundColor: '#007BFF' }}>
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <p className="text-3xl mb-1" style={{ color: '#1E3A8A', fontWeight: 700 }}>{pendingTasks.length}</p>
              <p className="text-xs" style={{ color: '#1E40AF', fontWeight: 500 }}>Tareas Pendientes</p>
            </div>
          </Card>

          <Card className="p-5 border-0 shadow-lg transform transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #D1FAE5 0%, #6EE7B7 100%)' }}>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md" style={{ backgroundColor: '#10b981' }}>
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <p className="text-3xl mb-1" style={{ color: '#064E3B', fontWeight: 700 }}>{completedToday}</p>
              <p className="text-xs" style={{ color: '#065F46', fontWeight: 500 }}>Completadas Hoy</p>
            </div>
          </Card>
        </div>

        {/* Botones de acción principales con diseño mejorado */}
        <div className="space-y-3">
          <Button
            onClick={() => onNavigate('tasks')}
            className="w-full h-16 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-0"
            style={{ 
              background: 'linear-gradient(135deg, #007BFF 0%, #0066CC 100%)',
              color: 'white'
            }}
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <CheckSquare className="w-5 h-5" />
              </div>
              <span className="text-lg">Revisar mis tareas</span>
            </div>
          </Button>

          <Button
            onClick={() => onNavigate('rewards')}
            className="w-full h-16 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-0"
            style={{ 
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: 'white'
            }}
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
              <span className="text-lg">Canjear Recompensas</span>
            </div>
          </Button>
        </div>

        {/* Mensaje de chat mejorado */}
        <div className="pt-4 space-y-4">
          <Card className="p-5 rounded-3xl shadow-md border-0 transform transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #F1F3F4 0%, #E5E7EB 100%)' }}>
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 flex-shrink-0" style={{ color: '#007BFF' }} />
              <p className="text-center flex-1" style={{ color: '#0B006E', fontWeight: 500 }}>
                ¿Necesitas desahogarte o conversar?
              </p>
            </div>
          </Card>

          {/* Campo de chat mejorado */}
          <div className="relative">
            <div 
              className="rounded-3xl p-1.5 shadow-xl flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #0B006E 0%, #1E40AF 100%)' }}
            >
              <div className="flex-1 bg-white rounded-3xl px-5 py-4 shadow-inner">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe aquí para empezar a conversar..."
                  className="w-full bg-transparent border-none outline-none placeholder:text-gray-400"
                  style={{ color: '#0B006E' }}
                />
              </div>
              <button
                onClick={handleChatSubmit}
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 flex-shrink-0 shadow-lg"
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
              >
                <MessageCircle className="w-7 h-7 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Mensaje motivacional */}
        <Card className="p-5 rounded-2xl border-0 shadow-md" style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' }}>
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 flex-shrink-0 mt-1 text-yellow-600" />
            <p className="text-sm leading-relaxed" style={{ color: '#78350F', fontWeight: 500 }}>
              ¡Recuerda que cada logro, por pequeño que sea, te acerca a tus metas! Tu bienestar es lo primero. 💙
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}