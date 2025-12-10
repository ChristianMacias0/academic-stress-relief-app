import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, Heart, AlertCircle, Lock } from 'lucide-react'; // Agregué Lock
import { Button } from './ui/button';
import { Card } from './ui/card';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner"; // Asumiendo que usas sonner como en Rewards

// --- CONFIGURACIÓN ---
const MAX_MESSAGES_PER_SESSION = 10; // Límite de mensajes por sesión
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Instrucciones para que la IA no sea condescendiente y se limite al tema
const SYSTEM_INSTRUCTION = `
Eres un compañero de bienestar emocional para estudiantes universitarios llamado "Mindzy".
REGLAS DE PERSONALIDAD:
1. LENGUAJE NEUTRO POR DEFECTO: Empieza siempre con un español neutro y claro. NO uses jerga, modismos ni coloquialismos (como "chido", "bacán", "guay", "parce") A MENOS QUE el usuario los use primero.
2. EFECTO ESPEJO: Solo si el usuario usa una palabra coloquial, tienes permiso para usarla sutilmente para conectar. Si el usuario es serio, mantente serio pero cercano.
3. CERO CONDESCENDENCIA: Habla de igual a igual. Prohibido usar frases de lástima o clichés clínicos como "Es comprensible", "Lamento escuchar eso", "Valido tus sentimientos" o "Pobrecito".
4. SIN DRAMA: Si el usuario está mal, no lo mires con pena. Normaliza la situación con frases simples como "A veces pasa", "Esos días son pesados" o "Te entiendo, a mí también me pasaría".

REGLAS DE RESTRICCIÓN (MUY IMPORTANTE):
1. TU ÚNICO PROPÓSITO es conversar, escuchar desahogos y hablar de estrés o emociones.
2. SI EL USUARIO PIDE: ayuda con tareas, código, matemáticas, busquedas en google, recetas, datos históricos o cualquier tema "académico/técnico", DEBES NEGARTE AMABLEMENTE.
3. Ejemplo de negativa: "Me encantaría ayudarte, pero mi función es escucharte y apoyarte con tu estrés, no puedo resolver tareas académicas o buscar datos."
4. Mantén las respuestas breves y conversacionales (máximo 2-3 oraciones).
`;

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
      text: `¡Hola ${userName}! 👋 Soy tu espacio seguro. Estoy aquí para escucharte sin juzgar. ¿Qué tienes en mente hoy?`,
      sender: 'bot',
      timestamp: new Date(),
      supportLevel: 'normal',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0); // Contador de mensajes
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inicializar Gemini
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  // Mantenemos una referencia al chat actual para mantener el contexto
  const chatSessionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Función para iniciar/obtener la sesión de chat
  const getChatSession = async () => {
    if (!chatSessionRef.current) {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-robotics-er-1.5-preview",
        systemInstruction: SYSTEM_INSTRUCTION 
      });
      
      chatSessionRef.current = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: `Hola, soy ${userName}.` }],
          },
          {
            role: "model",
            parts: [{ text: `Hola ${userName}, estoy listo para escucharte.` }],
          },
        ],
      });
    }
    return chatSessionRef.current;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // 1. Verificación de límite de sesión
    if (messageCount >= MAX_MESSAGES_PER_SESSION) {
        toast.error("Has alcanzado el límite de mensajes por esta sesión de prueba.");
        return;
    }

    const newMessageText = inputText;
    setInputText(''); // Limpiar input inmediatamente
    setMessageCount(prev => prev + 1); // Aumentar contador

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessageText,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // 2. Llamada real a Gemini
      const chat = await getChatSession();
      const result = await chat.sendMessage(newMessageText);
      const response = result.response;
      const text = response.text();

      // Análisis simple para detectar si la IA sugiere ayuda profesional (basado en palabras clave en SU respuesta)
      const lowerResponse = text.toLowerCase();
      const isConcerning = lowerResponse.includes("profesional") || lowerResponse.includes("ayuda psicológica") || lowerResponse.includes("terapia");

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: text,
        sender: 'bot',
        timestamp: new Date(),
        supportLevel: isConcerning ? 'concern' : 'normal',
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error conectando con Gemini:", error);
      toast.error("Hubo un error al conectar con el asistente.");
      
      // Mensaje de error en el chat
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "Lo siento, perdí la conexión momentáneamente. ¿Podemos intentar de nuevo?",
        sender: 'bot',
        timestamp: new Date(),
        supportLevel: 'normal'
      }]);
    } finally {
      setIsTyping(false);
    }
  };


  const isLimitReached = messageCount >= MAX_MESSAGES_PER_SESSION;

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
            <h2 className="text-white text-xl mb-1">Asistente de Bienestar</h2>
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                 <p className="text-white/90 text-sm">En línea (Beta)</p>
              </div>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {messageCount}/{MAX_MESSAGES_PER_SESSION} msgs
              </span>
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
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
              </div>
              
              {/* Mostrar aviso si el bot detecta preocupación grave */}
              {message.sender === 'bot' && message.supportLevel === 'concern' && (
                <Card className="mt-3 p-4 border-0 shadow-md" style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' }}>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#D97706' }} />
                    <p className="text-xs leading-relaxed" style={{ color: '#78350F', fontWeight: 500 }}>
                      Recuerda que soy una IA de prueba. Si necesitas ayuda real, por favor contacta a un profesional en la sección de Psicólogos.
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
        
        {/* Aviso de límite alcanzado */}
        {isLimitReached && (
             <div className="flex justify-center my-4">
                 <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-semibold text-gray-500 shadow-sm flex items-center gap-2">
                     <Lock className="w-3 h-3" />
                     Sesión de prueba finalizada
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
            Este es un espacio seguro. Tus conversaciones son privadas durante esta sesión.
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
            onKeyPress={(e) => e.key === 'Enter' && !isLimitReached && handleSendMessage()}
            placeholder={isLimitReached ? "Límite de mensajes alcanzado" : "Escribe tu mensaje..."}
            disabled={isLimitReached || isTyping}
            className="flex-1 px-5 py-4 border-2 rounded-3xl focus:outline-none focus:ring-0 shadow-sm disabled:opacity-50 disabled:bg-gray-100"
            style={{ borderColor: '#10b981', color: '#0B006E' }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLimitReached || isTyping}
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
