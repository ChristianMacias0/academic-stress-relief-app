import { useState } from 'react';
import { Plus, Coins, Trash2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';

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

  const handleRedeem = (reward: Reward) => {
    const success = onRedeem(reward.id);
    if (success) {
      toast.success(`¡Has canjeado "${reward.title}"! Disfrútalo 🎉`);
    } else {
      toast.error('No tienes suficientes monedas para esta recompensa');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header con balance */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ color: '#0B006E' }}>Mis Recompensas</h1>
            <p className="text-sm mt-1" style={{ color: '#0B006E', opacity: 0.7 }}>
              Canjea tus monedas por premios
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full hover:opacity-90" style={{ backgroundColor: '#F59E0B' }}>
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
                            ? 'ring-2'
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
        <Card className="p-5 border-none text-white" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Tu Balance</p>
              <div className="flex items-center gap-2 mt-1">
                <Coins className="w-7 h-7" />
                <span className="text-3xl">{coins}</span>
              </div>
            </div>
            <Sparkles className="w-12 h-12 text-white/40" />
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
                className={`p-4 transition-all ${
                  canAfford 
                    ? 'hover:shadow-lg cursor-pointer' 
                    : 'opacity-50'
                }`}
                style={{ borderColor: canAfford ? '#F59E0B' : '#E5E7EB' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ backgroundColor: '#FEF3C7' }}>
                    {reward.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 style={{ color: '#0B006E' }}>{reward.title}</h3>
                    <div className="flex items-center gap-1 mt-1" style={{ color: '#F59E0B' }}>
                      <Coins className="w-4 h-4" />
                      <span>{reward.cost} monedas</span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => onDelete(reward.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <Button
                      onClick={() => handleRedeem(reward)}
                      disabled={!canAfford}
                      className="hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: '#F59E0B' }}
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
          <h3 className="mb-2" style={{ color: '#0B006E' }}>No hay recompensas todavía</h3>
          <p className="text-sm" style={{ color: '#0B006E', opacity: 0.7 }}>
            Crea recompensas personalizadas basadas en tus gustos
          </p>
        </div>
      )}

      {/* Info Card */}
      <Card className="p-4 border" style={{ backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }}>
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#D97706' }} />
          <div>
            <h3 style={{ color: '#92400E' }}>Sistema de Recompensas</h3>
            <p className="text-sm mt-1" style={{ color: '#78350F' }}>
              Completa tareas para ganar monedas y canjéalas por las recompensas que más disfrutes. 
              ¡Tú decides cuánto vale cada una!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}