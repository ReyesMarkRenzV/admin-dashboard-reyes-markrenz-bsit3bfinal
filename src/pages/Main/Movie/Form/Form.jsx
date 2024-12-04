import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Form.css';

const Form = () => {
  const [query, setQuery] = useState('');
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const [updatedMovie, setUpdatedMovie] = useState({
    original_title: '',
    overview: '',
    popularity: '',
    release_date: '',
    vote_average: '',
    poster_path: '',
  });

  let { movieId } = useParams();

  const handleSearch = useCallback(() => {
    if (query.trim() === '') return; // Avoid empty searches

    axios({
      method: 'get',
      url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
      headers: {
        Accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NGY1MTAzMGM0ZDViYjQxNDQ5MmFmMDAwYjE0OWY3NCIsIm5iZiI6MTczMzI4MzU4Ny42NzcsInN1YiI6IjY3NGZjZjAzY2IxZTEyMGNjYjVkYzNkNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.10Q9xIm2LkFQcR64kN1CyIym49x5fejq-EKIeJMpd34', // Replace with your actual token
      },
    }).then((response) => {
      setSearchedMovieList(response.data.results);
    });
  }, [query]);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setUpdatedMovie({
      original_title: movie.original_title,
      overview: movie.overview,
      popularity: movie.popularity,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      poster_path: movie.poster_path,
    });

    // Clear the searched movie list once a movie is selected
    setSearchedMovieList([]);
  };

  const handleSave = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('No access token found!');
      return;
    }

    if (!selectedMovie) {
      alert('Please search and select a movie.');
      return;
    }

    const data = {
      tmdbId: selectedMovie.id,
      title: updatedMovie.original_title,
      overview: updatedMovie.overview,
      popularity: updatedMovie.popularity,
      releaseDate: updatedMovie.release_date,
      voteAverage: updatedMovie.vote_average,
      backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
      posterPath: `https://image.tmdb.org/t/p/original/${updatedMovie.poster_path}`,
      isFeatured: 0,
    };

    console.log('Saving movie with data:', data);

    const request = axios({
      method: movieId ? 'patch' : 'post',
      url: movieId ? `/movies/${movieId}` : '/movies',
      data: data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((saveResponse) => {
        console.log('Save successful:', saveResponse);
        alert('Movie saved successfully');
      })
      .catch((error) => {
        console.error('Error details:', error.response ? error.response.data : error.message);
        alert('Error saving movie. Please check the console for more details.');
      });
  };

  useEffect(() => {
    if (movieId) {
      axios.get(`/movies/${movieId}`).then((response) => {
        const movieData = response.data;
        setSelectedMovie({
          id: movieData.tmdbId,
          original_title: movieData.title,
          overview: movieData.overview,
          popularity: movieData.popularity,
          release_date: movieData.releaseDate,
          vote_average: movieData.voteAverage,
          poster_path: movieData.posterPath,
        });
        setUpdatedMovie({
          original_title: movieData.title,
          overview: movieData.overview,
          popularity: movieData.popularity,
          release_date: movieData.releaseDate,
          vote_average: movieData.voteAverage,
          poster_path: movieData.posterPath,
        });
      });
    }
  }, [movieId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedMovie((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="lists-container">
      <h1>{movieId !== undefined ? 'Edit ' : 'Create '} Movie</h1>

      {movieId === undefined && (
        <div className="search-container">
          <label>Search Movie:</label>
          <input
            className="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" onClick={handleSearch}>Search</button>
          
          <div className="searched-movie">
            {searchedMovieList.map((movie) => (
              <div
                key={movie.id}
                className="movie-item"
                onClick={() => handleSelectMovie(movie)}
              >
                <img
                  className="movie-poster"
                  src={`https://image.tmdb.org/t/p/w92/${movie.poster_path}`}
                  alt={movie.original_title}
                />
                <p className="movie-title">{movie.original_title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="container">
        <form>
          {selectedMovie && updatedMovie.poster_path && (
            <img
              className="poster-image"
              src={`https://image.tmdb.org/t/p/original/${updatedMovie.poster_path}`}
              alt="Poster"
            />
          )}
          <div className="field">
            Title:
            <input
              type="text"
              name="original_title"
              value={updatedMovie.original_title}
              onChange={handleInputChange}
            />
          </div>
          <div className="field">
            Overview:
            <textarea
              rows={10}
              name="overview"
              value={updatedMovie.overview}
              onChange={handleInputChange}
            />
          </div>

          <div className="field">
            Popularity:
            <input
              type="text"
              name="popularity"
              value={updatedMovie.popularity}
              onChange={handleInputChange}
            />
          </div>

          <div className="field">
            Release Date:
            <input
              type="text"
              name="release_date"
              value={updatedMovie.release_date}
              onChange={handleInputChange}
            />
          </div>

          <div className="field">
            Vote Average:
            <input
              type="text"
              name="vote_average"
              value={updatedMovie.vote_average}
              onChange={handleInputChange}
            />
          </div>

          <button type="button" onClick={handleSave}>Save</button>
        </form>
      </div>
    </div>
  );
};

export default Form;
