import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from '@/services/authentication';
import { useStorage } from '@/src/hooks/useStorage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [, setToken] = useStorage<string | null>('token', null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = await signIn(email, password);

    setToken(token);
    await router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full py-2">
      <main className="flex flex-col items-center mt-10 w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">Se connecter</h1>

        <p className="mt-3 text-2xl">
          Connectez-vous pour accéder à la plateforme
        </p>

        <form
          className="flex flex-col items-center justify-center w-full max-w-sm px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear bg-white rounded-lg shadow outline-none hover:shadow-lg focus:outline-none"
          onSubmit={handleSubmit}
        >
          <input
            className="w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear bg-gray-600 rounded-lg shadow outline-none hover:bg-gray-700 hover:shadow-lg focus:outline-none"
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={({ currentTarget }) => setEmail(currentTarget.value)}
          />

          <input
            className="w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear bg-gray-600 rounded-lg shadow outline-none hover:bg-gray-700 hover:shadow-lg focus:outline-none"
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={password}
            onChange={({ currentTarget }) => setPassword(currentTarget.value)}
          />

          <button
            className="w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear bg-blue-600 rounded-lg shadow outline-none hover:bg-blue-700 hover:shadow-lg focus:outline-none"
            type="submit"
          >
            Se connecter
          </button>
        </form>
      </main>
    </div>
  );
}
