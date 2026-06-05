import { createSlice } from '@reduxjs/toolkit';

const ticketSlice = createSlice({
  name: 'tickets',
  initialState: {
    tickets: [],
    ticket: null,
    isLoading: false,
    error: null,
    pagination: { total: 0, page: 1, limit: 10, pages: 1 },
  },
  reducers: {
    clearTicketError: (state) => { state.error = null; },
    clearTicket: (state) => { state.ticket = null; },
  },
});

export const { clearTicketError, clearTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
