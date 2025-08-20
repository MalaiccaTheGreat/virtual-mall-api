document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const profileContainer = document.getElementById('profile-container');

  // Image upload functionality
  document.getElementById('user-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      document.getElementById('user-preview').src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Profile display logic
  if (user) {
    profileContainer.innerHTML = `
      <div class="profile-header">
        <img id="user-preview" src="${user.profileImage || 'assets/default-profile.png'}" alt="Profile Picture" class="profile-picture">
        <div>
          <h2>Welcome, ${user.name || 'User'}!</h2>
          <p><strong>Email:</strong> ${user.email}</p>
        </div>
      </div>
      <div class="profile-actions">
        <label for="user-upload" class="upload-btn">Change Profile Picture</label>
        <input type="file" id="user-upload" accept="image/*" style="display: none;">
      </div>
      <div class="profile-content">
        <p>This is your personal profile page. More features coming soon!</p>
      </div>
    `;
  } else {
    profileContainer.innerHTML = `
      <div class="profile-error">
        <h2>Access Denied</h2>
        <p>Please <a href="login.html">log in</a> to view your profile.</p>
      </div>
    `;
    document.getElementById('user-upload').style.display = 'none';
  }
});