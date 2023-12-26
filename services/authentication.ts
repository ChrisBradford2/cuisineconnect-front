export async function signUp(
  email: string,
  password: string,
): Promise<boolean> {
  const data = {
    email,
    password,
  };

  const response = await fetch('/api/auth/signup', {
    body: JSON.stringify(data),
    method: 'post',
  });

  return response.ok;
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
