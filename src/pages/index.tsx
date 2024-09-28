// Example of fetching movies in a React component
import { useEffect, useState } from 'react';

const MovieList = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await fetch('/api/movie');
      const data = await response.json();
      setMovies(data);
    };

    fetchMovies();
  }, []);

  return (
    <div>
      {movies.map(movie => (
        <div key={movie.id}>{movie.name}</div>
      ))}
    </div>
  );
};

export default MovieList;
