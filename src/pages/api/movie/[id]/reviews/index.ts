import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../server/prisma'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const reviews = await prisma.review.findMany({
        where: { movieId: Number(id) },
      });

      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  } else  if (req.method === 'POST') {
    const { reviewer, rating, comments } = req.body;
    try {
      const review = await prisma.review.create({
        data: {
          movieId: Number(id),
          reviewer,
          rating: Number(rating),
          comments,
        },
      });
      await updateMovieRating(review.movieId); 
      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add review' });
    }
  }  else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function updateMovieRating(movieId: number) {
  const reviews = await prisma.review.findMany({ where: { movieId } });
  const averageRating = reviews.length ? reviews.reduce((acc: any, review: any) => acc + review.rating, 0) / reviews.length : null;

  await prisma.movie.update({
    where: { id: movieId },
    data: { averageRating },
  });
}
