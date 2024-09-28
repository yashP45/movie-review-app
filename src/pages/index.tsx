import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import './globals.css'
import Modal from './components/Modal'; 
import Navbar from './components/navbar';
const MovieList = () => {
  const [movies, setMovies] = useState<any>([]);
  const [isModalVisible, setModalVisible] = useState(false); 
  const [selectedMovie, setSelectedMovie] = useState<any>(null); 
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const router = useRouter();
  const fetchMovies = async () => {
    const response = await fetch('/api/movie');
    const data = await response.json();
    setMovies(data);
  };
  useEffect(() => {
    fetchMovies();
  }, []);

  const handleMovieClick = (id: any) => {
    router.push(`/movie/${id}`);
  };
  const deleteMovie = async (id: number) => {
    const response = await fetch(`/api/movie/${id}`, {
      method: 'DELETE',
    });
  
    if (response.ok) {
      setMovies(movies.filter((movie: any) => movie.id !== id)); 
    } else {
      console.error('Failed to delete movie');
    }
  };
  const openModal = (movie: any) => {
    setSelectedMovie(movie);
    setModalVisible(true); 
  };

  const closeModal = () => {
    setModalVisible(false); 
    setSelectedMovie(null); 
  };

  const filteredMovies = movies.filter((movie: any) => 
    movie.name.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  return (
    <> <Navbar 
    onSuccess={fetchMovies} // Pass the fetchMovies function
  />
    <div className="p-6 bg-gray-100 min-h-screen">
      
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          The best movie reviews site!
        </h1>
        <input
          type="text"
          placeholder="Search for your favourite movie"
          className="w-full p-3 mb-6 border border-gray-300 rounded-md"
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMovies.map((movie : any) => (
            <div
              key={movie.id}
              className="p-4 bg-purple-100 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleMovieClick(movie.id)} 
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {movie.name}
              </h2>
              <p className="text-gray-600 mt-2">Released: {movie.releaseDate}</p>
              <p className="text-gray-700 mt-2 font-bold">Rating: {movie?.averageRating?.toFixed(2)}/10</p>

              <div className="flex justify-end mt-4">
                <button className="text-blue-500 hover:text-blue-700 mr-3" onClick={(e) => { e.stopPropagation(); openModal(movie); }}>
                
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.232 5.232l3.536 3.536m-2.036-1.5L15.75 9.75M9 13.25l1.5 1.5m4-4l1.5-1.5M21 21H3m3-3 3 3 9-9m-3 3 3-3"
                    />
                  </svg>
                </button>
                <button className="text-red-500 hover:text-red-700" onClick={(e) => { e.stopPropagation(); deleteMovie(movie.id); }}>
      
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 13H5v-2h14v2zm2 7H3a2 2 0 01-2-2V5a2 2 0 012-2h18a2 2 0 012 2v13a2 2 0 01-2 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal 
        isVisible={isModalVisible} 
        onClose={closeModal} 
        movie={selectedMovie} 

      />
    </div>
    </>
  );
};

export default MovieList;
