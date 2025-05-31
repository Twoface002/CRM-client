
const modal = document.getElementById("popup-overlay");

function showPopup(sectionId) {
  modal.classList.add("active");

  // Hide all popup sections
  document.querySelectorAll(".popup-section").forEach(section => {
    section.style.display = "none";
  });

  switch (sectionId) {
    // Top nav content
    case "openAccount-pop":
    case "internalTrans-pop":
    case "demoMode-pop":
      
    // Middle nav content
    case "trades-pop":
    case "deposit-pop":
    case "withdraw-pop":
    case "manage-pop":
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




// Create New account script codes

    const createaccount = document.getElementById("accountModal");
    const form = document.getElementById("accountForm");
    const masterPwd = document.getElementById("masterPwd");
    const masterPwdError = document.getElementById("masterPwdError");

    function openModal() {
      modal.style.display = "block";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const pwd = masterPwd.value;

      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!regex.test(pwd)) {
        masterPwdError.textContent = "Password must contain at least 8 characters, an uppercase letter, a lowercase letter, and a number.";
      } else {
        masterPwdError.textContent = "";
        alert("Account Created!");
        closePopup();
        form.reset();
      }
    });



// Inneraccount transfering amount script codes
document.addEventListener("DOMContentLoaded", function () {
  function populateAccountDropdowns(accounts) {
    const fromSelect = document.getElementById('fromAccount');
    const toSelect = document.getElementById('toAccount');

    fromSelect.innerHTML = '<option value="">Select source account</option>';
    toSelect.innerHTML = '<option value="">Select destination account</option>';

    accounts.forEach(acc => {
      const optionFrom = document.createElement('option');
      optionFrom.value = acc.id;
      optionFrom.textContent = `${acc.number} - ${acc.name}`;
      fromSelect.appendChild(optionFrom);

      const optionTo = document.createElement('option');
      optionTo.value = acc.id;
      optionTo.textContent = `${acc.number} - ${acc.name}`;
      toSelect.appendChild(optionTo);
    });
  }

  populateAccountDropdowns(accountList); // ✅ Call here only
});

    // ----------------------------------------------------------------------

// create new account form submission
document.getElementById("accountForm").addEventListener("submit", function(event) {
  event.preventDefault();
  
  // Get form values
  const hold_email = document.getElementById("holder_email").value;
  // const hold_leverage = document.getElementById("holder_leverage").value;
  const masterPwd = document.getElementById("masterPwd").value;
  const investerPwd = document.getElementById("investerPwd").value;
  
  // Generate a random Account ID (you can replace this with a real value)
  const accountId = Math.floor(Math.random() * 9000000000) + 1000000000; // 10 digit random number
  
  // Create a new account block
  const new_accountDiv = document.createElement("div");
  new_accountDiv.className = "glass-card";
  new_accountDiv.innerHTML = `
        <div class="detail">
          <div class="alpha">
            <p class="email">📩 ${hold_email}</p>
            <p class="id">Account ID: <span>${accountId}</span></p>
          </div>
          <div class="beta">
            <p class="balance">💰 $18,470.72</p>
          </div>
        </div>
  
        <div class="actions">
          <button class="nav-action" id="trade" onclick="showPopup('trades-pop')" >📈 Trades</button>
          <button class="nav-action" id="deposit" onclick="showPopup('deposit-pop')" >💳 Deposit</button>
          <button class="nav-action" id="withdraw" onclick="showPopup('withdraw-pop')" >🏧 Withdraw</button>
          <button class="nav-action" id="manage" onclick="showPopup('manage-pop')" >⚙️ Manage</button>
        </div>
  `;

  // Append it after the last account
  document.getElementById("data-showing").after(new_accountDiv);

  // Close the modal
  closeModal();

  // Reset the form
  document.getElementById("accountForm").reset();
});

// Initial attach
attachCheckListeners();



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


// ----------------------------------------------------------------------
// withdraws funds js code here

function withdraw() {
  const amountInput = document.getElementById('with_amount');
  const errorBox = document.getElementById('error-message');
  const amount = parseFloat(amountInput.value);
  const availableBalance = 18470.80;

  // Check if amount is invalid (empty, not a number, or <= 0)
  if (!amount || amount <= 0) {
    alert('Please enter a valid amount.');
    errorBox.style.display = 'none'; // hide error box if shown before
    return;
  }

  // Check if amount exceeds available balance
  if (amount > availableBalance) {
    errorBox.style.display = 'flex';
    return;
  } else {
    errorBox.style.display = 'none';
  }

  // Get selected withdrawal method
  const method = document.querySelector('input[name="withdrawal-method"]:checked')?.id;
  if (!method) {
    alert('Please select a withdrawal method.');
    return;
  }

  // If everything is valid, proceed
  // console.log(`Withdrawing $${amount.toFixed(2)} via ${method === 'bank' ? 'Bank Transfer' : 'Crypto Wallet'}.`);

  alert(`Withdrawing $${amount} via ${method === 'bank' ? 'Bank Transfer' : 'Crypto Wallet'}.`);
}
// Hide error box initially
document.getElementById('error-message').style.display = 'none';



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
// Trades js code here

