function checkAuth() {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  const userName = localStorage.getItem('userName');

  if (token) {
    const loginNav = document.getElementById('loginNav');
    const signupNav = document.getElementById('signupNav');
    const logoutNav = document.getElementById('logoutNav');
    const userNav = document.getElementById('userNav');

    if (loginNav) loginNav.style.display = 'none';
    if (signupNav) signupNav.style.display = 'none';
    if (logoutNav) logoutNav.style.display = 'block';
    
    if (userType === 'user' && userNav) {
      userNav.style.display = 'block';
    }
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('adminEmail');
  localStorage.removeItem('userType');
  
  alert('Logged out successfully!');
  window.location.href = '/index.html';
}


async function loadServices() {
  try {
    const response = await fetch('/api/service/all');
    const data = await response.json();

    if (data.success) {
      displayServices(data.services);
    }
  } catch (error) {
    console.error('Error loading services:', error);
    document.getElementById('servicesContainer').innerHTML = 
      '<p class="error">Failed to load services. Please try again later.</p>';
  }
}

function displayServices(services) {
  const container = document.getElementById('servicesContainer');
  
  if (!container) return;

  if (services.length === 0) {
    container.innerHTML = '<p class="empty-state">No services available at the moment.</p>';
    return;
  }

  container.innerHTML = services.map(service => `
    <div class="service-card">
      <img src="${service.image}" alt="${service.name}" onerror="this.src='/images/placeholder.jpg'">
      <div class="service-card-content">
        <h3>${service.name}</h3>
        <p>${service.description}</p>
        <p class="service-price">₹${service.price.toFixed(2)} <small>per person</small></p>
        <button onclick="openBookingModal('${service._id}', '${service.name}', ${service.price})" class="btn-primary btn-block">
          Book Now
        </button>
      </div>
    </div>
  `).join('');
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
});