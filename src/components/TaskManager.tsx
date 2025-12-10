import { useState } from 'react';
import { Plus, Check, Trash2, Calendar, Coins, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  reward: number;
  dueDate: string;
}

interface TaskManagerProps {
  tasks: Task[];
  onComplete: (taskId: string) => void;
  onAdd: (title: string, reward: number, dueDate: string) => void;
  onDelete: (taskId: string) => void;
}

export function TaskManager({ tasks, onComplete, onAdd, onDelete }: TaskManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskReward, setNewTaskReward] = useState('30');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const handleAddTask = () => {
    if (newTaskTitle.trim() && newTaskReward && newTaskDueDate) {
      onAdd(newTaskTitle, parseInt(newTaskReward), newTaskDueDate);
      setNewTaskTitle('');
      setNewTaskReward('30');
      setNewTaskDueDate('');
      setIsDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }
  };

  const isOverdue = (dateString: string, completed: boolean) => {
    if (completed) return false;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const totalPotentialReward = pendingTasks.reduce((sum, task) => sum + task.reward, 0);

  return (
    <div className="min-h-full relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #DBEAFE 0%, #BFDBFE 50%, #93C5FD 100%)' }}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #007BFF 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #0066CC 0%, transparent 70%)' }} />
      
      <div className="relative z-10 p-6 space-y-6">
        {/* Header mejorado */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-2" style={{ color: '#1E3A8A', fontWeight: 700 }}>📋 Mis Tareas</h1>
              <p className="text-sm" style={{ color: '#1E40AF', fontWeight: 500 }}>
                Organiza tu día y gana recompensas
              </p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-0" style={{ background: 'linear-gradient(135deg, #007BFF 0%, #0066CC 100%)' }}>
                  <Plus className="w-5 h-5 mr-1" />
                  Nueva
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90%] max-w-md rounded-3xl border-0 shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl" style={{ color: '#1E3A8A', fontWeight: 700 }}>➕ Agregar Nueva Tarea</DialogTitle>
                </DialogHeader>
                <div className="space-y-5 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-title" className="text-sm" style={{ color: '#1E3A8A', fontWeight: 600 }}>Título de la tarea</Label>
                    <Input
                      id="task-title"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Ej: Estudiar para examen de Historia"
                      className="border-2 rounded-xl py-3"
                      style={{ borderColor: '#007BFF' }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="task-reward" className="text-sm" style={{ color: '#1E3A8A', fontWeight: 600 }}>Recompensa (monedas)</Label>
                    <Input
                      id="task-reward"
                      type="number"
                      value={newTaskReward}
                      onChange={(e) => setNewTaskReward(e.target.value)}
                      placeholder="30"
                      min="1"
                      className="border-2 rounded-xl py-3"
                      style={{ borderColor: '#007BFF' }}
                    />
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: '#E0E7FF' }}>
                      <Sparkles className="w-4 h-4" style={{ color: '#6366F1' }} />
                      <p className="text-xs" style={{ color: '#4C1D95', fontWeight: 500 }}>
                        La IA sugerirá recompensas según el esfuerzo
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task-date" className="text-sm" style={{ color: '#1E3A8A', fontWeight: 600 }}>Fecha límite</Label>
                    <Input
                      id="task-date"
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className="border-2 rounded-xl py-3"
                      style={{ borderColor: '#007BFF' }}
                    />
                  </div>

                  <Button 
                    onClick={handleAddTask}
                    className="w-full h-14 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-0"
                    style={{ background: 'linear-gradient(135deg, #007BFF 0%, #0066CC 100%)' }}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Agregar Tarea
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 border-0 shadow-lg transform transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #FEE2E2 0%, #FCA5A5 100%)' }}>
              <div className="text-center">
                <Target className="w-6 h-6 mx-auto mb-2" style={{ color: '#991B1B' }} />
                <p className="text-2xl mb-1" style={{ color: '#7F1D1D', fontWeight: 700 }}>{pendingTasks.length}</p>
                <p className="text-xs" style={{ color: '#991B1B', fontWeight: 500 }}>Pendientes</p>
              </div>
            </Card>

            <Card className="p-4 border-0 shadow-lg transform transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #D1FAE5 0%, #6EE7B7 100%)' }}>
              <div className="text-center">
                <TrendingUp className="w-6 h-6 mx-auto mb-2" style={{ color: '#065F46' }} />
                <p className="text-2xl mb-1" style={{ color: '#064E3B', fontWeight: 700 }}>{completedTasks.length}</p>
                <p className="text-xs" style={{ color: '#065F46', fontWeight: 500 }}>Completadas</p>
              </div>
            </Card>

            <Card className="p-4 border-0 shadow-lg transform transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' }}>
              <div className="text-center">
                <Coins className="w-6 h-6 mx-auto mb-2" style={{ color: '#92400E' }} />
                <p className="text-2xl mb-1" style={{ color: '#78350F', fontWeight: 700 }}>{totalPotentialReward}</p>
                <p className="text-xs" style={{ color: '#92400E', fontWeight: 500 }}>Por Ganar</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-xl" style={{ color: '#1E3A8A', fontWeight: 600 }}>🎯 Pendientes</h2>
              <div className="px-3 py-1 rounded-full" style={{ backgroundColor: '#DBEAFE' }}>
                <span className="text-xs" style={{ color: '#1E40AF', fontWeight: 600 }}>{pendingTasks.length}</span>
              </div>
            </div>
            
            {pendingTasks.map((task) => (
              <Card 
                key={task.id} 
                className={`p-5 transition-all hover:shadow-xl transform hover:scale-[1.02] border-0 shadow-lg ${
                  isOverdue(task.dueDate, task.completed) ? '' : ''
                }`}
                style={{ 
                  background: isOverdue(task.dueDate, task.completed) 
                    ? 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)' 
                    : 'white'
                }}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => onComplete(task.id)}
                    className="w-12 h-12 rounded-2xl border-3 flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 shadow-md"
                    style={{ 
                      borderColor: isOverdue(task.dueDate, task.completed) ? '#EF4444' : '#007BFF',
                      borderWidth: '3px',
                      backgroundColor: 'white'
                    }}
                  >
                    <Check className="w-6 h-6 text-transparent hover:text-green-500 transition-colors" />
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <p className="mb-3" style={{ color: '#0B006E', fontWeight: 600 }}>{task.title}</p>
                    
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl shadow-sm" style={{ 
                        backgroundColor: isOverdue(task.dueDate, task.completed) ? '#FEE2E2' : '#E0E7FF' 
                      }}>
                        <Calendar className="w-4 h-4" style={{ color: isOverdue(task.dueDate, task.completed) ? '#DC2626' : '#6366F1' }} />
                        <span className="text-sm" style={{ 
                          color: isOverdue(task.dueDate, task.completed) ? '#991B1B' : '#4C1D95',
                          fontWeight: 600
                        }}>
                          {formatDate(task.dueDate)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl shadow-sm" style={{ backgroundColor: '#FEF3C7' }}>
                        <Coins className="w-4 h-4" style={{ color: '#D97706' }} />
                        <span className="text-sm" style={{ color: '#92400E', fontWeight: 600 }}>
                          +{task.reward} monedas
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onDelete(task.id)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 hover:bg-red-100"
                    style={{ color: '#DC2626' }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-xl" style={{ color: '#1E3A8A', fontWeight: 600 }}>✅ Completadas</h2>
              <div className="px-3 py-1 rounded-full" style={{ backgroundColor: '#D1FAE5' }}>
                <span className="text-xs" style={{ color: '#065F46', fontWeight: 600 }}>{completedTasks.length}</span>
              </div>
            </div>
            
            {completedTasks.map((task) => (
              <Card key={task.id} className="p-5 border-0 shadow-md" style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #D1FAE5 100%)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="line-through mb-2" style={{ color: '#065F46', opacity: 0.7, fontWeight: 500 }}>{task.title}</p>
                    
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl inline-flex shadow-sm" style={{ backgroundColor: '#ECFDF5' }}>
                      <Coins className="w-4 h-4" style={{ color: '#059669' }} />
                      <span className="text-sm" style={{ color: '#065F46', fontWeight: 600 }}>
                        +{task.reward} monedas ganadas
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDelete(task.id)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 hover:bg-red-100"
                    style={{ color: '#DC2626', opacity: 0.5 }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform hover:scale-105 transition-transform" style={{ background: 'linear-gradient(135deg, #007BFF 0%, #0066CC 100%)' }}>
              <Target className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl mb-3" style={{ color: '#1E3A8A', fontWeight: 700 }}>No hay tareas todavía</h3>
            <p className="text-sm mb-6" style={{ color: '#1E40AF', fontWeight: 500 }}>
              Agrega tu primera tarea y empieza a ganar monedas
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-0"
              style={{ background: 'linear-gradient(135deg, #007BFF 0%, #0066CC 100%)' }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Crear mi primera tarea
            </Button>
          </div>
        )}

        {/* Motivational Card */}
        {pendingTasks.length > 0 && (
          <Card className="p-5 rounded-2xl border-0 shadow-lg" style={{ background: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)' }}>
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#6366F1' }} />
              <div>
                <h3 className="mb-2" style={{ color: '#4C1D95', fontWeight: 600 }}>¡Sigue así!</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#5B21B6', fontWeight: 500 }}>
                  Cada tarea completada es un paso más hacia tus metas. ¡Puedes ganar {totalPotentialReward} monedas más! 💪
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}