import { useState } from 'react';
import { Plus, Check, Trash2, Calendar, Coins, Sparkles, Target, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskReward, setNewTaskReward] = useState('30');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(null);

  const handleAddTask = () => {
    if (newTaskTitle.trim() && newTaskDueDate) {
      const reward = getPriorityReward(newTaskPriority);
      onAdd(newTaskTitle, reward, newTaskDueDate);
      setNewTaskTitle('');
      setNewTaskReward('30');
      setNewTaskDueDate('');
      setNewTaskPriority('medium');
      setIsDialogOpen(false);
    }
  };

  const getPriorityReward = (priority: 'high' | 'medium' | 'low'): number => {
    switch(priority) {
      case 'high':
        return 100;
      case 'medium':
        return 50;
      case 'low':
        return 20;
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

  const getPriority = (reward: number): 'high' | 'medium' | 'low' => {
    if (reward >= 100) return 'high';
    if (reward >= 50) return 'medium';
    return 'low';
  };

  const sortTasksByDate = (taskList: Task[]) => {
    return [...taskList].sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const filterTasksByPriority = (taskList: Task[], filter: 'all' | 'high' | 'medium' | 'low') => {
    if (filter === 'all') return taskList;
    return taskList.filter(task => getPriority(task.reward) === filter);
  };

  let pendingTasks = tasks.filter(t => !t.completed);
  pendingTasks = sortTasksByDate(pendingTasks);
  pendingTasks = filterTasksByPriority(pendingTasks, priorityFilter);

  const completedTasks = tasks.filter(t => t.completed);
  const totalPotentialReward = tasks.filter(t => !t.completed).reduce((sum, task) => sum + task.reward, 0);

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return { bg: '#FEE2E2', text: '#991B1B', badge: '#DC2626' };
      case 'medium':
        return { bg: '#FEF3C7', text: '#92400E', badge: '#F59E0B' };
      case 'low':
        return { bg: '#DBEAFE', text: '#1E40AF', badge: '#3B82F6' };
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const tasksInMonth = (date: Date) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.getMonth() === month && taskDate.getFullYear() === year && !task.completed;
    });
  };

  const getTasksForDate = (day: number) => {
    const dateStr = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(task => task.dueDate === dateStr && !task.completed);
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

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
                    <Label className="text-sm" style={{ color: '#1E3A8A', fontWeight: 600 }}>Prioridad</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['high', 'medium', 'low'] as const).map(priority => {
                        const colors = getPriorityColor(priority);
                        const labels = { high: '⭐ ALTA', medium: '⭐ MEDIA', low: '⭐ BAJA' };
                        return (
                          <button
                            key={priority}
                            onClick={() => setNewTaskPriority(priority)}
                            className="p-3 rounded-xl border-2 transition-all transform hover:scale-105 font-bold text-sm"
                            style={{
                              backgroundColor: newTaskPriority === priority ? colors.bg : '#F8FAFC',
                              color: newTaskPriority === priority ? colors.text : '#64748B',
                              borderColor: newTaskPriority === priority ? colors.badge : '#E2E8F0'
                            }}
                          >
                            {labels[priority]}
                          </button>
                        );
                      })}
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
                    {newTaskDueDate && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: '#DBEAFE' }}>
                        <Calendar className="w-4 h-4" style={{ color: '#007BFF' }} />
                        <p className="text-xs font-medium" style={{ color: '#0B006E' }}>
                          {new Date(newTaskDueDate).toLocaleDateString('es-ES', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                          })}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Retroalimentación visual de la tarea */}
                  {newTaskTitle.trim() && newTaskDueDate && (
                    <div className="p-4 rounded-xl border-2" style={{ 
                      backgroundColor: getPriorityColor(newTaskPriority).bg,
                      borderColor: getPriorityColor(newTaskPriority).badge
                    }}>
                      <p className="text-xs mb-2" style={{ color: '#64748B', fontWeight: 500 }}>
                        📋 Vista previa de tu tarea:
                      </p>
                      <p className="font-bold mb-2" style={{ color: getPriorityColor(newTaskPriority).text }}>
                        {newTaskTitle}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-1 rounded text-xs font-bold" style={{ 
                          backgroundColor: getPriorityColor(newTaskPriority).badge,
                          color: 'white'
                        }}>
                          ⭐ {newTaskPriority === 'high' ? 'ALTA' : newTaskPriority === 'medium' ? 'MEDIA' : 'BAJA'}
                        </div>
                        <div className="px-2 py-1 rounded text-xs font-bold" style={{ 
                          backgroundColor: '#FEF3C7',
                          color: '#92400E'
                        }}>
                          🪙 +{getPriorityReward(newTaskPriority)} monedas
                        </div>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleAddTask}
                    disabled={!newTaskTitle.trim() || !newTaskDueDate}
                    className="w-full h-14 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <p className="text-2xl mb-1" style={{ color: '#7F1D1D', fontWeight: 700 }}>{tasks.filter(t => !t.completed).length}</p>
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

          {/* Filters and Calendar */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: '#1E3A8A', fontWeight: 600 }}>Filtrar:</span>
              <Button
                onClick={() => setPriorityFilter('all')}
                className={`rounded-full shadow-md transition-all text-xs font-600 ${
                  priorityFilter === 'all' 
                    ? 'border-2 scale-105' 
                    : 'border-0'
                }`}
                style={{
                  background: priorityFilter === 'all' ? 'linear-gradient(135deg, #007BFF 0%, #0066CC 100%)' : 'white',
                  color: priorityFilter === 'all' ? 'white' : '#1E3A8A',
                  borderColor: priorityFilter === 'all' ? '#0066CC' : 'transparent'
                }}
              >
                Todas
              </Button>
              <Button
                onClick={() => setPriorityFilter('high')}
                className={`rounded-full shadow-md transition-all text-xs font-600 ${
                  priorityFilter === 'high' 
                    ? 'border-2 scale-105' 
                    : 'border-0'
                }`}
                style={{
                  background: priorityFilter === 'high' ? '#DC2626' : 'white',
                  color: priorityFilter === 'high' ? 'white' : '#991B1B',
                  borderColor: priorityFilter === 'high' ? '#DC2626' : 'transparent'
                }}
              >
                Alta
              </Button>
              <Button
                onClick={() => setPriorityFilter('medium')}
                className={`rounded-full shadow-md transition-all text-xs font-600 ${
                  priorityFilter === 'medium' 
                    ? 'border-2 scale-105' 
                    : 'border-0'
                }`}
                style={{
                  background: priorityFilter === 'medium' ? '#F59E0B' : 'white',
                  color: priorityFilter === 'medium' ? 'white' : '#92400E',
                  borderColor: priorityFilter === 'medium' ? '#F59E0B' : 'transparent'
                }}
              >
                Media
              </Button>
              <Button
                onClick={() => setPriorityFilter('low')}
                className={`rounded-full shadow-md transition-all text-xs font-600 ${
                  priorityFilter === 'low' 
                    ? 'border-2 scale-105' 
                    : 'border-0'
                }`}
                style={{
                  background: priorityFilter === 'low' ? '#3B82F6' : 'white',
                  color: priorityFilter === 'low' ? 'white' : '#1E40AF',
                  borderColor: priorityFilter === 'low' ? '#3B82F6' : 'transparent'
                }}
              >
                Baja
              </Button>
            </div>

            <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-0" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' }}>
                  <Calendar className="w-5 h-5 mr-1" />
                  Calendario
                </Button>
              </DialogTrigger>
              <DialogContent className="w-screen h-screen max-w-none max-h-none rounded-0 border-0 shadow-2xl p-0 flex flex-col">
                <div className="p-4 border-b" style={{ borderColor: '#E0E7FF' }}>
                  <DialogHeader className="mb-0">
                    <DialogTitle className="text-lg" style={{ color: '#1E3A8A', fontWeight: 700 }}>📅 Calendario</DialogTitle>
                  </DialogHeader>
                </div>
                
                <div className="flex-1 p-4 overflow-hidden flex flex-col">
                  {/* Calendar Navigation */}
                  <div className="flex items-center justify-between mb-3 flex-shrink-0">
                    <Button
                      onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                      className="rounded-lg border-0 shadow-md px-2 py-1"
                      style={{ background: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)' }}
                    >
                      <ChevronLeft className="w-4 h-4" style={{ color: '#6366F1' }} />
                    </Button>
                    <h3 className="text-base font-bold" style={{ color: '#1E3A8A', minWidth: '150px', textAlign: 'center' }}>
                      {monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                    </h3>
                    <Button
                      onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                      className="rounded-lg border-0 shadow-md px-2 py-1"
                      style={{ background: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)' }}
                    >
                      <ChevronRight className="w-4 h-4" style={{ color: '#6366F1' }} />
                    </Button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="border rounded-lg overflow-hidden flex-1 flex flex-row" style={{ borderColor: '#E0E7FF' }}>
                    {/* Left: Calendar */}
                    <div className="flex-1 flex flex-col">
                      <div 
                        className="grid gap-0 flex-1" 
                        style={{
                          gridTemplateColumns: 'repeat(7, 1fr)',
                          gridAutoRows: 'auto'
                        }}
                      >
                        {/* Day headers */}
                        {dayNames.map(day => (
                          <div 
                            key={`header-${day}`} 
                            className="py-2 text-center border-b text-xs font-bold"
                            style={{ 
                              backgroundColor: '#E0E7FF',
                              color: '#1E3A8A',
                              borderColor: '#C7D2FE'
                            }}
                          >
                            {day}
                          </div>
                        ))}
                        
                        {/* Empty cells before first day */}
                        {Array.from({ length: getFirstDayOfMonth(calendarMonth) }).map((_, idx) => (
                          <div 
                            key={`empty-${idx}`} 
                            className="border-r border-b p-2 min-h-24"
                            style={{ backgroundColor: '#F8FAFC', borderColor: '#E0E7FF' }}
                          />
                        ))}
                        
                        {/* Days of month */}
                        {Array.from({ length: getDaysInMonth(calendarMonth) }).map((_, idx) => {
                          const day = idx + 1;
                          const dayTasks = getTasksForDate(day);
                          const today = new Date();
                          const isToday = day === today.getDate() && 
                                         calendarMonth.getMonth() === today.getMonth() &&
                                         calendarMonth.getFullYear() === today.getFullYear();
                          const isSelected = selectedCalendarDay === day;
                          
                          return (
                            <div
                              key={day}
                              onClick={() => setSelectedCalendarDay(day)}
                              className="border-r border-b p-3 transition-all cursor-pointer min-h-24 flex flex-col hover:bg-blue-50"
                              style={{ 
                                backgroundColor: isSelected ? '#C7D2FE' : isToday ? '#DBEAFE' : 'white',
                                borderColor: '#E0E7FF',
                                borderLeft: isSelected ? '4px solid #6366F1' : 'none'
                              }}
                            >
                              <div 
                                className="font-bold mb-3"
                                style={{ color: isToday ? '#007BFF' : '#1E3A8A', fontSize: '0.9rem' }}
                              >
                                {day}
                              </div>
                              <div className="flex-1 flex items-center justify-center gap-1.5">
                                {dayTasks.length > 0 ? (
                                  <div className="flex gap-1">
                                    {dayTasks.map((task, index) => (
                                      <div
                                        key={`${task.id}-dot`}
                                        className="w-2 h-2 rounded-full"
                                        style={{
                                          backgroundColor: getPriorityColor(getPriority(task.reward)).badge
                                        }}
                                      />
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-xs" style={{ color: '#CBD5E1' }}>—</div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: Task Details Panel */}
                    {selectedCalendarDay && (
                      <div className="w-80 border-l flex flex-col" style={{ borderColor: '#E0E7FF', backgroundColor: '#F8FAFC' }}>
                        {/* Panel Header */}
                        <div className="p-4 border-b" style={{ borderColor: '#E0E7FF' }}>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold" style={{ color: '#1E3A8A' }}>
                              {new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), selectedCalendarDay).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                              })}
                            </h3>
                            <button
                              onClick={() => setSelectedCalendarDay(null)}
                              className="text-lg font-bold transition-colors hover:text-red-500"
                              style={{ color: '#64748B' }}
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {/* Task List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                          {getTasksForDate(selectedCalendarDay).length > 0 ? (
                            getTasksForDate(selectedCalendarDay).map(task => {
                              const priority = getPriority(task.reward);
                              const priorityColor = getPriorityColor(priority);
                              const priorityLabel = { high: 'ALTA', medium: 'MEDIA', low: 'BAJA' }[priority];
                              
                              return (
                                <div
                                  key={task.id}
                                  className="p-3 rounded-lg border-l-4"
                                  style={{
                                    backgroundColor: 'white',
                                    borderLeftColor: priorityColor.badge,
                                    borderColor: '#E0E7FF'
                                  }}
                                >
                                  <p className="font-bold text-sm mb-2" style={{ color: '#0B006E' }}>
                                    {task.title}
                                  </p>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <div className="px-2 py-1 rounded text-xs font-bold" style={{
                                      backgroundColor: priorityColor.bg,
                                      color: priorityColor.text
                                    }}>
                                      ⭐ {priorityLabel}
                                    </div>
                                    <div className="px-2 py-1 rounded text-xs font-bold" style={{
                                      backgroundColor: '#FEF3C7',
                                      color: '#92400E'
                                    }}>
                                      🪙 {task.reward}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center py-8">
                              <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
                                Sin tareas en este día
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
            
            {pendingTasks.map((task) => {
              const priority = getPriority(task.reward);
              const priorityColor = getPriorityColor(priority);
              const priorityLabel = { high: 'ALTA', medium: 'MEDIA', low: 'BAJA' }[priority];
              const taskDate = new Date(task.dueDate);
              const dayOfWeek = taskDate.toLocaleDateString('es-ES', { weekday: 'short' });
              const dateFormat = taskDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
              
              return (
              <Card 
                key={task.id} 
                className={`p-0 transition-all hover:shadow-xl transform hover:scale-[1.02] border-0 shadow-lg overflow-hidden border-l-4`}
                style={{ 
                  borderLeftColor: priorityColor.badge
                }}
              >
                {/* Encabezado con fecha y hora */}
                <div className="px-5 py-3" style={{ backgroundColor: priorityColor.bg }}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="text-xs font-bold" style={{ color: priorityColor.text, textTransform: 'uppercase' }}>
                          {dayOfWeek}
                        </div>
                        <div className="text-sm font-bold" style={{ color: priorityColor.text }}>
                          {dateFormat}
                        </div>
                      </div>
                      <div className="text-2xl">📅</div>
                    </div>
                    <div className="text-right text-xs font-600" style={{ color: priorityColor.text }}>
                      {isOverdue(task.dueDate, task.completed) ? '⚠️ Vencida' : '⏳ Por hacer'}
                    </div>
                  </div>
                </div>

                {/* Contenido principal */}
                <div className="px-5 py-4">
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
                      <p className="mb-3 text-lg" style={{ color: '#0B006E', fontWeight: 600 }}>{task.title}</p>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl shadow-sm" style={{ backgroundColor: priorityColor.bg }}>
                          <span className="text-xs font-bold" style={{ color: priorityColor.text }}>
                            ⭐ {priorityLabel}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl shadow-sm" style={{ backgroundColor: '#FEF3C7' }}>
                          <Coins className="w-4 h-4" style={{ color: '#D97706' }} />
                          <span className="text-sm font-bold" style={{ color: '#92400E' }}>
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
                </div>
              </Card>
            );
            })}
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
        {tasks.filter(t => !t.completed).length > 0 && (
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