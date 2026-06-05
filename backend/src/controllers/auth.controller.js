import AuthService from '../services/auth.service.js';
import ApiResponse from '../utils/apiResponse.js';

/**
 * CONCEPT: Controller Layer
 * 
 * Controllers handle:
 * 1. Extracting request data (req.body, req.params)
 * 2. Calling service functions
 * 3. Formatting response using ApiResponse
 * 4. Passing errors to error middleware
 */

class AuthController {
  static async register(req, res, next) {
    const { name, email, password } = req.body;
    const result = await AuthService.register(name, email, password);
    return res.status(201).json(
      new ApiResponse(201, result, 'User registered successfully')
    );
  }

  static async login(req, res, next) {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    return res.status(200).json(
      new ApiResponse(200, result, 'Login successful')
    );
  }

  static async getCurrentUser(req, res, next) {
    const user = await AuthService.getCurrentUser(req.user._id);
    return res.status(200).json(
      new ApiResponse(200, user, 'User fetched successfully')
    );
  }
}

export default AuthController;
