import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from '../context/globalState';
import callApi from '../utils/callApi';
import { successCallback } from '../utils/notification';
import { Logout, AddProducts, ManageProducts, ModeSelector } from '../components';
import { Product } from '../types/Product';

const Seller = () => {
  const { setProducts, logout, products} = useContext(AppContext);
  const navigate = useNavigate();
  const [mode, setMode] = useState('create');

  useEffect(() => {
    async function loadData() {
      const productsResponse = await callApi('get', 'products/seller'); 
      if (!productsResponse?.error) {
        setProducts(productsResponse);
      }
    }
    loadData();
  }, []); // eslint-disable-line

  const logoutCallback = async () => {
    await logout();
    navigate("/login");
  }

  const modeCallback = (mode: string) => {
    setMode(mode);
  }

  const addProducts = async (products: Product[]) => {
    const productsAdded: object[] = await callApi('post', 'products', products);
    successCallback(`Added ${productsAdded?.length} products`);
    if (productsAdded?.length) {
      const productsResponse = await callApi('get', 'products'); 
      if (!productsResponse?.error) {
        setProducts(productsResponse);
      }
    }
    setMode('manage');
  }

  const updateProduct = async (product: Product) => {
    const productId = product._id;
    const { amountAvailable, cost, image, productName, shelfLocation } = product;
    await callApi('put', `products/${productId}`, {
      amountAvailable, cost, image, productName, shelfLocation
    });
    successCallback(`Updated product ${product.productName}`);
    const productsResponse = await callApi('get', 'products'); 
    if (!productsResponse?.error) {
      setProducts(productsResponse);
    }
  }

  const deleteProduct = async (product: Product) => {
    const productId = product._id;
    await callApi('delete', `products/${productId}`);
    successCallback(`Deleted product ${product.productName}`);
    const productsResponse = await callApi('get', 'products'); 
    if (!productsResponse?.error) {
      setProducts(productsResponse);
    }
  }

  return (
    <div className='seller-wrapper'>
      <Logout callback={logoutCallback} />
      <div className='seller-content-wrapper'>
        <ModeSelector callback={modeCallback} />
        <div className='seller-content'>
          {
            mode === 'create' 
            ? <AddProducts callback={addProducts} />
            : (
              <ManageProducts 
                products={products} 
                updateCallback={updateProduct}
                deleteCallback={deleteProduct}
              />
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Seller;