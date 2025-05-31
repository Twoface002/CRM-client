
// Dummy manager data
const managers = [
  { id: 1, name: "Manager A", balance: "$10,000", profitShare: "30%", riskLevel: "Low", growth: "15%" },
  { id: 2, name: "Manager B", balance: "$12,500", profitShare: "25%", riskLevel: "Medium", growth: "18%" },
  { id: 3, name: "Manager C", balance: "$15,000", profitShare: "35%", riskLevel: "High", growth: "20%" },
  { id: 4, name: "Manager D", balance: "$11,000", profitShare: "20%", riskLevel: "Low", growth: "12%" },
  { id: 5, name: "Manager E", balance: "$14,000", profitShare: "32%", riskLevel: "Medium", growth: "22%" },
  { id: 6, name: "Manager F", balance: "$13,000", profitShare: "28%", riskLevel: "High", growth: "19%" }
];

let selectedManager = null;
let myInvestments = [];

// Load investments from localStorage if available
function loadInvestments() {
  const savedInvestments = localStorage.getItem('myInvestments');
  if (savedInvestments) {
    myInvestments = JSON.parse(savedInvestments);
  }
}

// Save investments to localStorage
function saveInvestments() {
  localStorage.setItem('myInvestments', JSON.stringify(myInvestments));
}

window.onload = () => {
  loadInvestments();
  renderManagers();
  fetchmyInvestmentList();
};

function renderManagers() {
  const container = document.getElementById("managerList");
  container.innerHTML = "";
  managers.forEach(manager => {
    const card = document.createElement("div");
    card.className = "invest-manager-card";
    card.innerHTML = `
      <h2 class="invest-manager-name">${manager.name}</h2>
      <p class="invest-manager-id">ID: <span class="invest-manager-id-no">${manager.id}</span></p>
      <div class="invest-manager-details">
        <div class="manager-info-box"><span>Balance : </span><span>${manager.balance}</span></div>
        <div class="manager-info-box"><span>Equity : </span><span>$0.00</span></div>
        <div class="manager-info-box"><span>Profit Share : </span><span>${manager.profitShare}</span></div>
        <div class="manager-info-box"><span>Account Age : </span><span>0 days</span></div>
        <div class="manager-info-box"><span>Risk Level : </span><span>${manager.riskLevel}</span></div>
        <div class="manager-info-box"><span>Growth : </span><span>${manager.growth}</span></div>
        <div class="investNow-btn" onclick="openModal(${manager.id})">👥 Invest Now</div>
      </div>
    `;
    container.appendChild(card);
  });
}

function openModal(managerId) {
  selectedManager = managers.find(m => m.id === managerId);
  if (selectedManager) {
    document.getElementById("investManagerId").textContent = selectedManager.id;
    document.getElementById("investManagerName").textContent = selectedManager.name;
    document.getElementById("investBalance").textContent = selectedManager.balance;
    document.getElementById("investProfitShare").textContent = selectedManager.profitShare;
    document.getElementById("investRisklevel").textContent = selectedManager.riskLevel;
    document.getElementById("investGrowth").textContent = selectedManager.growth;
    document.getElementById("investInvestmentModal").style.display = "flex";
  }
}

function closeModal() {
  document.getElementById("investInvestmentModal").style.display = "none";
  document.getElementById("investment-password").value = "";
  document.getElementById("confirm-password").value = "";
  document.getElementById("error-msg").textContent = "";
}

function submitRequest() {
  const pass = document.getElementById("investment-password").value;
  const confirm = document.getElementById("confirm-password").value;
  const errorMsg = document.getElementById("error-msg");

  if (!selectedManager) {
    errorMsg.textContent = "No manager selected. Please try again.";
    return;
  }

  if (!pass || !confirm) {
    errorMsg.textContent = "Please enter and confirm your password.";
    return;
  }

  if (pass !== confirm) {
    errorMsg.textContent = "Passwords do not match.";
    return;
  }

  errorMsg.textContent = "";

  try {
    // Add to investments if not already there
    if (!myInvestments.some(m => m.id === selectedManager.id)) {
      myInvestments.push({
        ...selectedManager,
        status: 'Active',
        investmentDate: new Date().toISOString()
      });
      
      // Save to localStorage
      saveInvestments();
      
      // Update UI
      fetchmyInvestmentList();
      
      // Switch to My Investments tab
      switchTab('myInvestmentsSection');
      
      // Close the modal
      closeModal();
    } else {
      errorMsg.textContent = "You are already invested with this manager.";
    }
  } catch (error) {
    console.error('Error submitting investment:', error);
    errorMsg.textContent = 'Failed to submit investment request. Please try again.';
  }
}

