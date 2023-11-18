import { HOTELS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const hotelsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHotels: builder.query({
      query: ({ keyword, pageNumber, latitude, longitude, radius }) => ({
        url: HOTELS_URL,
        params: { keyword, pageNumber, latitude, longitude, radius },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Hotels'],
    }),
    getHotelsByLocation: builder.query({
      query: ({ keyword, pageNumber, latitude, longitude, radius }) => ({
        url: HOTELS_URL,
        params: { keyword, pageNumber, latitude, longitude, radius },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Hotels'],
    }),

    getHotelDetails: builder.query({
      query: (hotelId) => ({
        url: `${HOTELS_URL}/${hotelId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createHotel: builder.mutation({
      query: () => ({
        url: `${HOTELS_URL}`,
        method: 'POST',
      }),
      invalidatesTags: ['Hotel'],
    }),
    updateHotel: builder.mutation({
      query: (data) => ({
        url: `${HOTELS_URL}/${data.hotelId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Hotels'],
    }),
    uploadHotelImage: builder.mutation({
      query: (data) => ({
        url: `/api/upload`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteHotel: builder.mutation({
      query: (hotelId) => ({
        url: `${HOTELS_URL}/${hotelId}`,
        method: 'DELETE',
      }),
      providesTags: ['Hotel'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${HOTELS_URL}/${data.hotelId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Hotel'],
    }),
    getTopHotels: builder.query({
      query: () => `${HOTELS_URL}/top`,
      keepUnusedDataFor: 5,
    }),
    searchHotelsByLocation: builder.query({
      query: ({ latitude, longitude, radius }) => ({
        url: `${HOTELS_URL}/search`,
        params: { latitude, longitude, radius },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Hotels'],
    }),
  }),
});

export const {
  useGetHotelsQuery,
  useGetHotelDetailsQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useUploadHotelImageMutation,
  useDeleteHotelMutation,
  useCreateReviewMutation,
  useGetTopHotelsQuery,
  useSearchHotelsByLocationQuery,
  useGetHotelsByLocationQuery,
} = hotelsApiSlice;
