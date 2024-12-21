import { useNavigate } from 'react-router-dom';
import './Lists.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Lists = () => {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const getMovies = () => {
    axios.get('/movies').then((response) => {
      setLists(response.data);
    });
  };

  useEffect(() => {
    getMovies();
  }, []);

  const handleDelete = (id) => {
    const isConfirm = window.confirm(
      'Are you sure that you want to delete this data?'
    );
    if (isConfirm) {
      axios
        .delete(`/movies/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(() => {
          const updatedLists = lists.filter((movie) => movie.id !== id);
          setLists(updatedLists);
        });
    }
  };

  const filteredMovies = lists.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='lists-container'>
      <h1>Movies</h1>
      <div className='search-container'>
          <label>Search Movie</label>
        <input
          type='text'
          
          placeholder='Search by title...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='search-input'
        />
      </div>
      <div className='create-container'>
        <button
          type='button'
          onClick={() => navigate('/main/movies/form')}
          className='create-btn'
        >
          Create new
        </button>
      </div>
      <div className='table-container'>
        <table className='movie-lists'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovies.map((movie) => (
              <tr key={movie.id}>
                <td>{movie.id}</td>
                <td>{movie.title}</td>
                <td>
                  <button
                    type='button'
                    onClick={() => navigate('/main/movies/form/' + movie.id)}
                    className='edit-btn'
                  >
                    Edit
                  </button>
                  <button
                    type='button'
                    onClick={() => handleDelete(movie.id)}
                    className='delete-btn'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Lists;