function fetchmyInvestmentList() {
  const list = document.getElementById("myInvestmentList");
  if (!list) return;
  
  list.innerHTML = "";
  
  if (myInvestments.length === 0) {
    list.innerHTML = '<div class="no-investments">No active investments. Go to Available Managers to start investing!</div>';
    return;
  }

  myInvestments.forEach(manager => {
    const div = document.createElement("div");
    div.className = "manager-card";
    div.innerHTML = `

      <h2 class="investment-title"><span class="investorMamId">(${manager.id})-MAM</span></h2>
      <p class="investorId">ID: ${manager.id} - <span class="status">Copying</span></p>
      <div class="investment-details">
        <div class="investment-info-box">
          <img class="logo-img" src="https://img.icons8.com/emoji/48/000000/e-mail.png" />
          <span>Email : </span><span>${manager.name}</span>
        </div>
        <div class="investment-info-box">
          <img class="logo-img" src="https://img.icons8.com/color/48/money.png" />
          <span>Balance : </span><span>${manager.balance}</span>
        </div>
        <div class="investment-info-box">
          <img class="logo-img" src="https://img.icons8.com/color/48/combo-chart--v1.png" />
          <span>Profit Share : </span><span>${manager.profitShare}</span>
        </div>
        <div class="investment-info-box">
          <img class="logo-img" src="https://img.icons8.com/color/48/scale.png" />
          <span>Leverage : </span><span>${manager.growth}</span>
        </div>
      </div>
        <div class="invest-pause-card" data-manager-id="1">
        <div class="actions">
        <button class="pause-btn btn pause" >⏸️ Pause</button>
        <button class="btn deposit" onclick="showPopup('deposit-pop')">💰 Deposit</button>
        <button class="btn withdraw" onclick="showPopup('withdraw-pop')">💳 Withdraw</button>
        </div>
        </div>
    </div>


    `;
    list.appendChild(div);

    div.querySelector('.pause-btn').addEventListener('click', function () {
  const card = this.closest('.manager-card');

  if (!card.classList.contains('paused')) {
    card.classList.add('paused');
    this.textContent = '▶️ Resume';
    this.classList.add('paused-btn');
    card.querySelectorAll('button:not(.pause-btn)').forEach(btn => btn.disabled = true);

  } else {
    card.classList.remove('paused');
    this.textContent = '⏸️ Pause';
    this.classList.remove('paused-btn');
    card.querySelectorAll('button:not(.pause-btn)').forEach(btn => btn.disabled = false);

  }
});
});
}



function switchTab(sectionId) {
  // Update tab UI
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.section').forEach(section => section.style.display = 'none');

  const targetSection = document.getElementById(sectionId);
  const targetTab = document.getElementById(sectionId.replace('Section', 'Tab'));

  if (targetSection && targetTab) {
    targetSection.style.display = 'block';
    targetTab.classList.add('active');

    // Refresh data when switching to My Investments
    if (sectionId === 'myInvestmentsSection') {
      loadInvestments(); // Reload from localStorage
      fetchmyInvestmentList();
    }
  }
  if (sectionId === "availableManagersSection") {
    document.getElementById("availableManagersTab").classList.add("active");
  } else {
    document.getElementById("myInvestmentsTab").classList.add("active");
  }
}

    function showPopup(sectionId) {
      const overlay = document.getElementById("popup-overlay");
      const popupSections = document.querySelectorAll(".popup-section");

      // Show overlay
      overlay.style.display = "flex";

      // Hide all popups
      popupSections.forEach(section => {
        section.style.display = "none";
      });

      // Show selected popup
      const target = document.getElementById(sectionId);
      if (target) {
        target.style.display = "block";
      } else {
        console.error("No popup found for ID:", sectionId);
      }
    }

const overlay = document.getElementById("popup-overlay"); // Define overlay globally

function closePopup() {
  const popupSections = document.querySelectorAll(".popup-section");

  popupSections.forEach(section => {
    section.style.display = "none";
  });

  overlay.style.display = "none";
}

// Close popup when clicking outside the popup-content
overlay.addEventListener("click", function (event) {
  if (event.target === overlay) {
    closePopup();
  }
});


const usdToInr = 83.2;

// Handle tab switching
document.querySelectorAll('.deposittab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.deposittab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.deposit-tab-content').forEach(content => content.classList.add('hidden-con'));
    
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.remove('hidden-con');
  });
});

// CheesePay currency switch/input
document.querySelectorAll('input[name="cp-currency"]').forEach(radio => {
  radio.addEventListener('change', updateCPConversion);
});
document.getElementById('cpInput').addEventListener('input', updateCPConversion);

function updateCPConversion() {
  const input = parseFloat(document.getElementById('cpInput').value);
  const currency = document.querySelector('input[name="cp-currency"]:checked').value;
  const output = document.getElementById('cpConverted');
  const label = document.getElementById('cpLabelUSD');

  if (isNaN(input) || input <= 0) {
    output.value = '';
    return;
  }

  if (currency === 'USD') {
    label.textContent = 'USD Amount (USD)';
    output.value = `₹ ${(input * usdToInr).toFixed(2)}`;
  } else {
    label.textContent = 'INR Amount (₹)';
    output.value = `USD ${(input / usdToInr).toFixed(2)}`;
  }
}

// Manual Deposit
document.querySelectorAll('input[name="manual-currency"]').forEach(radio => {
  radio.addEventListener('change', updateManualConversion);
});
document.getElementById('manualInput').addEventListener('input', updateManualConversion);

function updateManualConversion() {
  const input = parseFloat(document.getElementById('manualInput').value);
  const currency = document.querySelector('input[name="manual-currency"]:checked').value;
  const output = document.getElementById('manualConverted');

  if (isNaN(input) || input <= 0) {
    output.value = '';
    return;
  }

  output.value = (currency === 'USD')
    ? `₹ ${(input * usdToInr).toFixed(2)}`
    : `USD ${(input / usdToInr).toFixed(2)}`;
}

// Copy USDT address
document.getElementById('copyUsdt').addEventListener('click', () => {
  const address = document.getElementById('usdtAddress').textContent;
  navigator.clipboard.writeText(address)
    .then(() => alert("USDT Address copied!"))
    .catch(() => alert("Copy failed."));
});

// Button actions
document.getElementById('cpConfirm').addEventListener('click', () => {
  alert('Proceeding with CheesePay');
});

document.getElementById('manualSubmit').addEventListener('click', () => {
  alert('Submitted for staff approval');
});

document.getElementById('usdtSubmit').addEventListener('click', () => {
  alert('USDT payment submitted!');
});




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




