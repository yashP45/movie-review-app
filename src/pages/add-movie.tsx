import { useState } from 'react';
import { useRouter } from 'next/router';

const AddMovie = () => {
  const [name, setName] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [averageRating, setAverageRating] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await fetch('/api/movie/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, releaseDate, averageRating }),
    });

    if (response.ok) {
      router.push('/');
    } else {
      console.error('Failed to add movie');
    }
  };

  return (
    <div>
      <h1>Add Movie</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Release Date:</label>
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Average Rating:</label>
          <input
            type="number"
            step="0.1"
            value={averageRating}
            onChange={(e) => setAverageRating(e.target.value)}
          />
        </div>
        <button type="submit">Add Movie</button>
      </form>
    </div>
  );
};

export default AddMovie;