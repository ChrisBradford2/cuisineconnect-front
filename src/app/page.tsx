import Image from 'next/image';
import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen items-center p-24">
      <h1 className="text-6xl font-bold text-center mb-6">
        Welcome to <a href="https://nextjs.org">Cuisine Connecté</a> !
      </h1>
      <p className="text-2xl text-center">
        Get started by editing{' '}
        <code className="bg-indigo-800 p-2 rounded-md text-lg font-mono">
          pages/index.tsx
        </code>
      </p>
    </main>
  );
}
