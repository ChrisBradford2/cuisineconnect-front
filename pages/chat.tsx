import Head from 'next/head';
import { useState } from 'react';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export async function search(
  messages: Array<ChatCompletionMessageParam>,
): Promise<string> {
  const response = await fetch('/api/completion', {
    method: 'POST',
    body: JSON.stringify({ messages: messages, max_tokens: 500 }),
  });
  const json = await response.json();
  return json.content;
}

export default function Chat() {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState<string>('');
  const [messages, setMessages] = useState<Array<ChatCompletionMessageParam>>([
    {
      content:
        'Tu es Michel, un chef étoilé 5 étoiles au guide Michelin pour 5 années consécutives. Michel aide les personnes à cuisiner des plats délicieux.',
      role: 'system',
    },
  ]);

  return (
    <>
      <Head>
        <title>Cuisine Connecté</title>
        <meta name="description" content="Cuisine Connecté" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center min-h-screen p-2 gap-2">
        <h1 className="text-xl font-semibold">Chat</h1>
        <p>Discuter avec notre chef, Michel</p>

        <div className="flex flex-col-reverse grow gap-2 w-full">
          {[...messages].reverse().map(({ content, role }, index) => {
            if (role !== 'user' && role !== 'assistant') return null;
            return (
              <div className="rounded-xl p-2 bg-gray-100" key={index}>
                {content}
              </div>
            );
          })}
        </div>

        <form
          className="gap-2 w-full flex"
          onSubmit={async (event) => {
            event.preventDefault();
            setIsLoading(true);
            try {
              const newMessage: ChatCompletionMessageParam = {
                content: value,
                role: 'user',
              };
              setValue('');
              setMessages([
                ...messages,
                newMessage,
                { role: 'assistant', content: "Michel est en train d'écrire…" },
              ]);
              const response = await search([...messages, newMessage]);
              setMessages([
                ...messages,
                newMessage,

                { role: 'assistant', content: response },
              ]);
            } catch (e) {
              setMessages((prevState) => [
                ...prevState,
                {
                  role: 'assistant',
                  content:
                    'Oups, il y a eu une erreur, veuillez réessayer plus tard.',
                },
              ]);
            } finally {
              setIsLoading(false);
            }
          }}
        >
          <input
            name="message"
            className="bg-gray-100 h-10 px-5 pr-10 rounded-full text-sm focus:outline-1 focus:outline-green-700 grow"
            placeholder="Demandez quelque chose à Michel"
            value={value}
            onInput={({ currentTarget }) => {
              setValue(currentTarget.value);
            }}
            disabled={isLoading}
          />
          <button className="px-4 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-green-700 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600">
            Envoyer
          </button>
        </form>
      </main>
    </>
  );
}
