import { FaHamburger, FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import useSession from '@/src/hooks/useSession';
import useIsClient from '@/src/hooks/useIsClient';
import { useState } from "react";
import Router from 'next/router'



export async function search(system: string, prompt: string): Promise<string> {
  const response = await fetch("/api/completion", {
    method: "POST",
    body: JSON.stringify([
      {
        role: "system",
        content: system,
      },
      { role: "user", content: prompt },
    ]),
  });
  const json = await response.json();
  return json.content;
}

export default function NavBar() {
  const session = useSession();
  const isClient = useIsClient();

  const [error, setError] = useState<unknown | null>(null);
  const [recipes, setRecipes] = useState<string[]>([]);

  return (
    <main>
      <nav className="bg-white shadow">
        <div className="container px-6 py-3 mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="hidden md:block">
              <form
                  className="flex"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    try {
                      const content = await search(
                          "Give a formatted list of recipes that matches the user's request. Follow the following sample formatting:\n - Recipe 1\n - Recipe 2",
                          String(formData.get("content")),
                      );
                      setRecipes(
                          content.split("\n").map((line) => line.replace(/ *- */g, "")),
                      );
                      await Router.push({
                        pathname: '/recipes',
                        query: {recipes: recipes}
                      })
                    } catch (e) {
                      setError(e);
                    }
                  }}
              >
                <input name="content" placeholder="I want recipes of…" />
                <button>Search</button>
              </form>

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
                href="/recipes"
              >
                Recettes
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
    </main>
  );
}
