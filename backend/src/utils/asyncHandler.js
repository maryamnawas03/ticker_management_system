/**
 * CONCEPT: Async Error Handler Wrapper
 * 
 * Problem: Express doesn't automatically catch errors in async functions.
 * Without this wrapper, thrown errors in async controllers would crash the server.
 * 
 * Solution: Wrap async functions to catch errors and pass to next middleware
 * 
 * How it works:
 * 1. Takes an async function as parameter
 * 2. Returns a new function that Express can call
 * 3. Wraps the async function in Promise.resolve()
 * 4. Catches any errors with .catch(next)
 * 5. Passes errors to error handling middleware
 * 
 * Usage Example:
 * // Instead of:
 * router.post('/', async (req, res) => { throw new Error(); })
 * 
 * // Use:
 * router.post('/', asyncHandler(async (req, res) => { throw new Error(); }))
 */

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
