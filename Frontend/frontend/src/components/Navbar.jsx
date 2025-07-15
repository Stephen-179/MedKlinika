import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="w-full bg-primary text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">MedKlinika</Link>
      <Button variant="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </nav>
  );
};

export default Navbar;
