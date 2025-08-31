document.addEventListener('DOMContentLoaded', ()=>{
  const loginForm = document.getElementById('loginForm');
  const loginMsg = document.getElementById('loginMsg');
  if(loginForm){
    loginForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      
      // Add loading animation to button
      const loginButton = loginForm.querySelector('button[type="submit"]');
      const originalText = loginButton.textContent;
      loginButton.innerHTML = '<span class="loading-dots">Logging in</span>';
      loginButton.disabled = true;
      
      // Show message with animation
      loginMsg.textContent = 'Logging in…';
      loginMsg.style.animation = 'fadeIn 0.3s ease-out';
      
      setTimeout(()=>{
        loginMsg.textContent = 'Success! Redirecting…';
        loginMsg.style.animation = 'fadeIn 0.3s ease-out';
        
        // Add success animation to button
        loginButton.innerHTML = '<span class="success-check">✓ Success</span>';
        
        setTimeout(()=> location.href='index.html', 600);
      }, 600);
    });
  }
  
  const signupForm = document.getElementById('signupForm');
  const signupMsg = document.getElementById('signupMsg');
  if(signupForm){
    signupForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      
      // Add loading animation to button
      const signupButton = signupForm.querySelector('button[type="submit"]');
      const originalText = signupButton.textContent;
      signupButton.innerHTML = '<span class="loading-dots">Creating account</span>';
      signupButton.disabled = true;
      
      // Show message with animation
      signupMsg.textContent = 'Creating your account…';
      signupMsg.style.animation = 'fadeIn 0.3s ease-out';
      
      setTimeout(()=>{
        signupMsg.textContent = 'Account created! Redirecting…';
        signupMsg.style.animation = 'fadeIn 0.3s ease-out';
        
        // Add success animation to button
        signupButton.innerHTML = '<span class="success-check">✓ Success</span>';
        
        setTimeout(()=> location.href='login.html', 600);
      }, 700);
    });
  }
});
