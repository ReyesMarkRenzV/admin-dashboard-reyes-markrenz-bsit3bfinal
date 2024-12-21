import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';

function Main() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  const handleMovie = () => {
    navigate('/main/movies')
  }

  useEffect(() => {
    if (
      accessToken === undefined ||
      accessToken === '' ||
      accessToken === null
    ) {
      handleLogout();
    }
  }, []);
  
  return (
    <div className='Main'>
      <div className='container'>
        <div className='navigation'>
            <div className='Movies'>
              <a onClick={handleMovie}>Movies</a>
            </div>
            <div className='logout'>
              <a onClick={handleLogout}>Logout</a>
            </div>
        </div>  
        <div className='outlet'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;
