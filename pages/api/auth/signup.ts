import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/services/model';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { email, password } = JSON.parse(req.body);
    const uuid = crypto.randomUUID();

    await db.User.create({
      email,
      password,
      uuid,
      preferences: null,
    });

    res.status(201).end();
  } catch (error: unknown) {
    console.error(error);
    res.status(500).end();
  }
};
