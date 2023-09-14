import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()

  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen py-2">
        <p className="text-2xl text-center">Chargement...</p>
      </main>
    )
  }

  if (session) {
    router.push('/')
    return (
      <main className="flex flex-col items-center justify-center min-h-screen py-2">
        <p className="text-2xl text-center">Vous êtes déjà connecté, <Link href="/" className='text-green-700 font-bold'>retournez à l&apos;accueil</Link></p>
      </main>
    )
  }

  const onSubmit = async (e : any) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email: e.target.email.value,
      password: e.target.password.value,
    });
    if (result && result.ok) {
      router.replace('/');
      return;
    }
    alert('Credential is not valid');
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center mt-10 w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Se connecter
        </h1>

        <p className="mt-3 text-2xl">
          Connectez-vous pour accéder à la plateforme
        </p>

        <form className="flex flex-col items-center justify-center w-full max-w-sm px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear bg-white rounded-lg shadow outline-none hover:shadow-lg focus:outline-none" onSubmit={onSubmit}>
          <input className="w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear bg-gray-600 rounded-lg shadow outline-none hover:bg-gray-700 hover:shadow-lg focus:outline-none" type="email" name="email" placeholder="Email" />
          <input className="w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear bg-gray-600 rounded-lg shadow outline-none hover:bg-gray-700 hover:shadow-lg focus:outline-none" type="password" name="password" placeholder="Mot de passe" />
          <button className="w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear bg-blue-600 rounded-lg shadow outline-none hover:bg-blue-700 hover:shadow-lg focus:outline-none" type="submit">Se connecter</button>
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
          Se connecter avec Google
        </button>
      </main>
    </div>
  )
}
