import { Search, MapPin, Star, Clock, Phone, Mail, Video, ArrowLeft } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';

interface PsychologistSearchProps {
  onNavigate: (screen: 'home' | 'chat' | 'tasks' | 'rewards' | 'profile' | 'psychologists') => void;
}

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
    price: 'Desde $50/sesión',
    image: '👩‍⚕️',
    online: true,
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
    price: 'Desde $60/sesión',
    image: '👨‍⚕️',
    online: true,
  },
  {
    id: '3',
    name: 'Dra. Ana Ramírez',
    specialty: 'Psicología Juvenil y Universitaria',
    rating: 5.0,
    reviews: 156,
    experience: '15 años de experiencia',
    location: 'Consultorio Virtual',
    availability: 'Solo en línea',
    price: 'Desde $45/sesión',
    image: '👩‍⚕️',
    online: true,
  },
  {
    id: '4',
    name: 'Dr. Roberto Silva',
    specialty: 'Manejo del Estrés y Burnout',
    rating: 4.7,
    reviews: 89,
    experience: '10 años de experiencia',
    location: 'Clínica Salud Mental',
    availability: 'Próxima semana',
    price: 'Desde $55/sesión',
    image: '👨‍⚕️',
    online: false,
  },
];

export function PsychologistSearch({ onNavigate }: PsychologistSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPsychologists = psychologists.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <h1 className="text-white text-2xl mb-2">Buscar Ayuda Profesional</h1>
        <p className="text-white/90 text-sm mb-4">Encuentra el psicólogo ideal para ti</p>
        
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o especialidad..."
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
              <h3 className="mb-1" style={{ color: '#78350F', fontWeight: 600 }}>Tu salud mental importa</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#92400E' }}>
                Hablar con un profesional es un paso valiente. Todos estos especialistas están aquí para ayudarte.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Psychologists List */}
      <div className="px-6 pb-6 space-y-4">
        <h2 style={{ color: '#0C4A6E', fontWeight: 600 }}>
          {filteredPsychologists.length} Profesionales Disponibles
        </h2>
        
        {filteredPsychologists.map((psychologist) => (
          <Card
            key={psychologist.id}
            className="p-5 border-0 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
            style={{ backgroundColor: 'white' }}
          >
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-md" style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)' }}>
                  {psychologist.image}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="mb-1" style={{ color: '#0B006E', fontWeight: 600 }}>{psychologist.name}</h3>
                    <p className="text-sm" style={{ color: '#0EA5E9', fontWeight: 500 }}>{psychologist.specialty}</p>
                  </div>
                  {psychologist.online && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: '#D1FAE5' }}>
                      <Video className="w-3 h-3" style={{ color: '#059669' }} />
                      <span className="text-xs" style={{ color: '#065F46', fontWeight: 500 }}>Online</span>
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" style={{ color: '#F59E0B' }} />
                    <span className="text-sm" style={{ color: '#0B006E', fontWeight: 600 }}>{psychologist.rating}</span>
                    <span className="text-sm" style={{ color: '#0B006E', opacity: 0.6 }}>({psychologist.reviews})</span>
                  </div>
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#CBD5E1' }} />
                  <span className="text-sm" style={{ color: '#0B006E', opacity: 0.8 }}>{psychologist.experience}</span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" style={{ color: '#0EA5E9' }} />
                    <span className="text-sm" style={{ color: '#0B006E', opacity: 0.8 }}>{psychologist.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: '#10b981' }} />
                    <span className="text-sm" style={{ color: '#0B006E', opacity: 0.8 }}>{psychologist.availability}</span>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm" style={{ color: '#0EA5E9', fontWeight: 600 }}>{psychologist.price}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full border-2 hover:bg-blue-50"
                      style={{ borderColor: '#0EA5E9', color: '#0EA5E9' }}
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Llamar
                    </Button>
                    <Button
                      size="sm"
                      className="rounded-full shadow-md hover:shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)', color: 'white' }}
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Contactar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
