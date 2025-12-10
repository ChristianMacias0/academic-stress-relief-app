import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { ChatBot } from './components/ChatBot';
import { TaskManager } from './components/TaskManager';
import { Rewards } from './components/Rewards';
import { Profile } from './components/Profile';
import { PsychologistSearch } from './components/PsychologistSearch';
import { MessageCircle, CheckSquare, Gift, User, Home as HomeIcon, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card } from './components/ui/card';
import { Label } from './components/ui/label';

type Screen = 'home' | 'chat' | 'tasks' | 'rewards' | 'profile' | 'psychologists';

export default function App() {
  // --- ESTADOS CON PERSISTENCIA (LocalStorage) ---
  
  // 1. Nombre de Usuario (Si está vacío, muestra Onboarding)
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('app_userName') || '';
  });

  // 2. Monedas
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem('app_coins');
    return saved ? parseInt(saved) : 150;
  });

  // 3. Tareas
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('app_tasks');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Estudiar para examen de Cálculo', completed: false, reward: 50, dueDate: '2025-11-18' },
      { id: '2', title: 'Entregar proyecto de Programación', completed: false, reward: 80, dueDate: '2025-11-20' },
    ];
  });

  // 4. Recompensas
  const [rewards, setRewards] = useState(() => {
    const saved = localStorage.getItem('app_rewards');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Ver una película', cost: 50, icon: '🎬' },
      { id: '2', title: '1 hora de videojuegos', cost: 40, icon: '🎮' },
      { id: '3', title: 'Salir con amigos', cost: 100, icon: '👥' },
    ];
  });

  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [onboardingName, setOnboardingName] = useState(''); // Estado temporal para el input del onboarding

  // --- EFECTOS PARA GUARDAR CAMBIOS AUTOMÁTICAMENTE ---
  useEffect(() => localStorage.setItem('app_userName', userName), [userName]);
  useEffect(() => localStorage.setItem('app_coins', coins.toString()), [coins]);
  useEffect(() => localStorage.setItem('app_tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('app_rewards', JSON.stringify(rewards)), [rewards]);

  // --- LÓGICA DEL NEGOCIO ---

  const completeTask = (taskId: string) => {
    const task = tasks.find((t: any) => t.id === taskId);
    if (task && !task.completed) {
      setTasks(tasks.map((t: any) => t.id === taskId ? { ...t, completed: true } : t));
      setCoins(coins + task.reward);
    }
  };

  const addTask = (title: string, reward: number, dueDate: string) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      completed: false,
      reward,
      dueDate,
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((t: any) => t.id !== taskId));
  };

  const redeemReward = (rewardId: string) => {
    const reward = rewards.find((r: any) => r.id === rewardId);
    if (reward && coins >= reward.cost) {
      setCoins(coins - reward.cost);
      return true;
    }
    return false;
  };

  const addReward = (title: string, cost: number, icon: string) => {
    const newReward = {
      id: Date.now().toString(),
      title,
      cost,
      icon,
    };
    setRewards([...rewards, newReward]);
  };

  const deleteReward = (rewardId: string) => {
    setRewards(rewards.filter((r: any) => r.id !== rewardId));
  };

  // --- RENDERIZADO DE PANTALLAS ---

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home userName={userName} tasks={tasks} onNavigate={setCurrentScreen} />;
      case 'chat':
        return <ChatBot userName={userName} />;
      case 'tasks':
        return <TaskManager tasks={tasks} onComplete={completeTask} onAdd={addTask} onDelete={deleteTask} />;
      case 'rewards':
        return <Rewards rewards={rewards} coins={coins} onRedeem={redeemReward} onAdd={addReward} onDelete={deleteReward} />;
      case 'profile':
        return <Profile userName={userName} coins={coins} tasks={tasks} onNameChange={setUserName} onNavigate={setCurrentScreen} />;
      case 'psychologists':
        return <PsychologistSearch onNavigate={setCurrentScreen} />;
      default:
        return <Home userName={userName} tasks={tasks} onNavigate={setCurrentScreen} />;
    }
  };

  // --- PANTALLA DE ONBOARDING (Si no hay usuario) ---
  if (!userName) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <div className="w-full max-w-md h-[800px] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col items-center justify-center p-8 text-center space-y-8" 
             style={{ background: 'linear-gradient(180deg, #E0E7FF 0%, #FFFFFF 100%)', borderColor: '#0B006E', borderWidth: '1px' }}>
          
          {/* Decoración */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #007BFF 0%, transparent 70%)' }} />
          
          <div className="space-y-4 z-10">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto shadow-xl animate-bounce" style={{ background: 'linear-gradient(135deg, #007BFF 0%, #0066CC 100%)' }}>
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold" style={{ color: '#0B006E' }}>¡Bienvenido/a!</h1>
            <div className="w-0.25">
              <p className="text-lg" style={{ color: '#1E40AF' },{ padding: "15px"}}>
                Estamos aquí para ayudarte a organizar tu día y sentirte mejor.
              </p>
            </div>
          </div>


          <div className="w-0.25" style={{margin:"10px"}}>
            <Card className="w-0.25 p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm z-10">
              <div className="space-y-4 text-left">
                <Label htmlFor="name" className="text-base font-semibold" style={{ color: '#0B006E' }}>
                  ¿Cómo te gustaría que te llamemos?
                </Label>
                <Input
                  id="name"
                  value={onboardingName}
                  onChange={(e) => setOnboardingName(e.target.value)}
                  placeholder="Escribe tu nombre o apodo..."
                  className="h-12 text-lg border-2"
                  style={{ borderColor: '#007BFF' }}
                  onKeyPress={(e) => e.key === 'Enter' && onboardingName.trim() && setUserName(onboardingName)}
                  autoFocus
                />
              </div>
            </Card>

            <div style={{margin:"15px"}}>
              <Button 
                onClick={() => {
                  if (onboardingName.trim()) setUserName(onboardingName);
                }}
                disabled={!onboardingName.trim()}
                className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl transition-all hover:scale-105 z-10"
                style={{ background: 'linear-gradient(135deg, #007BFF 0%, #0B006E 100%)' }}
              >
                Comenzar <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- APP PRINCIPAL ---
  const showBottomNav = currentScreen !== 'psychologists';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md h-[800px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden" style={{ borderColor: '#0B006E', borderWidth: '1px' }}>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {renderScreen()}
        </div>

        {/* Bottom Navigation */}
        {showBottomNav && (
          <nav className="bg-white border-t px-6 py-3 flex justify-around items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20" style={{ borderColor: 'rgba(11, 0, 110, 0.1)' }}>
            <button
              onClick={() => setCurrentScreen('home')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                currentScreen === 'home' ? 'scale-110 -translate-y-1' : 'opacity-50 hover:opacity-80'
              }`}
              style={{ color: currentScreen === 'home' ? '#007BFF' : '#0B006E' }}
            >
              <HomeIcon className={`w-6 h-6 ${currentScreen === 'home' ? 'fill-current' : ''}`} />
              <span className="text-xs font-medium">Inicio</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('tasks')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                currentScreen === 'tasks' ? 'scale-110 -translate-y-1' : 'opacity-50 hover:opacity-80'
              }`}
              style={{ color: currentScreen === 'tasks' ? '#007BFF' : '#0B006E' }}
            >
              <CheckSquare className={`w-6 h-6 ${currentScreen === 'tasks' ? 'fill-current' : ''}`} />
              <span className="text-xs font-medium">Tareas</span>
            </button>

            <button
              onClick={() => setCurrentScreen('chat')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 relative`}
            >
              <div 
                className={`w-14 h-14 rounded-full flex items-center justify-center -mt-8 shadow-lg transition-all duration-300 ${
                  currentScreen === 'chat' ? 'scale-110 ring-4 ring-white' : 'hover:scale-105'
                }`}
                style={{ 
                  background: currentScreen === 'chat' 
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                    : 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)'
                }}
              >
                <MessageCircle className="w-7 h-7" style={{ color: currentScreen === 'chat' ? '#ffffff' : '#059669' }} />
              </div>
              <span className="text-xs mt-1 font-medium" style={{ color: currentScreen === 'chat' ? '#10b981' : '#0B006E', opacity: currentScreen === 'chat' ? 1 : 0.5 }}>Chat IA</span>
            </button>

            <button
              onClick={() => setCurrentScreen('rewards')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                currentScreen === 'rewards' ? 'scale-110 -translate-y-1' : 'opacity-50 hover:opacity-80'
              }`}
              style={{ color: currentScreen === 'rewards' ? '#F59E0B' : '#0B006E' }}
            >
              <Gift className={`w-6 h-6 ${currentScreen === 'rewards' ? 'fill-current' : ''}`} />
              <span className="text-xs font-medium">Premios</span>
            </button>

            <button
              onClick={() => setCurrentScreen('profile')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                currentScreen === 'profile' ? 'scale-110 -translate-y-1' : 'opacity-50 hover:opacity-80'
              }`}
              style={{ color: currentScreen === 'profile' ? '#8B5CF6' : '#0B006E' }}
            >
              <User className={`w-6 h-6 ${currentScreen === 'profile' ? 'fill-current' : ''}`} />
              <span className="text-xs font-medium">Perfil</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}