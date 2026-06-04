/**
 * CONCEPT: Auto-Generated Ticket Numbering System
 * 
 * Problem: Need unique, human-readable identifiers like TKT-0001, TKT-0002
 * 
 * Solution: Generate based on highest existing ticket number
 * 
 * How it works:
 * 1. Query database for latest ticket sorted by creation date
 * 2. Extract numeric part from ticketNumber field
 * 3. Increment by 1
 * 4. Format as TKT-XXXX with leading zeros
 * 5. If no tickets exist, start from TKT-0001
 * 
 * Example sequence:
 * First ticket: TKT-0001
 * Second ticket: TKT-0002
 * Hundredth ticket: TKT-0100
 * Thousandth ticket: TKT-1000
 * 
 * This is called before creating a new ticket in the database
 */

import Ticket from '../models/Ticket.js';

const generateTicketNumber = async () => {
  try {
    // Find the latest ticket sorted by creation date
    const lastTicket = await Ticket.findOne()
      .sort({ createdAt: -1 })
      .select('ticketNumber');

    if (!lastTicket) {
      // Start from 0001 if no tickets exist
      return 'TKT-0001';
    }

    // Extract numeric part (e.g., "0005" from "TKT-0005")
    const lastNumber = parseInt(lastTicket.ticketNumber.split('-')[1]);
    const newNumber = lastNumber + 1;

    // Format with leading zeros (padStart(4, '0'))
    return `TKT-${String(newNumber).padStart(4, '0')}`;
  } catch (error) {
    throw new Error(`Error generating ticket number: ${error.message}`);
  }
};

export default generateTicketNumber;
