import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from 'next/router';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  movie?: { name: string; releaseDate: string , id:number }; 
  onSuccess? : () => void
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, movie , onSuccess  }) => {
  const [name, setName] = useState(movie?.name || ''); 
  const [releaseDate, setReleaseDate] = useState(movie?.releaseDate || ''); 

  useEffect(() => {
    if (movie) {
      setName(movie.name); 
      setReleaseDate(movie.releaseDate.split('T')[0]); 
    }
  }, [movie]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch(movie ? `/api/movie/${movie.id}` : '/api/movie/add', { 
      method: movie ? 'PUT' : 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, releaseDate }),
    });

    if (response.ok) {
      onClose();
      onSuccess?.()
    } else {
      console.error('Failed to add/edit movie'); 
    }
  };
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Add New Movie</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="releaseDate">
              Release Date
            </label>
            <input
              type="date"
              id="releaseDate"
              value={releaseDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setReleaseDate(e.target.value)}
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

export default Modal;
