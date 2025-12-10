import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, Heart, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  supportLevel?: 'normal' | 'concern';
}

interface ChatBotProps {
  userName: string;
}

export function ChatBot({ userName }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `¡Hola ${userName}! 👋 Soy tu asistente personal de bienestar. Estoy aquí para escucharte y apoyarte. ¿Cómo te sientes hoy?`,
      sender: 'bot',
      timestamp: new Date(),
      supportLevel: 'normal',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): { text: string; supportLevel: 'normal' | 'concern' } => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Palabras clave que indican estrés o problemas emocionales
    const stressKeywords = ['estresado', 'ansiedad', 'agobiado', 'deprimido', 'triste', 'llorar', 'preocupado', 'miedo', 'pánico'];
    const hasStressIndicators = stressKeywords.some(keyword => lowerMessage.includes(keyword));

    if (hasStressIndicators) {
      const responses = [
        'Entiendo que estés pasando por un momento difícil. Es completamente válido sentirse así. ¿Quieres hablar más sobre lo que está pasando? Estoy aquí para escucharte.',
        'Lamento que te sientas así. Recuerda que está bien pedir ayuda. ¿Hay algo específico que te esté generando estos sentimientos?',
        'Tu bienestar emocional es muy importante. Me alegra que estés compartiendo esto conmigo. ¿Has pensado en hablar con alguien profesional sobre cómo te sientes?',
      ];
      return {
        text: responses[Math.floor(Math.random() * responses.length)],
        supportLevel: 'concern',
      };
    }

    // Palabras clave sobre tareas y estudios
    if (lowerMessage.includes('tarea') || lowerMessage.includes('estudio') || lowerMessage.includes('examen')) {
      const responses = [
        'Entiendo que las tareas pueden ser abrumadoras. ¿Qué tal si las divides en partes más pequeñas? Así será más fácil avanzar paso a paso.',
        'Los estudios son importantes, pero también lo es tu descanso. Recuerda tomar pausas regulares para mantener tu mente fresca.',
        '¡Puedes con esto! Organizar tus tareas en nuestra sección de Tareas puede ayudarte a visualizar mejor tu progreso.',
      ];
      return {
        text: responses[Math.floor(Math.random() * responses.length)],
        supportLevel: 'normal',
      };
    }

    // Respuestas positivas
    if (lowerMessage.includes('bien') || lowerMessage.includes('feliz') || lowerMessage.includes('genial')) {
      const responses = [
        '¡Me alegra mucho escuchar eso! 😊 Mantén esa energía positiva. ¿Hay algo en lo que pueda ayudarte hoy?',
        '¡Qué bueno! Es importante celebrar los momentos buenos. ¿Qué te ha hecho sentir así?',
        '¡Excelente! Me encanta verte con esa actitud. ¿Tienes algún objetivo que quieras alcanzar hoy?',
      ];
      return {
        text: responses[Math.floor(Math.random() * responses.length)],
        supportLevel: 'normal',
      };
    }

    // Respuesta por defecto
    const defaultResponses = [
      'Cuéntame más sobre eso. Estoy aquí para escucharte y ayudarte en lo que necesites.',
      'Interesante. ¿Cómo te hace sentir esa situación?',
      'Entiendo. Recuerda que no estás solo/a en esto. ¿Hay algo específico en lo que pueda apoyarte?',
      'Gracias por compartir eso conmigo. Tu bienestar es importante. ¿Qué más está en tu mente?',
    ];
    
    return {
      text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
      supportLevel: 'normal',
    };
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simular tiempo de respuesta del bot
    setTimeout(() => {
      const { text, supportLevel } = getBotResponse(inputText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text,
        sender: 'bot',
        timestamp: new Date(),
        supportLevel,
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #D1FAE5 0%, #A7F3D0 50%, #6EE7B7 100%)' }}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-56 h-56 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #059669 0%, transparent 70%)' }} />
      
      {/* Header */}
      <div className="relative z-10 p-6 pb-4 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center shadow-lg backdrop-blur-sm">
            <Bot className="w-9 h-9" />
          </div>
          <div className="flex-1">
            <h2 className="text-white text-xl mb-1">Asistente de Bienestar IA</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              <p className="text-white/90 text-sm">En línea - Siempre aquí para ti</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div 
              className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md`}
              style={{ 
                background: message.sender === 'bot' 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                  : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
              }}
            >
              {message.sender === 'bot' ? (
                <Bot className="w-5 h-5 text-white" />
              ) : (
                <UserIcon className="w-5 h-5 text-white" />
              )}
            </div>

            {/* Message bubble */}
            <div className={`flex-1 max-w-[75%] ${message.sender === 'user' ? 'flex justify-end' : ''}`}>
              <div
                className={`rounded-3xl p-4 shadow-md`}
                style={{
                  backgroundColor: message.sender === 'bot' ? 'white' : '#8B5CF6',
                  color: message.sender === 'bot' ? '#0B006E' : '#ffffff'
                }}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
              
              {/* Mostrar aviso si el bot detecta preocupación */}
              {message.sender === 'bot' && message.supportLevel === 'concern' && (
                <Card className="mt-3 p-4 border-0 shadow-md" style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' }}>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#D97706' }} />
                    <p className="text-xs leading-relaxed" style={{ color: '#78350F', fontWeight: 500 }}>
                      Si sientes que necesitas apoyo profesional, recuerda que hay recursos disponibles. 
                      Tu salud mental es prioritaria. 💙
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="rounded-3xl px-5 py-4 shadow-md" style={{ backgroundColor: 'white' }}>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#10b981' }}></div>
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#10b981', animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#10b981', animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Mensaje de bienestar */}
      <div className="px-4 pb-3 relative z-10">
        <div className="border-0 rounded-2xl p-4 flex items-start gap-3 shadow-md" style={{ background: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)' }}>
          <Heart className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#6366F1' }} />
          <p className="text-xs leading-relaxed" style={{ color: '#4C1D95', fontWeight: 500 }}>
            Este es un espacio seguro y confidencial. Comparte lo que necesites sin preocupaciones.
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-t relative z-10" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-5 py-4 border-2 rounded-3xl focus:outline-none focus:ring-0 shadow-sm"
            style={{ borderColor: '#10b981', color: '#0B006E' }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="w-14 h-14 rounded-full hover:opacity-90 disabled:opacity-50 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            <Send className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}