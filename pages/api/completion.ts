import type { NextApiRequest, NextApiResponse } from 'next';
import getCompletion from '@/src/getCompletion';
import OpenAI from 'openai';

type RequestData = {
  messages: OpenAI.Chat.ChatCompletionMessageParam[];
  max_tokens: number;
};

type ResponseData = {
  content: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const { messages, max_tokens } = JSON.parse(req.body) as RequestData;
  const content = await getCompletion(messages, max_tokens);

  res.status(200).json({ content });
}
