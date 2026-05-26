async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const btn = document.getElementById("loginBtn");
  const errorBox = document.getElementById("errorMsg");

  if (!email || !password) {
    showError("Please enter email and password.");
    return;
  }

  // Loading state
  btn.disabled = true;
  btn.innerHTML = `<span class="material-symbols-outlined animate-spin">progress_activity</span> Signing in...`;
  errorBox.classList.add("hidden");

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    btn.disabled = false;
    btn.innerHTML = `<span>Sign In</span><span class="material-symbols-outlined">login</span>`;
    showError(error.message);
  } else {
    // Success — go to admin panel
    window.location.href = "admin.html";
  }
}

function showError(msg) {
  const errorBox = document.getElementById("errorMsg");
  errorBox.textContent = msg;
  errorBox.classList.remove("hidden");
}