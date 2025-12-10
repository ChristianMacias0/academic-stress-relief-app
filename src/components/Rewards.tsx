import { useState } from 'react';
import { Plus, Coins, Trash2, Sparkles, CheckCircle2 } from 'lucide-react'; // Agregamos icono de Check
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "./ui/alert-dialog";
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface Reward {
  id: string;
  title: string;
  cost: number;
  icon: string;
}

interface RewardsProps {
  rewards: Reward[];
  coins: number;
  onRedeem: (rewardId: string) => boolean;
  onAdd: (title: string, cost: number, icon: string) => void;
  onDelete: (rewardId: string) => void;
}

export function Rewards({ rewards, coins, onRedeem, onAdd, onDelete }: RewardsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRewardTitle, setNewRewardTitle] = useState('');
  const [newRewardCost, setNewRewardCost] = useState('50');
  const [newRewardIcon, setNewRewardIcon] = useState('🎁');

  // Estado para la confirmación de canje (Paso 1)
  const [rewardToRedeem, setRewardToRedeem] = useState<Reward | null>(null);

  // Estado para el mensaje de éxito y saldo (Paso 2)
  const [successData, setSuccessData] = useState<{ title: string; spent: number; remaining: number } | null>(null);

  const emojiOptions = ['🎬', '🎮', '👥', '🍕', '☕', '📚', '🎵', '🎨', '⚽', '🎯', '🍰', '🎪'];

  const handleAddReward = () => {
    if (newRewardTitle.trim() && newRewardCost) {
      onAdd(newRewardTitle, parseInt(newRewardCost), newRewardIcon);
      setNewRewardTitle('');
      setNewRewardCost('50');
      setNewRewardIcon('🎁');
      setIsDialogOpen(false);
      toast.success('¡Recompensa agregada!');
    }
  };

  const confirmRedeem = () => {
    if (rewardToRedeem) {
      // Intentamos canjear
      const success = onRedeem(rewardToRedeem.id);
      
      if (success) {
        // Si fue exitoso:
        // 1. Calculamos el saldo restante (Monedas actuales - costo)
        // Nota: Usamos 'coins' actual porque el prop podría tardar milisegundos en actualizarse visualmente
        const remaining = coins - rewardToRedeem.cost;
        
        // 2. Preparamos los datos para la segunda ventana emergente
        setSuccessData({
          title: rewardToRedeem.title,
          spent: rewardToRedeem.cost,
          remaining: remaining
        });
      } else {
        toast.error('No tienes suficientes monedas para esta recompensa');
      }
      
      // Cerramos la ventana de confirmación (Paso 1)
      setRewardToRedeem(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header con balance */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#0B006E' }}>Mis Recompensas</h1>
            <p className="text-sm mt-1" style={{ color: '#0B006E', opacity: 0.7 }}>
              Canjea tus monedas por premios
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full hover:opacity-90 shadow-md" style={{ backgroundColor: '#F59E0B' }}>
                <Plus className="w-5 h-5 mr-1" />
                Nueva
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90%] max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle style={{ color: '#0B006E' }}>Crear Nueva Recompensa</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="reward-title" style={{ color: '#0B006E' }}>Nombre de la recompensa</Label>
                  <Input
                    id="reward-title"
                    value={newRewardTitle}
                    onChange={(e) => setNewRewardTitle(e.target.value)}
                    placeholder="Ej: Ver una película"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reward-cost" style={{ color: '#0B006E' }}>Costo (monedas)</Label>
                  <Input
                    id="reward-cost"
                    type="number"
                    value={newRewardCost}
                    onChange={(e) => setNewRewardCost(e.target.value)}
                    placeholder="50"
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label style={{ color: '#0B006E' }}>Ícono</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {emojiOptions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setNewRewardIcon(emoji)}
                        className={`w-12 h-12 rounded-lg text-2xl flex items-center justify-center transition-all ${
                          newRewardIcon === emoji
                            ? 'ring-2 scale-110'
                            : 'hover:bg-gray-200'
                        }`}
                        style={{ 
                          backgroundColor: newRewardIcon === emoji ? '#FEF3C7' : '#F1F3F4',
                          borderColor: newRewardIcon === emoji ? '#F59E0B' : 'transparent'
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleAddReward}
                  className="w-full hover:opacity-90"
                  style={{ backgroundColor: '#F59E0B' }}
                >
                  Crear Recompensa
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Balance Card */}
        <Card className="p-5 border-none text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Tu Balance</p>
              <div className="flex items-center gap-2 mt-1">
                <Coins className="w-8 h-8" />
                <span className="text-4xl font-bold">{coins}</span>
              </div>
            </div>
            <Sparkles className="w-12 h-12 text-white/40 animate-pulse" />
          </div>
        </Card>
      </div>

      {/* Rewards Grid */}
      {rewards.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {rewards.map((reward) => {
            const canAfford = coins >= reward.cost;
            return (
              <Card 
                key={reward.id}
                className={`p-4 transition-all border-0 shadow-md ${
                  canAfford 
                    ? 'hover:shadow-lg' 
                    : 'opacity-60 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ backgroundColor: canAfford ? '#FEF3C7' : '#E5E7EB' }}>
                    {reward.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg" style={{ color: '#0B006E' }}>{reward.title}</h3>
                    <div className="flex items-center gap-1 mt-1" style={{ color: canAfford ? '#F59E0B' : '#9CA3AF' }}>
                      <Coins className="w-4 h-4" />
                      <span className="font-medium">{reward.cost} monedas</span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => onDelete(reward.id)}
                      className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    
                    <Button
                      onClick={() => setRewardToRedeem(reward)}
                      disabled={!canAfford}
                      className="hover:opacity-90 disabled:opacity-50 shadow-sm"
                      style={{ backgroundColor: canAfford ? '#F59E0B' : '#9CA3AF' }}
                    >
                      Canjear
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FEF3C7' }}>
            <Plus className="w-10 h-10" style={{ color: '#F59E0B' }} />
          </div>
          <h3 className="mb-2 font-semibold" style={{ color: '#0B006E' }}>No hay recompensas todavía</h3>
          <p className="text-sm" style={{ color: '#0B006E', opacity: 0.7 }}>
            Crea recompensas personalizadas basadas en tus gustos
          </p>
        </div>
      )}

      {/* Info Card */}
      <Card className="p-4 border-0 shadow-sm" style={{ backgroundColor: '#FEF3C7' }}>
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#D97706' }} />
          <div>
            <h3 className="font-semibold" style={{ color: '#92400E' }}>Sistema de Recompensas</h3>
            <p className="text-sm mt-1 leading-relaxed" style={{ color: '#78350F' }}>
              Completa tareas para ganar monedas y canjéalas por las recompensas que más disfrutes.
            </p>
          </div>
        </div>
      </Card>

      {/* VENTANA 1: CONFIRMACIÓN PREVIA */}
      <AlertDialog open={!!rewardToRedeem} onOpenChange={(open) => !open && setRewardToRedeem(null)}>
        <AlertDialogContent className="w-[90%] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: '#0B006E' }}>¿Confirmar Canje?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de gastar <span className="font-bold text-yellow-600">{rewardToRedeem?.cost} monedas</span> en:
              <br />
              <span className="font-bold text-lg mt-2 block text-center" style={{ color: '#0B006E' }}>
                {rewardToRedeem?.icon} {rewardToRedeem?.title}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border-2" style={{ borderColor: '#0B006E', color: '#0B006E' }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRedeem}
              className="rounded-full"
              style={{ backgroundColor: '#F59E0B' }}
            >
              Sí, canjear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* VENTANA 2: MENSAJE EMERGENTE DE SALDO ACTUAL (ÉXITO) */}
      <AlertDialog open={!!successData} onOpenChange={(open) => !open && setSuccessData(null)}>
        <AlertDialogContent className="w-[90%] rounded-2xl border-2" style={{ borderColor: '#10b981' }}>
          <div className="flex flex-col items-center text-center pt-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce" style={{ backgroundColor: '#D1FAE5' }}>
              <CheckCircle2 className="w-8 h-8" style={{ color: '#059669' }} />
            </div>
            <AlertDialogTitle className="text-xl mb-2" style={{ color: '#064E3B' }}>¡Canje Exitoso!</AlertDialogTitle>
            <AlertDialogDescription>
              Disfruta de: <strong>{successData?.title}</strong>
              <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Tu nuevo saldo es:</p>
                <div className="flex items-center justify-center gap-2">
                  <Coins className="w-6 h-6 text-yellow-600" />
                  <span className="text-3xl font-bold text-yellow-600">{successData?.remaining}</span>
                </div>
              </div>
            </AlertDialogDescription>
          </div>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction 
              onClick={() => setSuccessData(null)}
              className="rounded-full w-full sm:w-auto mt-2"
              style={{ backgroundColor: '#10b981' }}
            >
              ¡Genial!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}