import { useContext, useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
import Vending from '../components/vending/Vending';
import { AppContext } from '../context/globalState';
import callApi from '../utils/callApi';
import { successCallback, errorCallback } from '../utils/notification';

const Buyer = () => {
  const { login, setProducts, setUser } = useContext(AppContext);

  useEffect(() => {
    async function loadData() {
      const userResponse = await callApi('get', 'users'); 
      const productsResponse = await callApi('get', 'products'); 

      if (!userResponse?.error) {
        await login({ userData: userResponse });
      }
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

  return (
    <div className='vending-machine-wrapper'>
      <Vending 
        depositCallback={depositFunds}
        buyCallback={buyProduct}
        resetCallback={resetWallet}
      />
    </div>
  );
};

export default Buyer;