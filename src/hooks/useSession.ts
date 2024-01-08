import { useStorage } from '@/src/hooks/useStorage';
import { useEffect, useMemo, useState } from 'react';
import { getFoodPreferences } from '@/services/getFoodPreferences';

type Session = {
  email: string;
  uuid: string;
  token: string;
  foodPreference: string;
  signOut: () => void;
  signIn: () => void;
};

export default function useSession(): Session | null {
  const [token, setToken] = useStorage<string | null>('token', null);
  const [foodPreference, setFoodPreference] = useState('');

  useEffect(() => {
    if (typeof token === 'string') {
      getFoodPreferences(token)
        ?.then(setFoodPreference)
        .catch(() => setFoodPreference(''));
    } else {
      setFoodPreference('');
    }
  }, [token]);

  return useMemo<Session | null>(() => {
    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      return {
        ...payload,
        foodPreference,
        token,
        signOut: () => setToken(null),
        signIn: (newToken: string) => setToken(newToken),
      };
    } catch (error: unknown) {
      return null;
    }
  }, [token, foodPreference]);
}
