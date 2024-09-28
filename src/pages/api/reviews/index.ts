import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../server/prisma'; // Adjust the path as necessary

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { movieId } = req.query;
    const reviews = await prisma.review.findMany({ where: { movieId: Number(movieId) } });
    res.status(200).json(reviews);
  } else if (req.method === 'POST') {
    const { movieId, reviewer, rating, comments } = req.body;
    const review = await prisma.review.create({
      data: {
        movieId,
        reviewer: reviewer || null,
        rating,
        comments,
      },
    });
    await updateMovieRating(movieId); // Function to update movie rating (defined below)
    res.status(201).json(review);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
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
