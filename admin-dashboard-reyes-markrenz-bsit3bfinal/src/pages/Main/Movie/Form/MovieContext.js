import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

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
  const [photos, setPhotos] = useState([]); // Added photos state
  const [modalVideoId, setModalVideoId] = useState(null);

  // Function to save videos
  const saveVideos = async (movieId, videos) => {
    if (!videos || videos.length === 0) {
      console.log("No videos to save.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const userId = 1; // Adjust this as needed

    try {
      const videoPromises = videos.map((video) => {
        const videoData = {
          userId: userId,
          movieId: movieId,
          url: `https://www.youtube.com/embed/${video.key}`,
          name: video.name || "Video Title",
          site: "YouTube",
          videoKey: video.key,
          videoType: video.type || "Clip",
          official: 0,
        };

        return axios.post("/admin/videos", videoData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      });

      // Wait for all video posts to finish
      await Promise.all(videoPromises);
      console.log("Videos saved successfully");
    } catch (error) {
      console.error("Error saving videos:", error.response?.data || error.message);
      alert("Failed to save videos. Please try again.");
    }
  };

  // Function to save photos
  const savePhotos = async (movieId, photos) => {
    if (!photos || photos.length === 0) {
      console.log("No photos to save.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const userId = 1; // Adjust this as needed

    try {
      const photoPromises = photos.map((photo) => {
        const photoData = {
          userId: userId,
          movieId: movieId,
          url: `https://image.tmdb.org/t/p/original${photo.file_path}`, // Construct the URL for the photo
          description: photo.description || "", // Optional description if available
        };

        return axios.post("/admin/photos", photoData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      });

      // Wait for all photo posts to finish
      await Promise.all(photoPromises);
      console.log("Photos saved successfully");
    } catch (error) {
      console.error("Error saving photos:", error.response?.data || error.message);
      alert("Failed to save photos. Please try again.");
    }
  };

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
        photos, setPhotos, // Added photos
        modalVideoId, setModalVideoId,
        saveVideos, // Exposed saveVideos function
        savePhotos, // Exposed savePhotos function
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
