import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    agents: [],
    selectedUser: null,
    isLoading: false,
    error: null,
    pagination: { total: 0, page: 1, limit: 10, pages: 1 },
  },
  reducers: {
    clearUserError: (state) => { state.error = null; },
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
