import { useEffect } from 'react';
import { useMovieContext } from '../../../../context/MovieContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './View.css';

function View() {
  const {
    movie,
    setMovie,
    cast,
    setCast,
    photos,
    setPhotos,
    videos,
    setVideos,
  } = useMovieContext();
  const { movieId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!movieId) {
      navigate('/'); 
      return;
    }

    axios
      .get(`http://localhost/movieproject-api/movies/${movieId}`)
      .then((response) => {
        setMovie(response.data);
      })
      .catch((e) => {
        navigate('/');
      });

    axios
      .get(`http://localhost/movieproject-api/casts/${movieId}`)
      .then((response) => {
        if (response.data) setCast(response.data);
      })
      .catch((e) => {});

    axios
      .get(`http://localhost/movieproject-api/photos/${movieId}`)
      .then((response) => {
        if (response.data) setPhotos(response.data);
      })
      .catch((e) => {});

    axios
      .get(`http://localhost/movieproject-api/videos/${movieId}`)
      .then((response) => {
        if (response.data) setVideos(response.data);
      })
      .catch((e) => {});
  }, [movieId, navigate, setMovie, setCast, setPhotos, setVideos]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="movie-view-container">
      <div className="banner">
        <h1>{movie.title}</h1>
        <img
          src={movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : 'default-image.jpg'}
          alt={`${movie.title} Poster`}
          className="movie-poster"
        />
      </div>

      <h3 className="movie-overview">{movie.overview}</h3>

      {cast && cast.length > 0 && (
        <div className="cast-section">
          <h2>Cast & Crew</h2>
          <div className="cast-list">
            {cast.map((castMember, index) => (
              <div key={index} className="cast-member">
                <img
                  src={castMember.profile_path ? `https://image.tmdb.org/t/p/w185${castMember.profile_path}` : 'default-image.jpg'}
                  alt={castMember.name}
                  className="cast-photo"
                />
                <p className="cast-name">{castMember.name}</p>
                <p className="cast-character">{castMember.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {videos && videos.length > 0 && (
        <div className="video-section">
          <h2>Videos</h2>
          <div className="video-list">
            {videos.map((video, index) => (
              <div key={index} className="video-item">
                <iframe
                  title={`video-${index}`}
                  width="320"
                  height="180"
                  src={`https://www.youtube.com/embed/${video.videoKey}`}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </div>
        </div>
      )}

      {photos && photos.length > 0 && (
        <div className="photo-section">
          <h2>Photos</h2>
          <div className="photo-gallery">
            {photos.map((photo, index) => (
              <div key={index} className="photo-item">
                <img
                  src={`https://image.tmdb.org/t/p/w500${photo.file_path}`}
                  alt={`photo-${index}`}
                  className="movie-photo"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default View;
