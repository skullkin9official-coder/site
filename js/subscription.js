let sessionTicket = null;

// Login form
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Stuur login info naar je serverless function / backend
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (data.sessionTicket) {
    sessionTicket = data.sessionTicket;
    document.getElementById('login-result').textContent = "Ingelogd!";
    document.querySelector('.subscription').style.display = 'block';
    loginForm.style.display = 'none';
  } else {
    document.getElementById('login-result').textContent = "Login mislukt";
  }
});

// Subscription form
const subscriptionForm = document.getElementById('subscription-form');
subscriptionForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const months = parseInt(document.getElementById('months').value);

  const res = await fetch('/api/topup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionTicket, months })
  });

  const data = await res.json();
  document.getElementById('subscription-result').textContent = JSON.stringify(data, null, 2);
});
