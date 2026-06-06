import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUsersRequest,
  updateUserRoleRequest,
  updateUserStatusRequest,
} from '../../api/userApi';

// ── Async Thunks ──────────────────────────────────────────────────────────────

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {
      const data = await getUsersRequest(params);
      return data; // { users, pagination }
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch users');
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'users/updateRole',
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const data = await updateUserRoleRequest(id, role);
      return data; // updated user object
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update user role');
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'users/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const data = await updateUserStatusRequest(id, status);
      return data; // updated user object
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update user status');
    }
  }
);

// ── Slice Definition ──────────────────────────────────────────────────────────

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    isLoading: false,
    error: null,
    pagination: { total: 0, page: 1, limit: 10, pages: 1 },
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update User Role
      .addCase(updateUserRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedUser = action.payload;
        state.users = state.users.map((u) =>
          u._id === updatedUser._id ? updatedUser : u
        );
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update User Status
      .addCase(updateUserStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedUser = action.payload;
        state.users = state.users.map((u) =>
          u._id === updatedUser._id ? updatedUser : u
        );
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
