import axios from 'axios';
import { MEDICAL_SYSTEM_PROMPT, OPENAI_API_KEY, OPENAI_BASE_URL } from '@/config/configOpenAI'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

let lastRequest = 0;
const MIN_DELAY = 1000; // 1 segundo entre reque

export const enviarConsultaMedica = async (mensaje: string): Promise<string> => {
  // ✅ Esperar rate limit
  const now = Date.now();
  const delay = Math.max(0, MIN_DELAY - (now - lastRequest));
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  lastRequest = Date.now();
  
  const messages: ChatMessage[] = [
    { role: 'system', content: MEDICAL_SYSTEM_PROMPT },
    { role: 'user', content: mensaje },
  ];

  try {
    const response = await axios.post(
      `${OPENAI_BASE_URL}/chat/completions`,
      {
        model: 'gpt-4o-mini', 
        messages,
        max_tokens: 150,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'User-Agent': 'TrueDoctor/1.0',
        },
        params: { _t: Date.now() }, // No cache
      }
    );

    return response.data.choices[0].message.content || 'No pude procesar tu consulta.';
  } catch (error: any) {
    console.error('OpenAI Error:', error);
    throw new Error('Error conectando con Dr. IA');
  }
};