import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const movieApi = createApi({
  reducerPath: 'movieApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.themoviedb.org/3' }),
  endpoints: (builder) => ({
    getMovies: builder.query({
      query: (type = 'popular') => {
        const API_KEY = '634fe8021bd7490d2e69e49e82825968';
        let endpoint = '';

        switch (type) {
          case 'Popular':
            endpoint = `/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
            break;
          case 'Theatre':
            endpoint = `/discover/movie?primary_release_date.gte=2014-09-15&primary_release_date.lte=2014-10-22&api_key=${API_KEY}`;
            break;
          case 'Drama':
            endpoint = `/discover/movie?with_genres=18&primary_release_year=2014&api_key=${API_KEY}`;
            break;
          case 'Comedie':
            endpoint = `/discover/movie?with_genres=35&with_cast=23659&sort_by=revenue.desc&api_key=${API_KEY}`;
            break;
          default:
            endpoint = `/search/movie?query=${type}&api_key=${API_KEY}`;
        }

        return endpoint;
      },
    }),
  }),
});

export const { useGetMoviesQuery } = movieApi;
