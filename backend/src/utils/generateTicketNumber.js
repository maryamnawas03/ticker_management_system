// Generates a sequential, human-readable, zero-padded ticket number (e.g. TKT-0001).

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
