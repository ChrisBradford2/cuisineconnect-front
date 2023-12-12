export async function getFoodPreferences(token: string): Promise<string> {
  const response = await fetch('/api/foodPreference', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { foodPreference } = await response.json();

  return foodPreference;
}

export async function saveFoodPreferences(
  token: string,
  foodPreference: string,
): Promise<void> {
  await fetch('/api/foodPreference', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ foodPreference }),
  });
}
