document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const profileContainer = document.getElementById('profile-container');

  if (user) {
    profileContainer.innerHTML = `
            <h2>Welcome, ${user.name || 'User'}!</h2>
            <p><strong>Email:</strong> ${user.email}</p>
            <p>This is your personal profile page. More features coming soon!</p>
        `;
  } else {
    profileContainer.innerHTML = `
            <h2>Access Denied</h2>
            <p>Please <a href="login.html">log in</a> to view your profile.</p>
        `;
  }
});
