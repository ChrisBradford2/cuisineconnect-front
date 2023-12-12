export async function signUp(email: string, password: string): Promise<void> {
  const data = {
    email,
    password,
  };

  await fetch('/api/auth/signup', {
    body: JSON.stringify(data),
    method: 'post',
  });
}

export async function signIn(email: string, password: string): Promise<string> {
  const data = {
    email,
    password,
  };

  const response = await fetch('/api/auth/signin', {
    body: JSON.stringify(data),
    method: 'post',
  });

  const json = await response.json();

  return json.token;
}
