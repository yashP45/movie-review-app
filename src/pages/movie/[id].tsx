import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import RatingModal from "../components/ReviewModal";
import Navbar from "../components/navbar";

const MovieReviews = () => {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState<any>(null);
  const [reviews, setReviews] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentReview, setCurrentReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMovieAndReviews = async (id: any) => {
    setLoading(true); 
    const movieResponse = await fetch(`/api/movie/${id}`);
    const movieData = await movieResponse.json();
    setMovie(movieData);
    const reviewsResponse = await fetch(`/api/movie/${id}/reviews`);
    const reviewsData = await reviewsResponse.json();
    setReviews(reviewsData);
    setLoading(false); 
  };

  useEffect(() => {
    if (id) {
      fetchMovieAndReviews(id);
    }
  }, [id]);

  const handleDeleteReview = async (reviewId: any) => {
    const response = await fetch(`/api/movie/${id}/reviews/${reviewId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setReviews(reviews.filter((review: any) => review.id !== reviewId));
    }
  };

  const openModal = (review: any = null) => {
    setCurrentReview(review);
    setShowModal(true);
  };

  return (
    <>
      <Navbar onReview={(id) => fetchMovieAndReviews(id)} />
      <div className="max-w-2xl mx-auto mt-5">
        {loading ? ( 
          <p>Loading...</p>
        ) : (
          <>
            {movie && (
              <div className="mb-5 flex items-center justify-between">
                <h1 className="text-3xl ">{movie.name}</h1>
                <p className="text-xl text-indigo-600">
                  Average Rating: {movie?.averageRating?.toFixed(2)}/10
                </p>
              </div>
            )}
            <div>
              <h2 className="text-xl mb-2">Reviews</h2>
              {reviews.map((review: any) => (
                <div
                  key={review.id}
                  className="border border-gray-300 rounded-lg p-2 mb-2 shadow-md"
                >
                  <div className="w-full flex justify-between">
                    <p className="font-bold text-xl">{review.comments}</p>
                    <p className="font-bold text-indigo-600">{review.rating}/10</p>
                  </div>
                  <p className="mt-10">By {review.reviewer}</p>

                  <div className="flex justify-end">
                    <button
                      onClick={() => openModal(review)}
                      className="text-indigo-600 mr-2"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {showModal && (
              <RatingModal
                isVisible={showModal}
                onClose={() => setShowModal(false)}
                reviewData={currentReview}
                onReview={fetchMovieAndReviews}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MovieReviews;
