import OpenAI from 'openai';

export default async function getCompletion(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  max_tokens: number,
): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? 'apiKey',
    baseURL: process.env.OPENAI_API_BASE_URL ?? 'https://api.openai.com/v1',
  });

  const completion = await openai.chat.completions.create({
    messages,
    model: process.env.OPENAI_API_MODEL ?? 'gpt-3.5-turbo',
    max_tokens,
  });

  return completion.choices[0].message.content!;
}
