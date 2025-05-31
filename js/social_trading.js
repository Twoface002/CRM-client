document.addEventListener('DOMContentLoaded', () => {
  
  // Info toggle logic
  const infoBox = document.getElementById('mamInfo-details');
  const toggleLink = document.getElementById('toggleLink-details');

  infoBox.style.display = 'none';
  toggleLink.innerHTML = '<span class="info-icon">ℹ️</span> Know what it is?';

  toggleLink.addEventListener('click', function (e) {
    e.preventDefault();
    const isVisible = infoBox.style.display === 'block';
    infoBox.style.display = isVisible ? 'none' : 'block';
    toggleLink.innerHTML = isVisible
      ? '<span class="info-icon">ℹ️</span> Know what it is?'
      : '<span class="info-icon">❌</span> Hide MAM Info';
  });

  // Modal logic
  const modal = document.getElementById('mamModal-container');
  const openModalBtn = document.getElementById('mam-new-openModal');
  const closeModal = document.querySelector('.close-button');
  const form = document.getElementById('mamForm-con');
  const mamList = document.getElementById('mamAccountList-con');

  openModalBtn.onclick = () => (modal.style.display = 'flex');
  closeModal.onclick = () => (modal.style.display = 'none');
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = 'none';
  };

  // Form submission logic
  form.onsubmit = function (e) {
    e.preventDefault();

    const name = document.getElementById('mam-accountName').value;
    const profit = document.getElementById('mam-profitPercentage').value;
    const leverage = document.getElementById('mam-leverage').value;

    const accountId = `${Date.now().toString().slice(-8)}`;

    const html = `

      <div class="mam-account-card">
        <ul class="mam-active-container">
          <li class="mam-account-enable">Enable</li>
          <li class="mam-account-disable" style="display:none;">Disable</li>
        </ul>
        <h3>${name} - MAM</h3>
        <p id="account-id-mam">ID : ${accountId}</p>
        <div class="mam-list-account-details">
          <div><strong>Profit Sharing : </strong> ${ profit}%</div>
          <div><strong>Total Profit : </strong> $ 0.00</div>
          <div><strong>Leverage : </strong> ${ leverage}</div>
        </div>
        <div class="down-list-buttons">
          <button class="mam-btn-btn deposit" onclick="showPopup('deposit-pop')">💳 Deposit</button>
          <button class="mam-btn-btn withdraw" onclick="showPopup('withdraw-pop')">🏧 Withdraw</button>
          <button class="mam-btn-btn investors" onclick="showPopup('investors-pop')">👥 Investors</button>
          <button class="mam-btn-btn settings" onclick="showPopup('setting-pop')">⚙️ Settings</button>
          <button class="mam-btn-btn enable-disable" onclick="toggleStatus(this)">❌ Disable</button>
        </div>
      </div>
    `;

    mamList.innerHTML += html;
    modal.style.display = 'none';
    form.reset();
  };

  // Function to toggle account status
  window.toggleStatus = function (btn) {
    const accountCard = btn.closest('.mam-account-card');
    const accountStatus = accountCard.querySelector('.mam-active-container');
    const active = accountStatus.querySelector('.mam-account-enable');
    const inactive = accountStatus.querySelector('.mam-account-disable');
    
    if (inactive.style.display === 'none') {
      inactive.style.display = 'block';
      active.style.display = 'none';
      btn.innerText = '✅ Enable';
    } else {
      inactive.style.display = 'none';
      active.style.display = 'block';
      btn.innerText = '❌ Disable';
    }
  };

});




const modal = document.getElementById("popup-overlay");

function showPopup(sectionId) {
  modal.classList.add("active");

  // Hide all popup sections
  document.querySelectorAll(".popup-section").forEach(section => {
    section.style.display = "none";
  });

  switch (sectionId) {
    // Middle nav content
    case "deposit-pop":
    case "withdraw-pop":
    case "investors-pop":
    case "setting-pop":
      document.getElementById(sectionId).style.display = "block";
      break;

    default:
      console.warn("Unknown section:", sectionId);
  }
}

function closePopup() {
  modal.classList.remove("active");
}

// Close popup when clicking outside the popup-content
modal.addEventListener("click", function (event) {
  if (event.target === modal) {
    closePopup();
  }
});








// ----------------------------------------------------------------------
// Deposit funds js code here
const usdToInr = 83.2;

