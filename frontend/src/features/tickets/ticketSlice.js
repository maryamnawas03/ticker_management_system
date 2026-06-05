import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getTicketsRequest,
  getTicketByIdRequest,
  createTicketRequest,
  updateTicketRequest,
  deleteTicketRequest,
  updateTicketStatusRequest,
  assignTicketRequest,
  addCommentRequest,
} from '../../api/ticketApi';

// ── Async Thunks ──────────────────────────────────────────────────────────────

export const fetchTickets = createAsyncThunk(
  'tickets/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const data = await getTicketsRequest(params);
      return data; // contains tickets and pagination
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch tickets');
    }
  }
);

export const fetchTicketById = createAsyncThunk(
  'tickets/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await getTicketByIdRequest(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch ticket details');
    }
  }
);

export const createTicket = createAsyncThunk(
  'tickets/create',
  async (ticketData, { rejectWithValue }) => {
    try {
      const data = await createTicketRequest(ticketData);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create ticket');
    }
  }
);

export const updateTicket = createAsyncThunk(
  'tickets/update',
  async ({ id, ticketData }, { rejectWithValue }) => {
    try {
      const data = await updateTicketRequest(id, ticketData);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update ticket');
    }
  }
);

export const deleteTicket = createAsyncThunk(
  'tickets/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteTicketRequest(id);
      return { id };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete ticket');
    }
  }
);

export const updateTicketStatus = createAsyncThunk(
  'tickets/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const data = await updateTicketStatusRequest(id, status);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update status');
    }
  }
);

export const assignTicket = createAsyncThunk(
  'tickets/assign',
  async ({ id, agentId }, { rejectWithValue }) => {
    try {
      const data = await assignTicketRequest(id, agentId);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to assign ticket');
    }
  }
);

export const addComment = createAsyncThunk(
  'tickets/addComment',
  async ({ id, message }, { rejectWithValue }) => {
    try {
      const data = await addCommentRequest(id, message);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to add comment');
    }
  }
);

// ── Initial State ─────────────────────────────────────────────────────────────

const initialState = {
  tickets: [],
  ticket: null,
  isLoading: false,
  commentLoading: false,
  error: null,
  pagination: { total: 0, page: 1, limit: 10, pages: 1 },
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    clearTicketError: (state) => {
      state.error = null;
    },
    clearTicket: (state) => {
      state.ticket = null;
    },
  },
  extraReducers: (builder) => {
    // Helper helper to handle pending/rejected
    const setPending = (state) => {
      state.isLoading = true;
      state.error = null;
    };
    const setRejected = (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    };

    builder
      // ── Fetch Tickets ──────────────────────────────────────
      .addCase(fetchTickets.pending, setPending)
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = action.payload.tickets;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTickets.rejected, setRejected)

      // ── Fetch Ticket By ID ──────────────────────────────────
      .addCase(fetchTicketById.pending, (state) => {
        state.isLoading = true;
        state.ticket = null; // Clear old ticket to prevent flickering
        state.error = null;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ticket = action.payload;
      })
      .addCase(fetchTicketById.rejected, setRejected)

      // ── Create Ticket ───────────────────────────────────────
      .addCase(createTicket.pending, setPending)
      .addCase(createTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets.unshift(action.payload);
      })
      .addCase(createTicket.rejected, setRejected)

      // ── Update Ticket ───────────────────────────────────────
      .addCase(updateTicket.pending, setPending)
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ticket = action.payload;
        // Update in lists
        state.tickets = state.tickets.map((t) =>
          t._id === action.payload._id ? action.payload : t
        );
      })
      .addCase(updateTicket.rejected, setRejected)

      // ── Delete Ticket ───────────────────────────────────────
      .addCase(deleteTicket.pending, setPending)
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = state.tickets.filter((t) => t._id !== action.payload.id);
        state.ticket = null;
      })
      .addCase(deleteTicket.rejected, setRejected)

      // ── Update Ticket Status ────────────────────────────────
      .addCase(updateTicketStatus.pending, setPending)
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ticket = action.payload;
        state.tickets = state.tickets.map((t) =>
          t._id === action.payload._id ? action.payload : t
        );
      })
      .addCase(updateTicketStatus.rejected, setRejected)

      // ── Assign Ticket ───────────────────────────────────────
      .addCase(assignTicket.pending, setPending)
      .addCase(assignTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ticket = action.payload;
        state.tickets = state.tickets.map((t) =>
          t._id === action.payload._id ? action.payload : t
        );
      })
      .addCase(assignTicket.rejected, setRejected)

      // ── Add Comment ─────────────────────────────────────────
      // Note: We don't set full page isLoading = true here to avoid resetting the entire form/view
      .addCase(addComment.pending, (state) => {
        state.commentLoading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.commentLoading = false;
        state.ticket = action.payload;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.commentLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTicketError, clearTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
