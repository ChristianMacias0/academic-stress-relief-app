import { useState } from 'react';
import { User, Coins, TrendingUp, Award, Edit2, Check, X, Heart, Sparkles } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  reward: number;
  dueDate: string;
}

interface ProfileProps {
  userName: string;
  coins: number;
  tasks: Task[];
  onNameChange: (name: string) => void;
  onNavigate: (screen: 'home' | 'chat' | 'tasks' | 'rewards' | 'profile' | 'psychologists') => void;
}

export function Profile({ userName, coins, tasks, onNameChange, onNavigate }: ProfileProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(userName);

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalEarned = tasks.filter(t => t.completed).reduce((sum, task) => sum + task.reward, 0);
  const pendingTasks = tasks.filter(t => !t.completed).length;

  const handleSaveName = () => {
    if (editedName.trim()) {
      onNameChange(editedName.trim());
      setIsEditingName(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(userName);
    setIsEditingName(false);
  };

  const achievements = [
    { id: '1', title: 'Primera Tarea', description: 'Completaste tu primera tarea', icon: '🎯', unlocked: completedTasks >= 1 },
    { id: '2', title: 'Estudiante Dedicado', description: 'Completaste 5 tareas', icon: '📚', unlocked: completedTasks >= 5 },
    { id: '3', title: 'Coleccionista', description: 'Ganaste 100 monedas', icon: '💰', unlocked: totalEarned >= 100 },
    { id: '4', title: 'Maestro del Tiempo', description: 'Completaste 10 tareas', icon: '⏰', unlocked: completedTasks >= 10 },
  ];

  return (
    <div className="min-h-full relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #EDE9FE 0%, #DDD6FE 50%, #C4B5FD 100%)' }}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-48 h-48 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #A78BFA 0%, transparent 70%)' }} />
      
      <div className="relative z-10 p-6 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-4 pt-4">
          <div className="w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' }}>
            <User className="w-14 h-14 text-white" />
          </div>
          
          <div className="w-full">
            {isEditingName ? (
              <div className="flex items-center gap-2 justify-center">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="max-w-[200px] border-2"
                  style={{ borderColor: '#8B5CF6' }}
                  autoFocus
                />
                <Button
                  onClick={handleSaveName}
                  size="sm"
                  className="hover:opacity-90 shadow-md"
                  style={{ backgroundColor: '#10b981' }}
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  size="sm"
                  variant="outline"
                  className="border-2"
                  style={{ color: '#8B5CF6', borderColor: '#8B5CF6' }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center">
                <h1 className="text-3xl" style={{ color: '#4C1D95', fontWeight: 700 }}>{userName}</h1>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="hover:opacity-70 transition-colors"
                  style={{ color: '#8B5CF6' }}
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
            )}
            <p className="text-sm mt-2" style={{ color: '#6D28D9', fontWeight: 500 }}>Estudiante universitario ✨</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-5 border-0 shadow-lg transform transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-md" style={{ backgroundColor: '#F59E0B' }}>
                <Coins className="w-7 h-7 text-white" />
              </div>
              <p className="text-3xl mb-1" style={{ color: '#92400E', fontWeight: 700 }}>{coins}</p>
              <p className="text-xs" style={{ color: '#78350F', fontWeight: 500 }}>Monedas</p>
            </div>
          </Card>

          <Card className="p-5 border-0 shadow-lg transform transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)' }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-md" style={{ backgroundColor: '#10b981' }}>
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <p className="text-3xl mb-1" style={{ color: '#064E3B', fontWeight: 700 }}>{completedTasks}</p>
              <p className="text-xs" style={{ color: '#065F46', fontWeight: 500 }}>Completadas</p>
            </div>
          </Card>

          <Card className="p-5 border-0 shadow-lg transform transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)' }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-md" style={{ backgroundColor: '#007BFF' }}>
                <Award className="w-7 h-7 text-white" />
              </div>
              <p className="text-3xl mb-1" style={{ color: '#1E3A8A', fontWeight: 700 }}>{pendingTasks}</p>
              <p className="text-xs" style={{ color: '#1E40AF', fontWeight: 500 }}>Pendientes</p>
            </div>
          </Card>

          <Card className="p-5 border-0 shadow-lg transform transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)' }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-md" style={{ backgroundColor: '#8B5CF6' }}>
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <p className="text-3xl mb-1" style={{ color: '#4C1D95', fontWeight: 700 }}>{totalEarned}</p>
              <p className="text-xs" style={{ color: '#5B21B6', fontWeight: 500 }}>Total Ganado</p>
            </div>
          </Card>
        </div>

        {/* Achievements */}
        <div className="space-y-4">
          <h2 className="text-xl" style={{ color: '#4C1D95', fontWeight: 600 }}>🏆 Tus Logros</h2>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`p-4 transition-all border-0 shadow-md ${achievement.unlocked ? 'transform hover:scale-105' : ''}`}
                style={{
                  background: achievement.unlocked 
                    ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' 
                    : 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
                  opacity: achievement.unlocked ? 1 : 0.6
                }}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`text-4xl ${!achievement.unlocked && 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <h3 className="text-sm mb-1" style={{ color: achievement.unlocked ? '#78350F' : '#6B7280', fontWeight: 600 }}>{achievement.title}</h3>
                    <p className="text-xs" style={{ color: achievement.unlocked ? '#92400E' : '#9CA3AF' }}>{achievement.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Motivational message */}
        <Card className="p-5 rounded-2xl border-0 shadow-md" style={{ background: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)' }}>
          <div className="text-center space-y-2">
            <p className="text-sm leading-relaxed" style={{ color: '#4C1D95', fontWeight: 500 }}>
              "El éxito es la suma de pequeños esfuerzos repetidos día tras día."
            </p>
            <p className="text-xs" style={{ color: '#5B21B6', fontWeight: 600 }}>
              ¡Sigue así, {userName}! 💪
            </p>
          </div>
        </Card>

        {/* Buscar Ayuda Button */}
        <Card className="p-5 rounded-2xl border-0 shadow-lg" style={{ background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)' }}>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: '#EF4444' }}>
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1" style={{ color: '#7F1D1D', fontWeight: 600 }}>¿Necesitas apoyo profesional?</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#991B1B' }}>
                  Tu salud mental es importante. No estás solo/a, hay profesionales listos para ayudarte.
                </p>
              </div>
            </div>
            <Button
              onClick={() => onNavigate('psychologists')}
              className="w-full h-14 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-0"
              style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: 'white' }}
            >
              <Heart className="w-5 h-5 mr-2" />
              <span className="text-lg">Buscar Ayuda Profesional</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}