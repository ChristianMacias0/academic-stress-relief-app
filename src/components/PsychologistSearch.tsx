import { Search, MapPin, Star, Clock, Phone, Mail, Video, ArrowLeft, Users, Laptop } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';

interface PsychologistSearchProps {
  onNavigate: (screen: 'home' | 'chat' | 'tasks' | 'rewards' | 'profile' | 'psychologists') => void;
}

// Actualizamos los datos para incluir estado y modalidad
const psychologists = [
  {
    id: '1',
    name: 'Dra. María González',
    specialty: 'Ansiedad y Estrés Académico',
    rating: 4.9,
    reviews: 127,
    experience: '12 años de experiencia',
    location: 'Ciudad Universitaria',
    availability: 'Disponible hoy',
    price: 50,
    image: '👩‍⚕️',
    status: 'online', // online | offline
    modality: 'hibrida', // virtual | presencial | hibrida
  },
  {
    id: '2',
    name: 'Dr. Carlos Mendoza',
    specialty: 'Terapia Cognitivo-Conductual',
    rating: 4.8,
    reviews: 98,
    experience: '8 años de experiencia',
    location: 'Centro Médico Norte',
    availability: 'Disponible mañana',
    price: 60,
    image: '👨‍⚕️',
    status: 'offline',
    modality: 'presencial',
  },
  {
    id: '3',
    name: 'Dra. Ana Ramírez',
    specialty: 'Psicología Juvenil',
    rating: 5.0,
    reviews: 156,
    experience: '15 años de experiencia',
    location: 'Consultorio Virtual',
    availability: 'Citas disponibles',
    price: 45,
    image: '👩‍⚕️',
    status: 'online',
    modality: 'virtual',
  },
  {
    id: '4',
    name: 'Dr. Roberto Silva',
    specialty: 'Manejo del Burnout',
    rating: 4.7,
    reviews: 89,
    experience: '10 años de experiencia',
    location: 'Clínica Salud Mental',
    availability: 'Próxima semana',
    price: 55,
    image: '👨‍⚕️',
    status: 'offline',
    modality: 'hibrida',
  },
];

export function PsychologistSearch({ onNavigate }: PsychologistSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPsychologists = psychologists.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Función para renderizar el badge de modalidad
  const renderModalityBadge = (type: string) => {
    switch (type) {
      case 'virtual':
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-xs font-medium border border-purple-200">
            <Laptop className="w-3 h-3" /> Virtual
          </div>
        );
      case 'presencial':
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-medium border border-blue-200">
            <Users className="w-3 h-3" /> Presencial
          </div>
        );
      case 'hibrida':
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-100 text-green-700 text-xs font-medium border border-green-200">
            <Video className="w-3 h-3" /> Híbrida
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-full relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #E0F2FE 0%, #BAE6FD 50%, #7DD3FC 100%)' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 p-6 pb-4" style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)', boxShadow: '0 4px 20px rgba(14, 165, 233, 0.3)' }}>
        <button
          onClick={() => onNavigate('profile')}
          className="mb-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white text-2xl font-bold mb-1">Buscar Ayuda</h1>
        <p className="text-white/90 text-sm mb-4">Encuentra al especialista ideal</p>
        
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre..."
            className="pl-12 py-3 rounded-full border-0 shadow-lg"
            style={{ backgroundColor: 'white' }}
          />
        </div>
      </div>

      {/* Info Card */}
      <div className="px-6 py-4">
        <Card className="p-4 border-0 shadow-md" style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F59E0B' }}>
              <span className="text-xl">💙</span>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-bold" style={{ color: '#78350F' }}>Tu salud mental importa</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#92400E' }}>
                Hablar con un profesional es un paso valiente. Estamos aquí para ayudarte.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Psychologists List */}
      <div className="px-6 pb-20 space-y-4">
        <h2 className="font-semibold" style={{ color: '#0C4A6E' }}>
          {filteredPsychologists.length} Profesionales Disponibles
        </h2>
        
        {filteredPsychologists.map((psychologist) => (
          <Card
            key={psychologist.id}
            className="p-4 border-0 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.01]"
            style={{ backgroundColor: 'white' }}
          >
            <div className="flex gap-4">
              {/* Avatar Column */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm relative" style={{ background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)' }}>
                  {psychologist.image}
                  {/* Status Indicator (Online/Offline) */}
                  <div 
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${psychologist.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}
                    title={psychologist.status === 'online' ? 'En línea' : 'Desconectado'}
                  />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${psychologist.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {psychologist.status === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Info Column */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-1 mb-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-base leading-tight" style={{ color: '#0B006E' }}>{psychologist.name}</h3>
                  </div>
                  <p className="text-xs font-medium" style={{ color: '#0284C7' }}>{psychologist.specialty}</p>
                  
                  {/* Modality Badge */}
                  <div className="flex mt-1">
                    {renderModalityBadge(psychologist.modality)}
                  </div>
                </div>

                {/* Rating & Exp */}
                <div className="flex items-center gap-3 mb-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current text-yellow-500" />
                    <span className="font-bold" style={{ color: '#0B006E' }}>{psychologist.rating}</span>
                    <span className="text-gray-400">({psychologist.reviews})</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{psychologist.experience}</span>
                </div>

                {/* Location/Time */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="truncate">{psychologist.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>{psychologist.availability}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Separator Line */}
            <div className="h-px w-full bg-gray-100 my-3" />

            {/* Footer: Price & Actions (Arreglado el descuadre) */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium">Costo sesión</span>
                <span className="text-lg font-bold" style={{ color: '#0284C7' }}>${psychologist.price}</span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full border-2 hover:bg-blue-50 px-4 h-9"
                  style={{ borderColor: '#0EA5E9', color: '#0EA5E9' }}
                >
                  <Phone className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  className="rounded-full shadow-md hover:shadow-lg px-6 h-9 font-medium"
                  style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)', color: 'white' }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Agendar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}