import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";

import { useRouter } from "next/router";
interface RatingModalProps {
  isVisible: boolean;
  onClose: () => void;
  reviewData?: { reviewer: string; rating: string; comments: string ; movieId: number; id: number }; 
  onReview?: (id: any) => void
}

const RatingModal: React.FC<RatingModalProps> = ({ isVisible, onClose , reviewData , onReview }) => {
    const [reviewer, setReviewer] = useState(reviewData?.reviewer || ''); 
    const [rating, setRating] = useState(reviewData?.rating || ''); 
    const [comments, setComments] = useState(reviewData?.comments || ''); 
    const router = useRouter();
  const { id } = router.query;

  const [selectedMovieId, setSelectedMovieId] = useState<number | undefined>(reviewData?.movieId || Number(id) );
  const [movies, setMovies] = useState<{ id: number; name: string }[]>([]);
  useEffect(() => {
    const fetchMovies = async () => {
      const response = await fetch('/api/movie'); 
      const data = await response.json();
      setMovies(data);
    };
    fetchMovies();
  }, []);

  const handleMovieChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedMovieId( Number(e.target.value));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch( reviewData ? `/api/movie/${selectedMovieId}/reviews/${reviewData.id}` : `/api/movie/${selectedMovieId}/reviews`, {
      method: reviewData? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviewer, rating, comments }),
    });

    if (response.ok) {
      onReview?.(reviewData ? reviewData.movieId : selectedMovieId);
      onClose(); 
    
    } else {
      console.error('Failed to add rating');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Add New Rating</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="movie">
              Select Movie
            </label>
            <select
              id="movie"
              value={selectedMovieId}
              onChange={handleMovieChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a movie</option>
              {movies.map(movie => (
                <option key={movie.id} value={movie.id}>
                  {movie.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reviewer">
              Reviewer
            </label>
            <input
              type="text"
              id="reviewer"
              value={reviewer}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setReviewer(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
              Rating
            </label>
            <input
              type="number"
              id="rating"
              value={rating}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setRating(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comments">
              Comments
            </label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComments(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="text-gray-500 bg-gray-200 px-4 py-2 rounded-lg mr-3"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;