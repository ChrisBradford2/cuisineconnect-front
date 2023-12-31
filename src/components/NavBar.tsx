import { FaHamburger, FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import useSession from '@/src/hooks/useSession';
import useIsClient from '@/src/hooks/useIsClient';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import VoiceSearch from './VoiceSearch';

export default function NavBar() {
  const session = useSession();
  const isClient = useIsClient();
  const router = useRouter();

  const [searchText, setSearchText] = useState('');

  const handleSearchSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const search = String(formData.get('content'));

    await router.push({
      pathname: '/recipes',
      query: { search: search },
    });
  };

  const handleVoiceSearch = async (voiceText: string) => {
    setSearchText(voiceText);
    await router.push({
      pathname: '/recipes',
      query: { search: voiceText },
    });
  };

  return (
    <header>
      <nav className="bg-white shadow">
        <div className="container px-6 py-3 mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="hidden md:flex">
              <form className="relative" onSubmit={handleSearchSubmit}>
                <input
                  name="content"
                  type="text"
                  className="bg-gray-100 h-10 px-5 pr-10 rounded-full text-sm focus:outline-1 focus:outline-green-700"
                  placeholder="J'aimerais cuisiner..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />

                <button
                  type="submit"
                  className="absolute right-0 top-0 mt-3 mr-4 transition-opacity duration-500 opacity-100 focus-within:opacity-0"
                >
                  <FaSearch />
                </button>
              </form>
              <VoiceSearch onSearch={handleVoiceSearch} />
              <div className="flex md:hidden">
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                  aria-label="toggle menu"
                >
                  <FaHamburger />
                </button>
              </div>
            </div>

            <Link
              className="text-xl font-bold text-green-700 md:text-2xl hover:text-green-500 transition-all duration-150"
              href="/"
            >
              Cuisine Connect
            </Link>

            <div className="flex flex-col md:flex-row md:block -mx-2">
              <Link
                className="px-2 py-1 text-gray-500 font-medium tracking-wide rounded-md hover:bg-green-100 hover:text-gray-700 transition-all duration-150"
                href="/chat"
              >
                Chat
              </Link>
              {isClient && (
                <>
                  {session ? (
                    <>
                      <Link
                        className="px-2 py-1 text-gray-500 font-medium tracking-wide rounded-md hover:bg-green-100 hover:text-gray-700 transition-all duration-150"
                        href="/profile"
                      >
                        Profil
                      </Link>

                      <button
                        className="px-2 py-1 text-gray-500 font-medium tracking-wide rounded-md hover:bg-green-100 hover:text-gray-700 transition-all duration-150"
                        onClick={() => session.signOut()}
                      >
                        Se déconnecter
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        className="px-2 py-1 text-gray-500 font-medium tracking-wide rounded-md hover:bg-green-100 hover:text-gray-700 transition-all duration-150"
                        href="/login"
                      >
                        Se connecter
                      </Link>

                      <Link
                        className="px-2 py-1 text-gray-500 font-medium tracking-wide rounded-md hover:bg-green-100 hover:text-gray-700 transition-all duration-150"
                        href="/register"
                      >
                        S&apos;inscrire
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
