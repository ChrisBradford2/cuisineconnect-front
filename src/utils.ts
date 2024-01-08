export async function search(
  system: string,
  prompt: string,
  tokens: number,
): Promise<string> {
  const response = await fetch('/api/completion', {
    method: 'POST',
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: system,
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: tokens,
    }),
  });
  const json = await response.json();
  return json.content;
}
