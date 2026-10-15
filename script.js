const form = document.getElementById("signupForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const submitBtn = document.getElementById("submitBtn");
const successMessage = document.getElementById("successMessage");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");
const togglePassword = document.getElementById("togglePassword");

// Track which fields the user has interacted with
const touched = {
  name: false,
  email: false,
  password: false,
};

// Validate full name
function validateName() {
  const name = nameInput.value.trim();

  if (!name) {
    return "Name is required.";
  }

  if (name.length < 2) {
    return "Name must contain at least 2 characters.";
  }

  if (!/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(name)) {
    return "Enter a valid name using letters only.";
  }

  return "";
}

// Validate email address
function validateEmail() {
  const email = emailInput.value.trim();

  if (!email) {
    return "Email address is required.";
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailPattern.test(email)) {
    return "Please enter a valid email address.";
  }

  return "";
}

// Check password strength
function getPasswordStrength(password) {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score;
}

// Update password strength indicator
function updatePasswordStrength() {
  const password = passwordInput.value;
  const score = getPasswordStrength(password);

  const levels = [
    { label: "Not entered", width: "0%", color: "#edf0f5" },
    { label: "Very weak", width: "20%", color: "#e34d59" },
    { label: "Weak", width: "40%", color: "#ef8547" },
    { label: "Fair", width: "60%", color: "#e5b83d" },
    { label: "Good", width: "80%", color: "#48a9d8" },
    { label: "Strong", width: "100%", color: "#20a46b" },
  ];

  const level = password.length ? levels[score] : levels[0];

  strengthBar.style.width = level.width;
  strengthBar.style.backgroundColor = level.color;
  strengthText.textContent = `Password strength: ${level.label}`;
}

// Validate password
function validatePassword() {
  const password = passwordInput.value;

  if (!password) {
    return "Password is required.";
  }

  if (password.length < 8) {
    return "Password must contain at least 8 characters.";
  }

  if (!/[a-z]/.test(password)) {
    return "Include at least one lowercase letter.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Include at least one uppercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Include at least one number.";
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Include at least one special character.";
  }

  return "";
}

// Display inline validation feedback
function showFieldStatus(input, errorElement, message) {
  errorElement.textContent = message;

  input.classList.toggle("invalid", Boolean(message));
  input.classList.toggle("valid", !message && input.value.trim().length > 0);

  input.setAttribute("aria-invalid", String(Boolean(message)));
}

// Validate all fields and update the submit button
function validateForm() {
  const nameMessage = validateName();
  const emailMessage = validateEmail();
  const passwordMessage = validatePassword();

  if (touched.name) {
    showFieldStatus(nameInput, nameError, nameMessage);
  }

  if (touched.email) {
    showFieldStatus(emailInput, emailError, emailMessage);
  }

  if (touched.password) {
    showFieldStatus(passwordInput, passwordError, passwordMessage);
  }

  const isValid = !nameMessage && !emailMessage && !passwordMessage;

  submitBtn.disabled = !isValid;

  return isValid;
}

// Validate name as the user types
nameInput.addEventListener("input", () => {
  touched.name = true;
  successMessage.textContent = "";
  validateForm();
});

// Validate email as the user types
emailInput.addEventListener("input", () => {
  touched.email = true;
  successMessage.textContent = "";
  validateForm();
});

// Validate password and update strength live
passwordInput.addEventListener("input", () => {
  touched.password = true;
  successMessage.textContent = "";

  updatePasswordStrength();
  validateForm();
});

// Show or hide password
togglePassword.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";

  passwordInput.type = isHidden ? "text" : "password";
  togglePassword.textContent = isHidden ? "Hide" : "Show";
  togglePassword.setAttribute(
    "aria-label",
    isHidden ? "Hide password" : "Show password",
  );
});

// Handle form submission
form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Show errors for every field if submission is attempted
  touched.name = true;
  touched.email = true;
  touched.password = true;

  updatePasswordStrength();

  if (!validateForm()) {
    return;
  }

  successMessage.textContent = "Account created successfully!";

  // Demo only: no account is stored or created on a server.
  form.reset();

  Object.keys(touched).forEach((key) => {
    touched[key] = false;
  });

  [nameInput, emailInput, passwordInput].forEach((input) => {
    input.classList.remove("valid", "invalid");
    input.setAttribute("aria-invalid", "false");
  });

  [nameError, emailError, passwordError].forEach((element) => {
    element.textContent = "";
  });

  updatePasswordStrength();
  submitBtn.disabled = true;
});

// Initial state
updatePasswordStrength();
validateForm();
