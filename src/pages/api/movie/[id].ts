import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    
    const movie = await prisma.movie.findUnique({
      where: { id: Number(id) },
    });
    res.status(200).json(movie);
  } else if (req.method === "DELETE") {
    await prisma.review.deleteMany({
      where: { movieId: Number(id) },
    });
    await prisma.movie.delete({
      where: { id: Number(id) },
    });
    res.status(204).end();
  } else if (req.method === 'PUT') {
  

    try {
      const updatedMovie = await prisma.movie.update({
        where: { id: Number(id) },
        data: req.body,
      });
      res.status(200).json(updatedMovie);
    } catch (error) {

      res.status(500).json({ error: 'Failed to update movie' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE' ]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
