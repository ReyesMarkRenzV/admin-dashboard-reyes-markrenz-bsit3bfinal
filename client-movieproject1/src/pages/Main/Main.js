import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';

function Main() {
  const [loggingOut, setLoggingOut] = useState(false); 
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoggingOut(true); 
    localStorage.removeItem('accessToken');
    setTimeout(() => {
      setLoggingOut(false); 
      navigate('/Login'); 
    }, 1000); 
  };

  useEffect(() => {
    if (
      accessToken === undefined ||
      accessToken === '' ||
      accessToken === null
    ) {
      localStorage.removeItem('accessToken');
    }
  }, [accessToken]);

  return (
    <div className='Main'>
      <div className='container'>
        <div className='navigation'>
          <ul>
            <li>
              <a onClick={() => navigate('/Movie')}>Movies</a>
            </li>
            {accessToken ? (
              <li className='logout'>
                <a onClick={handleLogout}>
                  {loggingOut ? 'Logging out...' : 'Logout'}
                </a>
              </li>
            ) : (
              <li className='login'>
                <a onClick={() => navigate('/Login')}>Login</a>
              </li>
            )}
          </ul>
        </div>
        <div className='outlet'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;
