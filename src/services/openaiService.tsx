import axios from 'axios';
import { MEDICAL_SYSTEM_PROMPT, OPENAI_BASE_URL } from '@/config/configOpenAI'
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig'

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

  const { config, loading } = useOpenAIConfig();

  console.log(config);

  if (loading || !config.apiKey) {
    throw new Error('Configuración no lista');
  }

  try {
    const response = await axios.post(
      `${OPENAI_BASE_URL}/chat/completions`,
      {
        model: config.model, 
        messages,
        max_tokens: config.maxTokens,
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
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