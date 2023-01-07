import { ReactNode, createContext, useState, useEffect } from 'react';
import { notification } from 'antd';

export const AppContext = createContext<any>({});

function GlobalState({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      const token = await sessionStorage.getItem('vending-token');
      const existingUser = await localStorage.getItem('vending-user');
      if (token && existingUser) {
        setUser(JSON.parse(existingUser));
        setLoggedIn(true);
      }
    }
    checkLogin();

    // return () => {
    //   logout();
    // };
  }, []); // eslint-disable-line

  const logout = async () => {
    await localStorage.removeItem('vending-user');
    await sessionStorage.removeItem('vending-token');
    setUser(null);
    setProducts([]);
    setLoggedIn(false);
  }

  const login = async ({ token, userData }: { token: string, userData: any }) => {
    setLoggedIn(true);
    if (token) {
      await sessionStorage.setItem('vending-token', token);
    } else {
      await localStorage.setItem('vending-user', JSON.stringify(userData));
      setUser(userData);
    }
  }

  const errorCallback = (error = null) => {
    notification['error']({
      key: 'error',
      duration: 10,
      message: 'Error',
      description:
        error || 'There was an error loading data. Please see console output for details.',
    });
    console.error(error);
  };

  const successCallback = (message?: string, description?: string) => {
    notification['success']({
      duration: 10,
      message,
      description
    });
  }

  // Options API https://swr.vercel.app/docs/options
  // const { data, error } = useSWR(`${import.meta.env.VITE_API_BASE}/users`);
  // if (error) {
  //   errorCallback(error);
  // }

  // const { data: availableProducts, error: priceError } = useSWR(
  //   `${import.meta.env.VITE_API_BASE}/products`
  // );
  // if (priceError) {
  //   errorCallback(priceError);
  // }

  // useEffect(() => {
  //   availableProducts?.length && setProducts(availableProducts);
  // }, [availableProducts]); // eslint-disable-line

  // useEffect(() => {
  //   data && setUser(data);
  // }, [data]); // eslint-disable-line

  return (
    <AppContext.Provider
      value={{
        logout,
        login,
        setUser,
        isLoggedIn,
        user,
        products,
        setProducts,
        errorCallback,
        successCallback
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default GlobalState;