function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden-con'));

  document.getElementById(tabId).classList.remove('hidden-con');
  document.querySelector(`.tab[onclick="switchTab('${tabId}')"]`).classList.add('active');
}

function updateCPConversion() {
  const input = parseFloat(document.getElementById('cpInput').value);
  const selected = document.querySelector('input[name="cp-currency"]:checked').value;
  const output = document.getElementById('cpConverted');
  const label = document.getElementById('cpLabelUSD');

  if (selected === 'USD') {
    label.textContent = 'USD Amount (USD)';
    output.value = isNaN(input) ? '' : `₹ ${(input * usdToInr).toFixed(2)}`;
  } else {
    label.textContent = 'INR Amount (₹)';
    output.value = isNaN(input) ? '' : `USD ${(input / usdToInr).toFixed(2)}`;
  }
}

function updateManualConversion() {
  const input = parseFloat(document.getElementById('manualInput').value);
  const selected = document.querySelector('input[name="manual-currency"]:checked').value;
  const output = document.getElementById('manualConverted');

  if (selected === 'USD') {
    output.value = isNaN(input) ? '' : `₹ ${(input * usdToInr).toFixed(2)}`;
  } else {
    output.value = isNaN(input) ? '' : `USD ${(input / usdToInr).toFixed(2)}`;
  }
}

function copyAddress() {
  const address = document.getElementById('usdtAddress').textContent;
  navigator.clipboard.writeText(address)
    .then(() => alert("USDT Address copied!"))
    .catch(() => alert("Failed to copy address."));
}

// Hide warning after 1.5s
// setTimeout(() => {
//   document.getElementById('exchangeWarning').style.display = 'none';
// }, 1500);

// Default tab open on page load
window.onload = () => switchTab('cheesepay');





// ----------------------------------------------------------------------
// withdraws funds js code here

function withdraw() {
  const amountInput = document.getElementById('with_amount');
  const errorBox = document.getElementById('error-message');
  const amount = parseFloat(amountInput.value);
  const availableBalance = 18470.80;

  // Validate amount
  if (!amount || amount <= 0) {
    alert('Please enter a valid amount.');
    errorBox.style.display = 'none';
    return;
  }

  if (amount > availableBalance) {
    errorBox.style.display = 'flex';
    return;
  } else {
    errorBox.style.display = 'none';
  }

  // Detect active withdrawal method tab
  const activeTab = document.querySelector('.with-tab-content.active');
  let method = '';

  if (activeTab?.id === 'bank-tab') {
    method = 'bank';
  } else if (activeTab?.id === 'crypto-tab') {
    method = 'crypto';
  } else {
    alert('Please select a withdrawal method.');
    return;
  }

  alert(`Withdrawing $${amount.toFixed(2)} via ${method === 'bank' ? 'Bank Transfer' : 'Crypto Wallet'}.`);
}

// Hide error box initially
document.getElementById('error-message').style.display = 'none';

// Tab switching logic
document.querySelectorAll('.with-tab-btn').forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');

    document.querySelectorAll('.with-tab-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    document.querySelectorAll('.with-tab-content').forEach(content => {
      content.classList.remove('active');
    });

    document.getElementById(targetId).classList.add('active');
  });
});




// ----------------------------------------------------------------------
// Manage setting js code here

function updateLeverage() {
  const selected = document.getElementById('leverageSelect').value;
  if (!selected) {
    alert("Please select a leverage value!");
    return;
  }
  document.getElementById('currentLeverage').innerText = selected;
  alert("Leverage updated to " + selected);
}

function updatePassword() {
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (!newPassword || !confirmPassword) {
    alert("Please fill out both password fields.");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  alert("Password updated successfully!");
  // Clear inputs after update
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmPassword').value = '';
}

function toggleAlgo() {
  const toggle = document.getElementById('algoToggle');
  const status = document.getElementById('algoStatus');

  if (toggle.checked) {
    status.innerText = "Enabled";
    status.style.color = "green";
    // alert("Algo Trading Enabled!");
  } else {
    status.innerText = "Disabled";
    status.style.color = "red";
    // alert("Algo Trading Disabled!");
  }
}








// Add event listener for the toggle switch
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector('.switch-copy-notcopy .investors-input');

  toggle.addEventListener('change', function () {
    if (this.checked) {
      alert("Copying has been enabled.");
    } else {
      alert("Copying has been disabled.");
    }
  });
});