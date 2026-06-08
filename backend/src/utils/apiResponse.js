// Unified standard envelope structure for all successful and error API responses.

class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // Automatically determine success
  }
}

export default ApiResponse;
