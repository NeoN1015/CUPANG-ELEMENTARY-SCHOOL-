document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Get existing users from localStorage or start with an empty array
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  // Check if user already exists
  const userExists = users.some(user => user.email === email);

  if (userExists) {
    document.getElementById("message").textContent = "Email is already registered.";
    return;
  }

  // Add new user to the array
  users.push({ email, password });

  // Save back to localStorage
  localStorage.setItem("users", JSON.stringify(users));

  document.getElementById("message").textContent = "Registration successful!";
});
