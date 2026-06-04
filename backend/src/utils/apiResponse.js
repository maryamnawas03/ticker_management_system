/**
 * CONCEPT: Standardized API Response Format
 * 
 * Problem: Without a standard format, responses are inconsistent
 * Frontend must handle different response structures
 * Makes error handling unpredictable
 * 
 * Solution: Create a class that formats all responses consistently
 * 
 * Benefits:
 * 1. Frontend knows exactly what structure to expect
 * 2. Easier debugging - consistent format across all endpoints
 * 3. Professional API design following REST conventions
 * 4. Automatic success flag based on status code
 * 5. Consistent error handling
 * 
 * Response Format:
 * {
 *   success: boolean (true if statusCode < 400),
 *   message: string (descriptive message),
 *   data: any (response payload),
 *   statusCode: number (HTTP status code)
 * }
 * 
 * Usage:
 * res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'))
 * res.status(201).json(new ApiResponse(201, ticket, 'Ticket created'))
 * res.status(400).json(new ApiResponse(400, null, 'Validation error'))
 */

class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // Automatically determine success
  }
}

export default ApiResponse;
