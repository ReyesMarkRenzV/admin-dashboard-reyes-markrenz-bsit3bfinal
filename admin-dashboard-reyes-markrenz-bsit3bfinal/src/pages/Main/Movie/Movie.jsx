import { Outlet } from 'react-router-dom';
import './Movie.css'

const Movie = () => {
  return (
    <>
      <h1>Movies</h1>
      <Outlet />
    </>
  );
};

export default Movie;
