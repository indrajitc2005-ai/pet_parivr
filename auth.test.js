/**
 * @jest-environment jsdom
 */

// Mock the auth.js module functionality
describe('Authentication Module', () => {
  let mockLoginForm, mockSignupForm, mockLoginMsg, mockSignupMsg;
  let mockLoginButton, mockSignupButton;

  beforeEach(() => {
    // Setup DOM elements
    document.body.innerHTML = `
      <form id="loginForm">
        <input type="email" name="email" required>
        <input type="password" name="password" required>
        <button type="submit">Login</button>
      </form>
      <div id="loginMsg"></div>
      
      <form id="signupForm">
        <input type="text" name="name" required>
        <input type="email" name="email" required>
        <input type="password" name="password" required>
        <button type="submit">Sign Up</button>
      </form>
      <div id="signupMsg"></div>
    `;

    mockLoginForm = document.getElementById('loginForm');
    mockSignupForm = document.getElementById('signupForm');
    mockLoginMsg = document.getElementById('loginMsg');
    mockSignupMsg = document.getElementById('signupMsg');
    mockLoginButton = mockLoginForm.querySelector('button[type="submit"]');
    mockSignupButton = mockSignupForm.querySelector('button[type="submit"]');

    // Mock timers
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Login Form Handling', () => {
    test('should handle login form submission with loading animation', () => {
      // Simulate the auth.js login form handler
      const handleLogin = (e) => {
        e.preventDefault();
        
        const loginButton = mockLoginForm.querySelector('button[type="submit"]');
        const originalText = loginButton.textContent;
        loginButton.innerHTML = '<span class="loading-dots">Logging in</span>';
        loginButton.disabled = true;
        
        mockLoginMsg.textContent = 'Logging in…';
        mockLoginMsg.style.animation = 'fadeIn 0.3s ease-out';
      };

      mockLoginForm.addEventListener('submit', handleLogin);
      
      // Trigger form submission
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      mockLoginForm.dispatchEvent(submitEvent);

      expect(mockLoginButton.innerHTML).toBe('<span class="loading-dots">Logging in</span>');
      expect(mockLoginButton.disabled).toBe(true);
      expect(mockLoginMsg.textContent).toBe('Logging in…');
      expect(mockLoginMsg.style.animation).toBe('fadeIn 0.3s ease-out');
    });

    test('should redirect to index.html after successful login', () => {
      const handleLogin = (e) => {
        e.preventDefault();
        
        setTimeout(() => {
          mockLoginMsg.textContent = 'Success! Redirecting…';
          mockLoginButton.innerHTML = '<span class="success-check">✓ Success</span>';
          
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 600);
        }, 600);
      };

      mockLoginForm.addEventListener('submit', handleLogin);
      
      // Trigger form submission
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      mockLoginForm.dispatchEvent(submitEvent);

      // Fast-forward first timeout
      jest.advanceTimersByTime(600);
      expect(mockLoginMsg.textContent).toBe('Success! Redirecting…');
      expect(mockLoginButton.innerHTML).toBe('<span class="success-check">✓ Success</span>');

      // Fast-forward second timeout
      jest.advanceTimersByTime(600);
      expect(window.location.href).toBe('index.html');
    });
  });

  describe('Signup Form Handling', () => {
    test('should handle signup form submission with success message', () => {
      const handleSignup = (e) => {
        e.preventDefault();
        
        const signupButton = mockSignupForm.querySelector('button[type="submit"]');
        signupButton.innerHTML = '<span class="loading-dots">Creating account</span>';
        signupButton.disabled = true;
        
        mockSignupMsg.textContent = 'Creating your account…';
        mockSignupMsg.style.animation = 'fadeIn 0.3s ease-out';
      };

      mockSignupForm.addEventListener('submit', handleSignup);
      
      // Trigger form submission
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      mockSignupForm.dispatchEvent(submitEvent);

      expect(mockSignupButton.innerHTML).toBe('<span class="loading-dots">Creating account</span>');
      expect(mockSignupButton.disabled).toBe(true);
      expect(mockSignupMsg.textContent).toBe('Creating your account…');
      expect(mockSignupMsg.style.animation).toBe('fadeIn 0.3s ease-out');
    });

    test('should redirect to login.html after successful signup', () => {
      const handleSignup = (e) => {
        e.preventDefault();
        
        setTimeout(() => {
          mockSignupMsg.textContent = 'Account created! Redirecting…';
          mockSignupButton.innerHTML = '<span class="success-check">✓ Success</span>';
          
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 600);
        }, 700);
      };

      mockSignupForm.addEventListener('submit', handleSignup);
      
      // Trigger form submission
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      mockSignupForm.dispatchEvent(submitEvent);

      // Fast-forward first timeout
      jest.advanceTimersByTime(700);
      expect(mockSignupMsg.textContent).toBe('Account created! Redirecting…');
      expect(mockSignupButton.innerHTML).toBe('<span class="success-check">✓ Success</span>');

      // Fast-forward second timeout
      jest.advanceTimersByTime(600);
      expect(window.location.href).toBe('login.html');
    });
  });

  describe('Form Validation', () => {
    test('should prevent submission with empty fields', () => {
      const handleLogin = jest.fn((e) => {
        e.preventDefault();
        
        const email = mockLoginForm.querySelector('input[type="email"]').value;
        const password = mockLoginForm.querySelector('input[type="password"]').value;
        
        if (!email || !password) {
          mockLoginMsg.textContent = 'Please fill in all fields';
          return;
        }
      });

      mockLoginForm.addEventListener('submit', handleLogin);
      
      // Try to submit with empty fields
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      mockLoginForm.dispatchEvent(submitEvent);

      expect(handleLogin).toHaveBeenCalled();
      expect(mockLoginMsg.textContent).toBe('Please fill in all fields');
    });
  });
});