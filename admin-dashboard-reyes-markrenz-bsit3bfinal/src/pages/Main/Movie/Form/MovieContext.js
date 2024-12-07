import React, { createContext, useState, useContext } from 'react';


const MovieContext = createContext();


export const useMovieContext = () => {
  return useContext(MovieContext);
};


export const MovieProvider = ({ children }) => {
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

  return (
    <MovieContext.Provider
      value={{
        query, setQuery,
        searchedMovieList, setSearchedMovieList,
        selectedMovie, setSelectedMovie,
        movie, setMovie,
        title, setTitle,
        overview, setOverview,
        popularity, setPopularity,
        releaseDate, setReleaseDate,
        voteAverage, setVoteAverage,
        cast, setCast,
        videos, setVideos,
        modalVideoId, setModalVideoId,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
