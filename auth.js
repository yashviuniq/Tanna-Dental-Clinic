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

  if (typeof supabaseClient === "undefined" || !supabaseClient) {
    btn.disabled = false;
    btn.innerHTML = `<span>Sign In</span><span class="material-symbols-outlined">login</span>`;
    showError("Supabase is not loaded. Check your internet connection and confirm the Supabase script and supabase.js are loading.");
    return;
  }

  let data;
  let error;

  try {
    ({ data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    }));
  } catch (fetchError) {
    error = fetchError;
  }

  if (error) {
    btn.disabled = false;
    btn.innerHTML = `<span>Sign In</span><span class="material-symbols-outlined">login</span>`;
    showError(getLoginErrorMessage(error));
  } else {
    // Success — go to admin panel
    window.location.href = "admin.html";
  }
}

function getLoginErrorMessage(error) {
  const message = error?.message || "Unable to sign in.";

  if (/failed to fetch|network|fetch/i.test(message)) {
    return "Cannot reach the Supabase project in supabase.js. The current URL may be wrong, inactive, or deleted. Copy the Project URL and anon public key again from Supabase Project Settings > API.";
  }

  return message;
}

function showError(msg) {
  const errorBox = document.getElementById("errorMsg");
  errorBox.textContent = msg;
  errorBox.classList.remove("hidden");
}
