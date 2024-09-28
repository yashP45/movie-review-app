import * as trpc from '@trpc/server';
import { z } from 'zod';
import { prisma } from './prisma'; // Updated path

export const appRouter = trpc.router()
  // Movie CRUD operations
  .query('getMovies', {
    async resolve() {
      return prisma.movie.findMany();
    },
  })
  .query('getMovieById', {
    input: z.object({ id: z.number() }),
    async resolve({ input }) {
      return prisma.movie.findUnique({ where: { id: input.id } });
    },
  })
  .mutation('addMovie', {
    input: z.object({
      name: z.string(),
      releaseDate: z.string(),
    }),
    async resolve({ input }) {
      return prisma.movie.create({
        data: {
          name: input.name,
          releaseDate: new Date(input.releaseDate),
        },
      });
    },
  })
  .mutation('updateMovie', {
    input: z.object({
      id: z.number(),
      name: z.string().optional(),
      releaseDate: z.string().optional(),
    }),
    async resolve({ input }) {
      return prisma.movie.update({
        where: { id: input.id },
        data: {
          name: input.name || undefined,
          releaseDate: input.releaseDate ? new Date(input.releaseDate) : undefined,
        },
      });
    },
  })
  .mutation('deleteMovie', {
    input: z.object({ id: z.number() }),
    async resolve({ input }) {
      // Delete associated reviews first
      await prisma.review.deleteMany({
        where: { movieId: input.id },
      });
      return prisma.movie.delete({ where: { id: input.id } });
    },
  })

  // Review CRUD operations
  .query('getReviewsByMovieId', {
    input: z.object({ movieId: z.number() }),
    async resolve({ input }) {
      return prisma.review.findMany({ where: { movieId: input.movieId } });
    },
  })
  .mutation('addReview', {
    input: z.object({
      movieId: z.number(),
      reviewer: z.string().optional(),
      rating: z.number(),
      comments: z.string(),
    }),
    async resolve({ input }) {
      const review = await prisma.review.create({
        data: {
          movieId: input.movieId,
          reviewer: input.reviewer || null,
          rating: input.rating,
          comments: input.comments,
        },
      });

      // Update movie's average rating
      await updateMovieRating(input.movieId);
      return review;
    },
  })
  .mutation('updateReview', {
    input: z.object({
      id: z.number(),
      rating: z.number().optional(),
      comments: z.string().optional(),
    }),
    async resolve({ input }) {
      const updatedReview = await prisma.review.update({
        where: { id: input.id },
        data: {
          rating: input.rating || undefined,
          comments: input.comments || undefined,
        },
      });

      // Update movie's average rating
      await updateMovieRating(updatedReview.movieId);
      return updatedReview;
    },
  })
  .mutation('deleteReview', {
    input: z.object({ id: z.number() }),
    async resolve({ input }) {
      const deletedReview = await prisma.review.delete({
        where: { id: input.id },
      });

      // Update movie's average rating
      await updateMovieRating(deletedReview.movieId);
      return deletedReview;
    },
  });

async function updateMovieRating(movieId: number) {
  const reviews = await prisma.review.findMany({
    where: { movieId },
  });

  const averageRating =
    reviews.reduce((acc: any, review:any) => acc + review.rating, 0) / reviews.length;

  await prisma.movie.update({
    where: { id: movieId },
    data: {
      averageRating: reviews.length ? averageRating : null,
    },
  });
}

export type AppRouter = typeof appRouter;
