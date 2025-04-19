import { useState, createContext, useContext, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens'))
      : null
  );

  useEffect(() => {
    const checkLoggedIn = async () => {
      const storedTokens = localStorage.getItem('authTokens')
        ? JSON.parse(localStorage.getItem('authTokens'))
        : null;

      if (storedTokens && storedTokens.access) {
        api.defaults.headers.common['Authorization'] = `Bearer ${storedTokens.access}`;
        try {
          const res = await api.get('/api/users/profile/');
          if (res.data) {
            setUser(res.data);
          }
        } catch (error) {
          setUser(null);
          setAuthTokens(null);
          localStorage.removeItem('authTokens');
          localStorage.removeItem('isAuthenticated');
          delete api.defaults.headers.common['Authorization'];
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await api.post('/api/users/login/', { username, password });
      setUser(res.data.user);
      setAuthTokens({ access: res.data.access, refresh: res.data.refresh });
      localStorage.setItem(
        'authTokens',
        JSON.stringify({ access: res.data.access, refresh: res.data.refresh })
      );
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/');
    } catch (error) {
      console.error(
        'Login failed:',
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/api/users/register/', userData);
      console.log('Registration successful:', res.data);
      setUser(res.data.user);
      setAuthTokens({ access: res.data.access, refresh: res.data.refresh });
      localStorage.setItem(
        'authTokens',
        JSON.stringify({ access: res.data.access, refresh: res.data.refresh })
      );
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/');
    } catch (error) {
      console.error(
        'Registration failed:',
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/users/logout/');
      setUser(null);
      setAuthTokens(null);
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('authTokens');
      localStorage.removeItem('isAuthenticated');
      navigate('/login');
    } catch (error) {
      console.error(
        'Logout failed:',
        error.response ? error.response.data : error.message
      );
      // Optionally handle logout error
    }
  };

  const updateProfile = async (userData) => {
    try {
      const res = await api.patch('/api/users/profile/', userData);
      setUser(res.data);
      return res.data;
    } catch (error) {
      console.error(
        'Update profile failed:',
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    authTokens,
    setAuthTokens,
  };

  return (
    <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};