let currentSort = { column: '',direction: ''};
let currentPage = 1;
const rowsPerPage = 10;

function sortTable(column) {
  const table = document.getElementById("positionsTable");
  const allRows = Array.from(table.querySelectorAll("tr"));
  const thElements = document.querySelectorAll("th");

  thElements.forEach(th => th.classList.remove("sorted-asc", "sorted-desc"));

  if (currentSort.column === column) {
      if (currentSort.direction === "asc") {
          currentSort.direction = "desc";
      } else if (currentSort.direction === "desc") {
          currentSort.direction = "";
      } else {
          currentSort.direction = "asc";
      }
  } else {
      currentSort.column = column;
      currentSort.direction = "asc";
  }

  if (currentSort.direction === "") {
      allRows.sort((a, b) => a.rowIndex - b.rowIndex);
  } else {
      const colIndex = {
          id: 0,
          date: 1,
          symbol: 2,
          volume: 3,
          price: 4,
          profit: 5,
          type: 6
      }[column];

      allRows.sort((a, b) => {
          let aText = a.cells[colIndex].textContent.trim().replace(/[$,]/g, '');
          let bText = b.cells[colIndex].textContent.trim().replace(/[$,]/g, '');
          if (!isNaN(aText) && !isNaN(bText)) {
              aText = parseFloat(aText);
              bText = parseFloat(bText);
          }
          return (aText < bText ? -1 : aText > bText ? 1 : 0) * (currentSort.direction === 'asc' ? 1 : -1);
      });

      const header = document.querySelector(`th[onclick*="${column}"]`);
      if (header) {
          header.classList.add(currentSort.direction === "asc" ? "sorted-asc" : "sorted-desc");
      }
  }

  // Clear and re-add sorted rows
  table.innerHTML = '';
  allRows.forEach(row => table.appendChild(row));
  currentPage = 1;
  updatePagination();
  showSortPopup(column, currentSort.direction);
}

function searchTable() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const table = document.getElementById("positionsTable");
  const rows = Array.from(table.getElementsByTagName("tr"));

  rows.forEach(row => {
      const cells = Array.from(row.getElementsByTagName("td"));
      const match = cells.some(cell => cell.textContent.toLowerCase().includes(input));
      row.dataset.visible = match ? "true" : "false";
  });

  currentPage = 1;
  updatePagination();
}

function showSortPopup(column, direction) {
  const popup = document.getElementById("sortPopup");
  let text = "";

  if (direction === "asc") text = `Sorting ${column.toUpperCase()}: Ascending`;
  else if (direction === "desc") text = `Sorting ${column.toUpperCase()}: Descending`;
  else text = `Sorting ${column.toUpperCase()}: Reset`;

  popup.textContent = text;
  popup.style.display = "block";
  popup.style.animation = "none";
  popup.offsetHeight;
  popup.style.animation = "fadeOut 2s forwards";
}

function updatePagination() {
  const table = document.getElementById("positionsTable");
  const rows = Array.from(table.getElementsByTagName("tr"));
  const visibleRows = rows.filter(row => row.dataset.visible !== "false");

  const totalPages = Math.ceil(visibleRows.length / rowsPerPage);
  currentPage = Math.max(1, Math.min(currentPage, totalPages));

  rows.forEach((row, index) => {
      row.style.display = "none";
  });

  visibleRows.forEach((row, index) => {
      const start = (currentPage - 1) * rowsPerPage;
      const end = currentPage * rowsPerPage;
      if (index >= start && index < end) {
          row.style.display = "";
      }
  });

  renderPaginationControls(totalPages);
}

function renderPaginationControls(totalPages) {
  const paginationDiv = document.querySelector(".pagination");
  paginationDiv.innerHTML = "";

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "<";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
      currentPage--;
      updatePagination();
  };

  const nextBtn = document.createElement("button");
  nextBtn.textContent = ">";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
      currentPage++;
      updatePagination();
  };

  paginationDiv.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.textContent = i;
      pageBtn.className = i === currentPage ? "active" : "";
      pageBtn.onclick = () => {
          currentPage = i;
          updatePagination();
      };
      paginationDiv.appendChild(pageBtn);
  }

  paginationDiv.appendChild(nextBtn);
}

window.onload = () => {
  const table = document.getElementById("positionsTable");
  const rows = table.getElementsByTagName("tr");
  Array.from(rows).forEach(row => row.dataset.visible = "true");
  updatePagination();
};
