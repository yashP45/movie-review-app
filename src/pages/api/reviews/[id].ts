import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../server/prisma'; // Adjust the path as necessary

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const review = await prisma.review.findUnique({ where: { id: Number(id) } });
    if (review) {
      res.status(200).json(review);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } else if (req.method === 'PUT') {
    const { rating, comments } = req.body;
    const updatedReview = await prisma.review.update({
      where: { id: Number(id) },
      data: {
        rating: rating || undefined,
        comments: comments || undefined,
      },
    });
    await updateMovieRating(updatedReview.movieId); // Function to update movie rating (defined below)
    res.status(200).json(updatedReview);
  } else if (req.method === 'DELETE') {
    const deletedReview = await prisma.review.delete({ where: { id: Number(id) } });
    await updateMovieRating(deletedReview.movieId); // Function to update movie rating (defined below)
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Helper function to update movie's average rating
async function updateMovieRating(movieId: number) {
  const reviews = await prisma.review.findMany({ where: { movieId } });
  const averageRating = reviews.length ? reviews.reduce((acc: any, review: any) => acc + review.rating, 0) / reviews.length : null;

  await prisma.movie.update({
    where: { id: movieId },
    data: { averageRating },
  });
}
