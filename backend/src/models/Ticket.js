import mongoose from 'mongoose';

/**
 * CONCEPT: MongoDB Ticket Schema
 * 
 * This schema defines the structure of support tickets.
 * It tracks:
 * 1. Ticket details (title, description, category, priority)
 * 2. Status lifecycle (Open → In Progress → Resolved → Closed)
 * 3. Assignment (which agent handles it)
 * 4. Comments (conversation thread)
 * 5. Status history (audit trail of all changes)
 * 
 * References (ObjectId Foreign Keys):
 * - createdBy: User ObjectId (who created)
 * - assignedTo: User ObjectId (which agent)
 * - comments[].user: User ObjectId (who commented)
 * - statusHistory[].changedBy: User ObjectId (who changed)
 * 
 * Key Design Pattern: Embedding vs Referencing
 * - Comments and statusHistory are EMBEDDED (within ticket)
 * - User references are REFERENCED (linked via ObjectId)
 * - This balances query performance with data normalization
 */

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      enum: ['Bug', 'Feature Request', 'Technical Issue', 'Payment Issue', 'Account Issue', 'Other'],
      required: [true, 'Category is required'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Comments are embedded (array within ticket)
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Status history is embedded for audit trail
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
