/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useLayoutEffect, useState, useEffect } from "react";

export const CryptoContext = createContext({});

export const CryptoProvider = ({ children }) => {
  const [cryptoData, setCryptoData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [coinData, setCoinData] = useState({});
  const [coinSearch, setCoinSearch] = useState("");
  const [currency, setCurrency] = useState("usd");
  const [sortBy, setSortBy] = useState("market_cap_desc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(250);
  const [error, setError] = useState({ data: "", coinData: "", search: "" });

  const getCryptoData = async () => {
    try {
      setError({ ...error, data: "" });
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${coinSearch}&order=${sortBy}&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=1h%2C24h%2C7d`
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        setError({ ...error, data: errorResponse.error });
        throw new Error(errorResponse.error);
      }

      const data = await response.json();
      setCryptoData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getCoinData = async (coinid) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinid}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=true&sparkline=false`
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        setError({ ...error, coinData: errorResponse.error });
        throw new Error(errorResponse.error);
      }

      const data = await response.json();
      setCoinData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getSearchResult = async (query) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${query}`
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        setError({ ...error, search: errorResponse.error });
        throw new Error(errorResponse.error);
      }

      const data = await response.json();
      setSearchData(data.coins);
    } catch (error) {
      console.error(error);
    }
  };

  const resetFunction = () => {
    setPage(1);
    setCoinSearch("");
  };

  useLayoutEffect(() => {
    getCryptoData();
  }, [coinSearch, currency, sortBy, page, perPage]);

  useEffect(() => {
    setTotalPages(cryptoData.length);
  }, [cryptoData]);

  return (
    <CryptoContext.Provider
      value={{
        cryptoData,
        searchData,
        getSearchResult,
        setCoinSearch,
        setSearchData,
        currency,
        setCurrency,
        sortBy,
        setSortBy,
        page,
        setPage,
        totalPages,
        resetFunction,
        setPerPage,
        perPage,
        getCoinData,
        coinData,
        error,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};