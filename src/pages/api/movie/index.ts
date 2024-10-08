import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../server/prisma'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
 
  if (req.method === 'GET') {
  
    const movies = await prisma.movie.findMany();
    res.status(200).json(movies);
  } else if (req.method === 'POST') {
    const { name, releaseDate } = req.body;
   
    const movie = await prisma.movie.create({
      data: {
        name,
        releaseDate: new Date(releaseDate),
      },
    });
    res.status(201).json(movie);
  } else {
    res.setHeader('Allow', ['GET', 'POST' , 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
