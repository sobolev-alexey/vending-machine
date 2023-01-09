import { useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from '../context/globalState';
import callApi from '../utils/callApi';
import { successCallback, errorCallback } from '../utils/notification';
import { Logout, Vending } from '../components';

const Buyer = () => {
  const { setProducts, logout } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const productsResponse = await callApi('get', 'products'); 
      if (!productsResponse?.error) {
        setProducts(productsResponse);
      }
    }
    loadData();
  }, []); // eslint-disable-line

  const depositFunds = async (deposit: number): Promise<void> => {
    await callApi('put', 'users/deposit', { deposit });
  }
  
  const buyProduct = async (id: string, quantity: number = 1): Promise<void> => {
    const response = await callApi('post', `products/buy/${id}`, { quantity });
    const coins = [5, 10, 20, 50, 100];
    const formatter = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
    const change = response?.change
      ?.map((count: number, index: number) => 
        count ? `${count} x ${formatter.format(coins[index] / 100)}` : '')
      ?.filter((value: string) => value)
      ?.reverse()
      ?.join(" + ");

    successCallback('Collect change', change);

    await new Promise(resolve => setTimeout(resolve, 1500));
    const productsResponse = await callApi('get', 'products'); 
    if (!productsResponse?.error) {
      setProducts(productsResponse);
    }
  }
  
  const resetWallet = async (): Promise<void> => {
    await callApi('post', 'users/reset');
  }

  const logoutCallback = async () => {
    await logout();
    navigate("/login");
  }

  return (
    <div className='vending-machine-wrapper'>
      <Logout callback={logoutCallback} />
      <Vending 
        depositCallback={depositFunds}
        buyCallback={buyProduct}
        resetCallback={resetWallet}
      />
    </div>
  );
};

export default Buyer;