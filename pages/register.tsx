import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { signIn, signUp } from '@/services/authentication';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await signUp(email, password);
      const token = await signIn(email, password);

      localStorage.setItem('token', token);
      await router.push('/');
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center mt-10 w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">S&rsquo;inscrire</h1>

        <p className="mt-3 text-2xl">
          Inscrivez-vous pour accéder à la plateforme
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
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            className="w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear bg-gray-600 rounded-lg shadow outline-none hover:bg-gray-700 hover:shadow-lg focus:outline-none"
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button
            className="w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear bg-blue-600 rounded-lg shadow outline-none hover:bg-blue-700 hover:shadow-lg focus:outline-none"
            type="submit"
          >
            S&rsquo;inscrire
          </button>
        </form>
      </main>
    </div>
  );
}
