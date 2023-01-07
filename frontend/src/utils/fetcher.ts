import axios from 'axios';

export const fetcher = async (url: string) => {
  const headers: any = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
  };

  const token = await sessionStorage.getItem('vending-token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  axios
    .get(url, { headers })
    .then((res) => res.data)
    .catch(() => {
      // console.error(err);
      return [];
    });
}