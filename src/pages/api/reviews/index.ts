import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../server/prisma'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { movieId } = req.query;
    const reviews = await prisma.review.findMany({ where: { movieId: Number(movieId) } });
    res.status(200).json(reviews);
  } else if (req.method === 'POST') {
    const { movieId, reviewer, rating, comments } = req.body;
    console.log('New review created:', req.body);

    const review = await prisma.review.create({
      data: {
        movieId,
        reviewer: reviewer || null,
        rating,
        comments,
      },
    });
   
    await updateMovieRating(review.movieId); 
    res.status(201).json(review);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
async function updateMovieRating(movieId: number) {
  console.log('Updating movie rating for movieId:', movieId);
  const reviews = await prisma.review.findMany({ where: { movieId } });
  
  
  const averageRating = reviews.length 
    ? reviews.reduce((acc: any, review: any) => acc + review.rating, 0) / reviews.length 
    : null;

  console.log('Calculated average rating:', averageRating);
  
  
  try {
    await prisma.movie.update({
      where: { id: movieId },
      data: { averageRating },
    });
    console.log('Movie rating updated successfully');
  } catch (error) {
    console.error('Error updating movie rating:', error);
  }
}
