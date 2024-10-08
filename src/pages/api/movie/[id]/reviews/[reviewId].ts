import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../server/prisma'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, reviewId } = req.query;

  if (req.method === 'PUT') {
    
    const { reviewer, rating, comments } = req.body;
    try {
      const review = await prisma.review.update({
        where: { id: Number(reviewId) },
        data: {
          reviewer,
          rating: Number(rating),
          comments,
        },
      });
      await updateMovieRating(review.movieId); 
      res.status(200).json(review);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update review' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.review.delete({
        where: { id: Number(reviewId) },
      });
      res.status(204).end();
      
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete review' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
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
