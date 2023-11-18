import { apiSlice } from './apiSlice';
import { BOOKING_URL, PAYPAL_URL } from '../constants';

export const bookingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (booking) => ({
        url: BOOKING_URL,
        method: 'POST',
        body: booking,
      }),
    }),
    getMyBookings: builder.query({
      query: () => ({
        url: `${BOOKING_URL}/mybookings`,
      }),
    }),
    getBookingDetails: builder.query({
      query: (id) => ({
        url: `${BOOKING_URL}/${id}`,
      }),
    }),
    updateBookingToPaid: builder.mutation({
      query: (id) => ({
        url: `${BOOKING_URL}/${id}/pay`,
        method: 'PUT',
      }),
    }),
    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getBookings: builder.query({
      query: () => ({
        url: `${BOOKING_URL}`,
      }),
    }),
    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `${BOOKING_URL}/${id}/cancel`,
        method: 'PUT',
      }),
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetBookingDetailsQuery,
  useUpdateBookingToPaidMutation,
  useGetBookingsQuery,
  useGetPaypalClientIdQuery,
  useCancelBookingMutation,
} = bookingApiSlice;
