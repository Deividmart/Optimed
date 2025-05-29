document.addEventListener('DOMContentLoaded', () => {
    const btnRegister = document.getElementById('btn-register');
    const btnLogin = document.getElementById('btn-login');
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const errorDiv = document.getElementById('error');
    const welcomeSection = document.getElementById('welcome-section');
    const welcomeUsername = document.getElementById('welcome-username');
    const welcomeEstrato = document.getElementById('welcome-estrato');
    const welcomeHours = document.getElementById('welcome-hours');
    const welcomeDelivery = document.getElementById('welcome-delivery');
    const welcomeAddressContainer = document.getElementById('welcome-address-container');
    const welcomeAddress = document.getElementById('welcome-address');
    const btnLogout = document.getElementById('btn-logout');
    const deliveryOption = document.getElementById('delivery-option');
    const addressContainer = document.getElementById('address-container');
    const addressInput = document.getElementById('address');
    const addressConfirm = document.getElementById('address-confirm');
    const btnConfirmDelivery = document.getElementById('btn-confirm-delivery');
  
    let users = JSON.parse(localStorage.getItem('optimedUsers')) || [];
    let currentUser = null;
  
    function estratoDeliveryHours(estrato) {
      switch (estrato) {
        case 1: return 2;
        case 2: return 6;
        case 3: return 12;
        case 4: return 24;
        case 5:
        case 6: return 36;
        default: return 0;
      }
    }
  
    function showError(message) {
      errorDiv.textContent = message;
    }
  
    function clearError() {
      errorDiv.textContent = '';
    }
  
    function showRegister() {
      clearError();
      registerForm.style.display = 'block';
      loginForm.style.display = 'none';
      welcomeSection.style.display = 'none';
      btnRegister.classList.add('active');
      btnLogin.classList.remove('active');
    }
  
    function showLogin() {
      clearError();
      registerForm.style.display = 'none';
      loginForm.style.display = 'block';
      welcomeSection.style.display = 'none';
      btnRegister.classList.remove('active');
      btnLogin.classList.add('active');
    }
  
    function showWelcome(user) {
      clearError();
      registerForm.style.display = 'none';
      loginForm.style.display = 'none';
      welcomeSection.style.display = 'block';
      welcomeUsername.textContent = user.username;
      welcomeEstrato.textContent = user.estrato;
      welcomeHours.textContent = estratoDeliveryHours(user.estrato);
      welcomeDelivery.textContent = user.deliveryOption ? (user.deliveryOption === 'punto' ? 'Punto de entrega: Local Audifarma, Cl. 56 #11-70' : 'Entrega a domicilio') : '';
      if (user.deliveryOption === 'domicilio' && user.address) {
        welcomeAddressContainer.style.display = 'block';
        welcomeAddress.textContent = user.address;
      } else {
        welcomeAddressContainer.style.display = 'none';
        welcomeAddress.textContent = '';
      }
    }
  
    deliveryOption.addEventListener('change', () => {
      if (deliveryOption.value === 'domicilio') {
        addressContainer.style.display = 'block';
      } else {
        addressContainer.style.display = 'none';
        addressInput.value = '';
        addressConfirm.checked = false;
      }
    });
  
    btnConfirmDelivery.addEventListener('click', () => {
      clearError();
      const delivery = deliveryOption.value;
      const address = addressInput.value.trim();
      const addressConfirmed = addressConfirm.checked;
  
      if (!delivery) {
        showError('Por favor seleccione una opción de entrega.');
        return;
      }
  
      if (delivery === 'domicilio') {
        if (!address) {
          showError('Por favor ingrese su dirección de domicilio.');
          return;
        }
        if (!addressConfirmed) {
          showError('Por favor confirme que la dirección es correcta.');
          return;
        }
      }
  
      // Update currentUser and users array
      currentUser.deliveryOption = delivery;
      if (delivery === 'domicilio') {
        currentUser.address = address;
      } else {
        delete currentUser.address;
      }
  
      // Update users array and localStorage
      const userIndex = users.findIndex(u => u.username === currentUser.username);
      if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('optimedUsers', JSON.stringify(users));
      }
  
      showWelcome(currentUser);
      alert('Opción de entrega confirmada.');
    });
  
    btnRegister.addEventListener('click', showRegister);
    btnLogin.addEventListener('click', showLogin);
  
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError();
  
      const username = document.getElementById('reg-username').value.trim();
      const password = document.getElementById('reg-password').value;
      const estrato = parseInt(document.getElementById('reg-estrato').value);
  
      if (!username || !password || !estrato) {
        showError('Por favor complete todos los campos.');
        return;
      }
  
      if (users.some(u => u.username === username)) {
        showError('El nombre de usuario ya existe.');
        return;
      }
  
      const newUser = { username, password, estrato };
      users.push(newUser);
      localStorage.setItem('optimedUsers', JSON.stringify(users));
  
      registerForm.reset();
      showLogin();
      alert('Registro exitoso. Por favor inicie sesión.');
    });
  
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError();
  
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value;
  
      const user = users.find(u => u.username === username && u.password === password);
      if (!user) {
        showError('Usuario o contraseña incorrectos.');
        return;
      }
  
      currentUser = user;
      showWelcome(user);
    });
  
    btnLogout.addEventListener('click', () => {
      currentUser = null;
      showLogin();
    });
  
    // On page load, show register form by default
    showRegister();
  });
  