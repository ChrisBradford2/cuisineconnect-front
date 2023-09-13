import { signIn, useSession } from 'next-auth/react'
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
        <p className="text-2xl text-center">Vous êtes déjà connecté, <a href="/" className='text-green-700 font-bold'>retournez à l'accueil</a></p>
      </main>
    )
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Cuisine Connecté
        </h1>

        <p className="mt-3 text-2xl">
          Connectez-vous pour accéder à la plateforme
        </p>

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
