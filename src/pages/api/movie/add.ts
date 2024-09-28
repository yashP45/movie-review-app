import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../server/prisma'; // Adjust the path as necessary

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, releaseDate, averageRating } = req.body;
    try {
      const movie = await prisma.movie.create({
        data: {
          name,
          releaseDate: new Date(releaseDate),
          averageRating: averageRating ? parseFloat(averageRating) : null,
        },
      });
      res.status(201).json(movie);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add movie' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}