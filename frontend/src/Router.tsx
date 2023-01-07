import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppContext } from './context/globalState';
import { 
  Buyer,
  Seller,
  Login, 
  Register,
} from './pages';

const protectedRoutes = [
  {
    path: '/seller',
    main: <Seller />
  },
  {
    path: '/buyer',
    main: <Buyer />
  }
];

const Router = () => {
  const { isLoggedIn } = useContext(AppContext);

  return (
    <BrowserRouter>
      <Routes>
        {protectedRoutes.map(route =>
          isLoggedIn ? (
            <Route key={route.path} path={route.path} element={route.main} />
          ) : (
            <Route key={route.path} path={route.path} element={<Login />} />
          )
        )}
        <Route path={'/register'} element={<Register />} />
        <Route index element={<Login />} />
        <Route path='*' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;