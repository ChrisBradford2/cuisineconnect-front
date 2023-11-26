import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/services/model';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.substring(7);

  if (!token) {
    return res.status(401).end();
  }

  const { uuid } = JSON.parse(atob(token.split('.')[1]));
  const user = await db.User.findOne({ where: { uuid } });

  if (!user) {
    return res.status(401).end();
  }

  if (req.method === 'GET') {
    res.json({ foodPreference: user?.preferences });
  } else if (req.method === 'POST') {
    const { foodPreference } = JSON.parse(req.body);
    user.preferences = foodPreference;
    await user.save();
    res.status(200).end();
  } else {
    return res.status(405).end();
  }
};
