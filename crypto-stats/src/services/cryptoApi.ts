import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiHeader = {
  'x-access-token': `${process.env.REACT_APP_COINRANK}`,
  'Access-Control-Allow-Origin': 'http://localhost:4000',
};

const baseUrl = 'https://api.coinranking.com/v2';

const createRequest = (url: string) => ({
  url,
  headers: apiHeader,
});

export const cryptoApi = createApi({
  reducerPath: 'cryptoApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptos: builder.query<any, string>({
      query: () => createRequest('/coins'),
    }),
  }),
});

export const { useGetCryptosQuery }: any = cryptoApi;
