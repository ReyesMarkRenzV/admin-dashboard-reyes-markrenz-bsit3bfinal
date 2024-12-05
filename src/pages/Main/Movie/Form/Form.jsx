import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Form.css';

const Form = () => {
  const [query, setQuery] = useState('');
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const [movie, setMovie] = useState(undefined);
  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [popularity, setPopularity] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [voteAverage, setVoteAverage] = useState('');
  const [cast, setCast] = useState([]); 
  const [videos, setVideos] = useState([]); 
  const [modalVideoId, setModalVideoId] = useState(null); 

  let { movieId } = useParams();

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOWM3ZGM3MWMyNzFiOWVlZmEyNjcxOWYzNmNhNjZiZCIsIm5iZiI6MTczMzM2OTIxMi42ODMsInN1YiI6IjY3NTExZDdjNzBmN2JjNmQ2N2ZjYzVmNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4w9FQXtYVyJA-7ZDEYxKZ67gBRcTTEPGRwWWNQHqa6Q', // Replace with your actual API key
        },
      }).then((response) => {
        setSearchedMovieList(response.data.results);
      });
    } else {
      setSearchedMovieList([]);
    }
  }, [query]);

  useEffect(() => {
    handleSearch();
  }, [query, handleSearch]);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setTitle(movie.original_title);
    setOverview(movie.overview);
    setPopularity(movie.popularity);
    setReleaseDate(movie.release_date);
    setVoteAverage(movie.vote_average);

    
    fetchMovieDetails(movie.id);

    
    setQuery('');
    setSearchedMovieList([]);
  };

  
  const fetchMovieDetails = (movieId) => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOWM3ZGM3MWMyNzFiOWVlZmEyNjcxOWYzNmNhNjZiZCIsIm5iZiI6MTczMzM2OTIxMi42ODMsInN1YiI6IjY3NTExZDdjNzBmN2JjNmQ2N2ZjYzVmNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4w9FQXtYVyJA-7ZDEYxKZ67gBRcTTEPGRwWWNQHqa6Q', // Replace with your actual API key
        },
      })
      .then((response) => {
        setCast(response.data.cast); 
      });

    axios
      .get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOWM3ZGM3MWMyNzFiOWVlZmEyNjcxOWYzNmNhNjZiZCIsIm5iZiI6MTczMzM2OTIxMi42ODMsInN1YiI6IjY3NTExZDdjNzBmN2JjNmQ2N2ZjYzVmNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4w9FQXtYVyJA-7ZDEYxKZ67gBRcTTEPGRwWWNQHqa6Q', // Replace with your actual API key
        },
      })
      .then((response) => {
        setVideos(response.data.results); 
      });
  };

  
  const openVideoModal = (videoId) => {
    setModalVideoId(videoId);
  };


  const closeVideoModal = () => {
    setModalVideoId(null);
  };

  const handleSave = () => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!selectedMovie) {
      alert('Please search and select a movie.');
    } else {
      const data = {
        tmdbId: selectedMovie.id,
        title,
        overview,
        popularity,
        releaseDate,
        voteAverage,
        backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
        posterPath: `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`,
        isFeatured: 0,
        movieId: movieId, 
      };

      
      axios({
        method: 'post', 
        url: '/movies', 
        data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(() => alert('Successfully Saved!'))
        .catch((error) => {
          console.error('Error:', error.response || error.message || error);
          alert('Failed to save. Check the console for details.');
        });
    }
  };

  useEffect(() => {
    if (movieId) {
      axios.get(`/movies/${movieId}`).then((response) => {
        setMovie(response.data);
        const tempData = {
          id: response.data.tmdbId,
          original_title: response.data.title,
          overview: response.data.overview,
          popularity: response.data.popularity,
          poster_path: response.data.posterPath,
          release_date: response.data.releaseDate,
          vote_average: response.data.voteAverage,
        };
        setSelectedMovie(tempData);
        setTitle(response.data.title);
        setOverview(response.data.overview);
        setPopularity(response.data.popularity);
        setReleaseDate(response.data.releaseDate);
        setVoteAverage(response.data.voteAverage);
      });
    }
  }, [movieId]);

  return (
    <>
      <h1>{movieId ? 'Edit ' : 'Create '} Movie</h1>

      {!movieId && (
        <div className="search-container">
          <label>
            Search Movie:
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for movies..."
            />
          </label>
          <div className="searched-movie">
            {searchedMovieList.map((movie) => (
              <div key={movie.id} className="search-result" onClick={() => handleSelectMovie(movie)}>
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w92/${movie.poster_path}`
                      : 'https://via.placeholder.com/50x75?text=No+Image'
                  }
                  alt={movie.original_title}
                />
                <div>
                  <p><strong>{movie.original_title}</strong></p>
                  <p style={{ fontSize: '12px', color: '#555' }}>
                    {movie.release_date ? `Release: ${movie.release_date}` : 'No release date'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="container">
        <form>
          {selectedMovie && (
            <img
              className="poster-image"
              src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}
              alt={selectedMovie.title}
            />
          )}

          <div className="field">
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="field">
            Overview:
            <textarea
              rows={10}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
            />
          </div>

          <div className="field">
            Popularity:
            <input
              type="text"
              value={popularity}
              onChange={(e) => setPopularity(e.target.value)}
            />
          </div>

          <div className="field">
            Release Date:
            <input
              type="text"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
            />
          </div>

          <div className="field">
            Vote Average:
            <input
              type="text"
              value={voteAverage}
              onChange={(e) => setVoteAverage(e.target.value)}
            />
          </div>

          <button type="button" onClick={handleSave}>
            Save
          </button>
        </form>
      </div>

      {/* Cast List */}
      <div className="cast-container">
        <h3>Cast</h3>
        <div className="cast-list">
          {cast.map((actor) => (
            <div key={actor.id} className="cast-member">
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w92/${actor.profile_path}`
                    : 'https://via.placeholder.com/92x138?text=No+Image'
                }
                alt={actor.name}
                className="cast-image"
              />
              <p>{actor.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Video Thumbnails */}
      <div className="videos-container">
        <h3>Video</h3>
        {videos.map((video) => (
          <div key={video.id} className="video-thumbnail" onClick={() => openVideoModal(video.key)}>
            <img
              src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
              alt={video.name}
              className="video-thumbnail-image"
            />
            <p>{video.name}</p>
          </div>
        ))}
      </div>

      {/* Modal for YouTube video */}
      {modalVideoId && (
        <div className="video-modal">
          <button className="close-modal" onClick={closeVideoModal}>
            X
          </button>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${modalVideoId}`}
            title="YouTube video player"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </>
  );
};

export default Form;
