import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL ?? 'https://api.openai.com/v1',
});

type Data = {
  content: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { messages, max_tokens } = JSON.parse(req.body);
  const completion = await openai.chat.completions.create({
    messages,
    model: process.env.OPENAI_API_MODEL ?? 'gpt-3.5-turbo',
    max_tokens,
  });

  res.status(200).json({ content: completion.choices[0].message.content! });
}
