import AuthService from '../services/auth.service.js';
import ApiResponse from '../utils/apiResponse.js';

// Router controllers for authentication, registration, and user session handshakes.

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
