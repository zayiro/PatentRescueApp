// hooks/useOpenAIConfig.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getConfiguration } from '@/service/firestore';

interface OpenAIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  lastUpdated: number;
}

export const useOpenAIConfig = () => {
  const [config, setConfig] = useState<OpenAIConfig>({
    apiKey: '',
    model: 'gpt-4o-mini',
    maxTokens: 200,
    lastUpdated: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchRemoteConfig = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // 1. ✅ Cache local (1 hora)
      const cached = await AsyncStorage.getItem('openai_config');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.lastUpdated < 60 * 60 * 1000) {
          setConfig(parsed);
          setLoading(false);
          return;
        }
      }

      // 2. ✅ Fetch remoto
      const response: any = await getConfiguration();
      
      /*
      const apiKey getValue(remoteConfig, 'OPENAI_API_KEY').asString();
      const model = getValue(remoteConfig, 'MODEL').asString();
      const maxTokens = parseInt(getValue(remoteConfig, 'MAX_TOKENS').asString()); =
      */

      const apiKey = response.openAIKey;
      const model = response.model;
      const maxTokens = response.max_tokens;      

      const newConfig: OpenAIConfig = {
        apiKey,
        model,
        maxTokens,
        lastUpdated: Date.now(),
      };

      // 3. ✅ Cache nuevo
      await AsyncStorage.setItem('openai_config', JSON.stringify(newConfig));
      setConfig(newConfig);
    } catch (error) {
      console.error('Remote Config error:', error);
      // Fallback local
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemoteConfig();
  }, []);

  return { config, loading, refresh: fetchRemoteConfig };
};