// JavaScript function to load content into iframe with loading indicator
function loadpage(page) {
  const iframe = document.getElementById("mainIframe");
  const loading = document.getElementById("loadingIndicator");
  if (loading) loading.style.display = "block";

  const pages = {
    dashboard: '/pages/dashboard.html',
    trading: '/pages/trading_account.html',
    social: '/pages/social_trading.html',
    'pro-capital': '/pages/pro_capital.html',
    partnership: '/pages/partnership.html',
    transactions: '/pages/transactions.html',
    platform: '/pages/platform.html',
    support: '/pages/moreinfo.html',
    profile: '/pages/profile.html',
    tickers: '/pages/tickers.html',
    livechart: '/pages/chatAssistant.html',
    tradingview: '/pages/tradingview.html',

  };

  iframe.src = pages[page] || 'dashboard.html';
}

// Hide loading indicator after iframe loads
document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById("mainIframe");
  const loading = document.getElementById("loadingIndicator");

  if (iframe && loading) {
    loading.style.display = "flex"; // show loader
    iframe.style.display = "none";  // hide iframe initially

    iframe.addEventListener("load", () => {
      loading.style.display = "none"; // hide loader when iframe loads
      iframe.style.display = "block"; // show iframe
    });
  }
});

// Toggle Sidebar
const menuIcon = document.getElementById('menu-icon');
const sidebar = document.getElementById('sidebar');

menuIcon?.addEventListener('click', () => {
  sidebar?.classList.toggle('hidden');
  document.body.classList.toggle('no-scroll');
});

// Set Active Navigation Item
document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const currentHash = window.location.hash;

  navItems.forEach(item => {
    const link = item.getAttribute('data-link');
    if (link && currentHash.includes(link)) {
      item.classList.add('active');
    }

    item.addEventListener('click', () => {
      document.querySelector('.nav-item.active')?.classList.remove('active');
      item.classList.add('active');
    });
  });
});

// Logout Button function with confirmation
const logoutButton = document.getElementById('logout');
logoutButton?.addEventListener('click', () => {
  const confirmLogout = confirm("Are you sure you want to logout?");
  if (confirmLogout) {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_role');
    window.location.href = '#';
  }
});


// Add authentication and profile loading
//  document.addEventListener('DOMContentLoaded', function() {
//   const token = localStorage.getItem('jwt_token');
//   const userRole = localStorage.getItem('user_role');
  
//   if (!token || userRole !== 'client') {
//       alert('Please log in with client credentials');
//       window.location.href = '../index.html';
//       return;
//   }
//   loadProfileData();
// });


