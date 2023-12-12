import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/services/model';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { email, password } = JSON.parse(req.body);

    const user = await db.User.findOne({
      where: {
        email,
      },
    });

    if (!user?.checkPassword(password)) {
      return res.status(401).end();
    }

    const token = user.generateToken();

    res.json({ token });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).end();
  }
};
