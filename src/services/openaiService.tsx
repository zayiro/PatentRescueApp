import axios from 'axios';
import { MEDICAL_SYSTEM_PROMPT, OPENAI_API_KEY, OPENAI_BASE_URL } from '@/config/configOpenAI'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const enviarConsultaMedica = async (mensaje: string): Promise<string> => {
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
        temperature: 0.1,
        max_tokens: 500,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
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