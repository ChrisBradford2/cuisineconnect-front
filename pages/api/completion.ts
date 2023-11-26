import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const openaiResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Tu es un comédien qui raconte une blague.',
        },
        {
          role: 'user',
          content:
            'Raconte-moi une blague courte mais sans t\'addresser à moi directement. Raconte juste la blague. Ne dis pas que tu vas me raconter une blague. Ne dis pas "Bien sûr, voici une blague pour toi :" ou quelque chose comme ça. Ne dis pas non plus "Voici une blague :".',
        },
      ],
      temperature: 0.7,
      max_tokens: 256,
    });

    const joke = openaiResponse.choices[0]?.message?.content;

    if (joke) {
      return res.status(200).json({ joke });
    } else {
      return res
        .status(500)
        .json({ error: 'Failed to get a joke from OpenAI.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
