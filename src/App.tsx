import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { ChatBot } from './components/ChatBot';
import { TaskManager } from './components/TaskManager';
import { Rewards } from './components/Rewards';
import { Profile } from './components/Profile';
import { PsychologistSearch } from './components/PsychologistSearch';
import { MessageCircle, CheckSquare, Gift, User, Home as HomeIcon, Lock, Eye, EyeOff, ArrowRight, Divide } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './components/ui/dialog';

type Screen = 'home' | 'chat' | 'tasks' | 'rewards' | 'profile' | 'psychologists' | 'events' | 'event-detail' | 'payment';
import Events from './components/Events';
import DetailsEvent from './components/DetailsEvent';
import PagoEvento from './components/PagoEvento';
import { Evento } from './components/eventsData';
export default function App() {
  // --- ESTADOS CON PERSISTENCIA (LocalStorage) ---
  
  // 1. Nombre de Usuario (Login)
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('app_userName') || '';
  });

  // 2. Estado de Términos y Condiciones
  const [acceptedTerms, setAcceptedTerms] = useState(() => {
    return localStorage.getItem('app_terms_accepted') === 'true';
  });

  // 3. Monedas
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem('app_coins');
    return saved ? parseInt(saved) : 150;
  });

  // 4. Tareas
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('app_tasks');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Estudiar para examen de Cálculo', completed: false, reward: 50, dueDate: '2025-12-18' },
      { id: '2', title: 'Entregar proyecto de Programación', completed: false, reward: 80, dueDate: '2025-12-20' },
    ];
  });

  // 5. Recompensas
  const [rewards, setRewards] = useState(() => {
    const saved = localStorage.getItem('app_rewards');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Ver una película', cost: 50, icon: '🎬' },
      { id: '2', title: '1 hora de videojuegos', cost: 40, icon: '🎮' },
      { id: '3', title: 'Salir con amigos', cost: 100, icon: '👥' },
    ];
  });

  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [onboardingName, setOnboardingName] = useState('');

  // --- ESTADOS TEMPORALES PARA LOGIN ---
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);

  // --- EFECTOS PARA GUARDAR CAMBIOS AUTOMÁTICAMENTE ---
  useEffect(() => localStorage.setItem('app_userName', userName), [userName]);
  useEffect(() => localStorage.setItem('app_terms_accepted', String(acceptedTerms)), [acceptedTerms]);
  useEffect(() => localStorage.setItem('app_coins', coins.toString()), [coins]);
  useEffect(() => localStorage.setItem('app_tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('app_rewards', JSON.stringify(rewards)), [rewards]);

  // --- LÓGICA DEL NEGOCIO ---

  const handleLogin = () => {
    if (loginUser.trim()) {
      setUserName(loginUser);
    }
  };

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
          return (
          <Events 
            onSelectEvent={(evento) => {
              setSelectedEvent(evento);
              setCurrentScreen('event-detail');
            }} 
          />
        );
      case 'event-detail':
        return selectedEvent ? (
          <DetailsEvent 
            evento={selectedEvent} 
            onBack={() => setCurrentScreen('rewards')} 
            onPay={() => setCurrentScreen('payment')}
          />
        ) : null;
      case 'payment':
        return selectedEvent ? (
          <PagoEvento 
            precio={selectedEvent.precio} 
            onFinish={() => setCurrentScreen('rewards')} 
          />
        ) : null;
        case 'profile':
        return <Profile userName={userName} coins={coins} tasks={tasks} onNameChange={setUserName} onNavigate={setCurrentScreen} />;
      case 'psychologists':
        return <PsychologistSearch onNavigate={setCurrentScreen} />;
      default:
        return <Home userName={userName} tasks={tasks} onNavigate={setCurrentScreen} />;
    }
  };

  // --- PANTALLA DE LOGIN / TÉRMINOS (Si no hay usuario) ---
  if (!userName) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #E0E7FF 0%, #F5F3FF 100%)' }}>
        
        {/* Decoración de fondo general */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

        {/* --- MODAL DE TÉRMINOS Y CONDICIONES --- */}
        <Dialog open={!acceptedTerms}>
          <DialogContent className="max-w-md rounded-2xl" onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center" style={{ color: '#0B006E' }}>Términos y Condiciones</DialogTitle>
              <DialogDescription className="text-center">
                Debes aceptar los términos para utilizar la aplicación.
              </DialogDescription>
            </DialogHeader>
            
            <div className="h-[300px] w-full rounded-xl border p-5 bg-gray-50/50 text-sm text-gray-600 leading-relaxed overflow-y-auto text-justify shadow-inner">
              <p className="font-bold mb-2 text-blue-900">1. Introducción</p>
              <p className="mb-4">
                Bienvenido a nuestra aplicación de bienestar académico. Al usar esta app, aceptas promover un ambiente seguro y respetuoso. El propósito es ayudar a gestionar el estrés y organizar tareas.
              </p>
              <p className="font-bold mb-2 text-blue-900">2. Privacidad de Datos</p>
              <p className="mb-4">
                Tus datos (nombre, tareas, monedas) se guardan únicamente en tu dispositivo (LocalStorage). No enviamos tu información personal a servidores externos, salvo las conversaciones anónimas con la IA para generar respuestas.
              </p>
              <p className="font-bold mb-2 text-blue-900">3. Uso Responsable</p>
              <p className="mb-4">
                El chatbot es una herramienta de apoyo, no sustituye la terapia profesional. En caso de crisis severa, por favor consulta la sección de "Buscar Ayuda" para contactar a un profesional humano.
              </p>
              <p className="font-bold mb-2 text-blue-900">4. Exención de Responsabilidad</p>
              <p className="mb-4">
                Los desarrolladores no se hacen responsables por decisiones tomadas basándose únicamente en las sugerencias de la IA. Usa tu criterio.
              </p>
            </div>

            <DialogFooter className="sm:justify-center">
              <Button 
                onClick={() => setAcceptedTerms(true)}
                className="w-full sm:w-auto rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
                style={{ background: 'linear-gradient(135deg, #007BFF 0%, #0B006E 100%)' }}
              >
                Aceptar y Continuar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- FORMULARIO DE LOGIN (Estilizado al 75% de ancho) --- */}
        <div className={`w-full max-w-[800px] bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col p-8 sm:p-10 space-y-8 border border-white/50 transition-all duration-500 ${!acceptedTerms ? 'blur-md scale-95 pointer-events-none opacity-50' : 'scale-100 opacity-100'}`}>
          
          {/* Header del Login */}
          <div className="flex flex-col items-center text-center space-y-4" style={{marginTop: "15px"}}>
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-2 transform hover:scale-110 transition-transform duration-300" 
                 style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}>
              <Lock className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1E3A8A' }}>¡Bienvenido de nuevo!</h1>
              <p className="text-sm text-slate-500 mt-2 font-medium">
                Ingresa tus credenciales para acceder
              </p>
            </div>
          </div>

          {/* Campos (Aplicando w-[75%] y mx-auto para centrar y reducir ancho) */}
          <div className="space-y-5 w-[75%] mx-auto">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold ml-1 text-slate-700">
                Usuario
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <Input
                  id="username"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="ej. Estudiante1"
                  className="pl-12 h-12 text-base border-slate-200 bg-slate-50/50 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold ml-1 text-slate-700">
                Contraseña
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  className="pl-12 pr-12 h-12 text-base border-slate-200 bg-slate-50/50 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button 
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors p-1 rounded-md hover:bg-slate-100"
                  type="button"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Botón (Aplicando w-[75%] y mx-auto) */}
          
          
          <div className="pt-2 w-[75%] mx-auto " style={{marginTop: "15px"}}>
            <Button 
              onClick={handleLogin}
              disabled={!loginUser.trim() || !acceptedTerms}
              className="w-full h-12 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)' }}
            >
              Ingresar a mi espacio <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-xs text-slate-400 text-center mt-6">
              *Ingreso simulado: Puedes usar cualquier contraseña.
            </p>
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