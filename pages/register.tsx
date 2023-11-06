import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      username,
      email,
      password,
      confirmed: true,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/local/register`,
        data
      );
       // Login user after registration
        const result = await signIn("credentials", {
            redirect: false,
            email: email,
            password: password,
        });

        localStorage.setItem("firstTimeLogin", "true");
        setShowWelcomeMessage(true);
        router.push("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error?.response?.data.error.message);
      } else {
        console.log('An unexpected error occurred:', error);
      }
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center mt-10 w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          S'inscrire
        </h1>

        <p className="mt-3 text-2xl">
          Inscrivez-vous pour accéder à la plateforme
        </p>

        <form className="flex flex-col items-center justify-center w-full max-w-sm px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear bg-white rounded-lg shadow outline-none hover:shadow-lg focus:outline-none" onSubmit={handleSubmit}>
          <input className="w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear bg-gray-600 rounded-lg shadow outline-none hover:bg-gray-700 hover:shadow-lg focus:outline-none" type="text" name="username" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input className="w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear bg-gray-600 rounded-lg shadow outline-none hover:bg-gray-700 hover:shadow-lg focus:outline-none" type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear bg-gray-600 rounded-lg shadow outline-none hover:bg-gray-700 hover:shadow-lg focus:outline-none" type="password" name="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear bg-blue-600 rounded-lg shadow outline-none hover:bg-blue-700 hover:shadow-lg focus:outline-none" type="submit">S'inscrire</button>
        </form>

        <hr className="my-6 border-gray-300 w-full" />

        <p className="mt-3 text-2xl">
          OU
        </p>

        <hr className="my-6 border-gray-300 w-full" />

        <button
          className="w-full max-w-sm px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear bg-blue-600 rounded-lg shadow outline-none hover:bg-blue-700 hover:shadow-lg focus:outline-none"
          onClick={() => signIn('google')}
        >
          S'inscrire avec Google
        </button>
      </main>
    </div>
  )
}
