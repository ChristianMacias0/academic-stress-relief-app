import { useState } from 'react';
import { Home } from './components/Home';
import { ChatBot } from './components/ChatBot';
import { TaskManager } from './components/TaskManager';
import { Rewards } from './components/Rewards';
import { Profile } from './components/Profile';
import { PsychologistSearch } from './components/PsychologistSearch';
import { MessageCircle, CheckSquare, Gift, User, Home as HomeIcon } from 'lucide-react';

type Screen = 'home' | 'chat' | 'tasks' | 'rewards' | 'profile' | 'psychologists';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [coins, setCoins] = useState(150);
  const [userName, setUserName] = useState('Ana');
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Estudiar para examen de Cálculo', completed: false, reward: 50, dueDate: '2025-11-18' },
    { id: '2', title: 'Entregar proyecto de Programación', completed: false, reward: 80, dueDate: '2025-11-20' },
    { id: '3', title: 'Leer capítulo 5 de Física', completed: false, reward: 30, dueDate: '2025-11-17' },
  ]);
  const [rewards, setRewards] = useState([
    { id: '1', title: 'Ver una película', cost: 50, icon: '🎬' },
    { id: '2', title: '1 hora de videojuegos', cost: 40, icon: '🎮' },
    { id: '3', title: 'Salir con amigos', cost: 100, icon: '👥' },
    { id: '4', title: 'Comprar un snack favorito', cost: 30, icon: '🍕' },
  ]);

  const completeTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: true } : t));
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
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const redeemReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
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
    setRewards(rewards.filter(r => r.id !== rewardId));
  };

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

  // Hide bottom nav on psychologists screen
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
          <nav className="bg-white border-t px-6 py-3 flex justify-around items-center shadow-lg" style={{ borderColor: 'rgba(11, 0, 110, 0.1)' }}>
            <button
              onClick={() => setCurrentScreen('home')}
              className={`flex flex-col items-center gap-1 transition-all ${
                currentScreen === 'home' ? 'scale-110' : 'opacity-50'
              }`}
              style={{ color: currentScreen === 'home' ? '#007BFF' : '#0B006E' }}
            >
              <HomeIcon className={`w-6 h-6 ${currentScreen === 'home' ? 'fill-current' : ''}`} />
              <span className="text-xs">Inicio</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('tasks')}
              className={`flex flex-col items-center gap-1 transition-all ${
                currentScreen === 'tasks' ? 'scale-110' : 'opacity-50'
              }`}
              style={{ color: currentScreen === 'tasks' ? '#007BFF' : '#0B006E' }}
            >
              <CheckSquare className={`w-6 h-6 ${currentScreen === 'tasks' ? 'fill-current' : ''}`} />
              <span className="text-xs">Tareas</span>
            </button>

            <button
              onClick={() => setCurrentScreen('chat')}
              className={`flex flex-col items-center gap-1 transition-all relative`}
            >
              <div 
                className={`w-14 h-14 rounded-full flex items-center justify-center -mt-8 shadow-lg transition-all ${
                  currentScreen === 'chat' ? 'scale-110' : ''
                }`}
                style={{ 
                  background: currentScreen === 'chat' 
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                    : 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)'
                }}
              >
                <MessageCircle className="w-7 h-7" style={{ color: currentScreen === 'chat' ? '#ffffff' : '#059669' }} />
              </div>
              <span className="text-xs mt-1" style={{ color: currentScreen === 'chat' ? '#10b981' : '#0B006E', opacity: currentScreen === 'chat' ? 1 : 0.5 }}>Chat IA</span>
            </button>

            <button
              onClick={() => setCurrentScreen('rewards')}
              className={`flex flex-col items-center gap-1 transition-all ${
                currentScreen === 'rewards' ? 'scale-110' : 'opacity-50'
              }`}
              style={{ color: currentScreen === 'rewards' ? '#F59E0B' : '#0B006E' }}
            >
              <Gift className={`w-6 h-6 ${currentScreen === 'rewards' ? 'fill-current' : ''}`} />
              <span className="text-xs">Premios</span>
            </button>

            <button
              onClick={() => setCurrentScreen('profile')}
              className={`flex flex-col items-center gap-1 transition-all ${
                currentScreen === 'profile' ? 'scale-110' : 'opacity-50'
              }`}
              style={{ color: currentScreen === 'profile' ? '#8B5CF6' : '#0B006E' }}
            >
              <User className={`w-6 h-6 ${currentScreen === 'profile' ? 'fill-current' : ''}`} />
              <span className="text-xs">Perfil</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}