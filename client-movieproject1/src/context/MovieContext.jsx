import { useContext, createContext, useState } from 'react';

const MovieContext = createContext({
  movieList: [],
  setMovieList: () => {},
  movie: undefined,
  setMovie: () => {},
  cast: [],
  setCast: () => {},
  photos: [],
  setPhotos: () => {},
  videos: [],
  setVideos: () => {},
});

function MovieContextProvider({ children }) {
  const [movieList, setMovieList] = useState([]);
  const [movie, setMovie] = useState(undefined);
  const [cast, setCast] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);

  return (
    <MovieContext.Provider
      value={{
        movieList,
        setMovieList,
        movie,
        setMovie,
        cast,
        setCast,
        photos,
        setPhotos,
        videos,
        setVideos,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export default MovieContextProvider;

export const useMovieContext = () => {
  const data = useContext(MovieContext);
  return data;
};
