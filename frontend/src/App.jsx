import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Register from './pages/Register';
import Login from './pages/Login';
import { getToken } from "../src/utils/auth";
import Addmovie from './pages/Addmovie';
import Review from './pages/Review';
import User from './pages/User';

import MovieDetail from './pages/MovieDetail ';
import LogoutDisplay from './pages/LogoutDisplay'
import Profile from './pages/Profile';

function App() {
  const isAuthenticated = !!getToken();
  return (

    <>
      <BrowserRouter>
       <Routes>
         <Route path="/" element={isAuthenticated ? <Navigate to="/Home" /> : <Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/addmovie" element={<Addmovie />} />
        <Route path="/review" element={<Review />} />
        <Route path="/user" element={<User />} />

        {/* Movie Detail */}
          <Route path="/movie/:id" element={<MovieDetail />} />

          <Route path="/profile" element={<Profile />} />
        <Route path="/logout-display" element={<LogoutDisplay />} />
        
       </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
