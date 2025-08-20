document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Dummy login
      const email = document.getElementById('login-email').value;
      // In a real app, you'd validate against a backend
      const user = {
        username: 'DummyUserFromLogin',
        email: email,
      };
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/pages/profile.html';
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Dummy sign up
      const username = document.getElementById('signup-username').value;
      const email = document.getElementById('signup-email').value;
      const user = { username, email };
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/pages/profile.html';
    });
  }
});
