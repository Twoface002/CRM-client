
// Dashboard js code here

function switchTab(tabId, el) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  el.classList.add('active');
}

function copyReferralLink() {
  const link = document.getElementById("referralLink");
  link.select();
  document.execCommand("copy");
  alert("Copied referral link: " + link.value);
}

const ctx1 = document.getElementById('monthlyEarningsChart').getContext('2d');
new Chart(ctx1, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Earnings',
      data: [0, 0, 0, 967.84, 0, 0, 0, 0, 0, 0, 0, 0],
      borderColor: 'lightgreen',
      backgroundColor: 'lightgreen',
      fill: false,
      tension: 0.3,
    }],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  },
});

const ctx2 = document.getElementById('earningsPerClientChart').getContext('2d');
new Chart(ctx2, {
  type: 'bar',
  data: {
    labels: ['Client 1', 'Client 2', 'Client 3', 'Client 4'],
    datasets: [{
      label: 'Earnings',
      data: [966.88, 0, 100, 0.96],
      backgroundColor: 'royalblue',
    }],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  },
});

// Commission js code here------------>

const tableData = [
  { tradeId: "39250436", client: "Krishna test (admin@vtindex.com)", account: "2141707517", symbol: "XAUUSD", totalCommission: "$0.08", ibCommission: "$0.06", createdAt: "2025-04-24" },
  { tradeId: "39303852", client: "Krishna test (admin@vtindex.com)", account: "2141707517", symbol: "XAUUSD", totalCommission: "$0.08", ibCommission: "$0.06", createdAt: "2025-04-28" },
];

let currentPage = 1;
let rowsPerPage = 5;
let currentSort = { key: null, direction: null };
let filteredData = [...tableData];

function renderTable() {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(start, start + rowsPerPage);

  if (paginatedData.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">No records found</td></tr>`;
    renderPagination();
    return;
  }

  paginatedData.forEach((item, index) => {
    const row = `
      <tr>
        <td>${start + index + 1}</td>
        <td>${item.tradeId}</td>
        <td>${item.client}</td>
        <td>${item.account}</td>
        <td>${item.symbol}</td>
        <td>${item.totalCommission}</td>
        <td>${item.ibCommission}</td>
        <td>${item.createdAt}</td>
      </tr>`;
    tableBody.insertAdjacentHTML("beforeend", row);
  });

  renderPagination();
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  if (pageCount <= 1) return;

  for (let i = 1; i <= pageCount; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.classList.toggle("active", i === currentPage);
    btn.addEventListener("click", () => {
      currentPage = i;
      renderTable();
    });
    pagination.appendChild(btn);
  }
}

function sortTable(key) {
  const ths = document.querySelectorAll("th[data-sort]");
  ths.forEach(th => th.classList.remove("sorted-asc", "sorted-desc"));

  if (currentSort.key === key) {
    currentSort.direction = currentSort.direction === "asc" ? "desc" : "asc";
  } else {
    currentSort = { key, direction: "asc" };
  }

  filteredData.sort((a, b) => {
    let valA = a[key];
    let valB = b[key];

    if (typeof valA === "string" && valA.startsWith('$')) valA = parseFloat(valA.replace('$', ''));
    if (typeof valB === "string" && valB.startsWith('$')) valB = parseFloat(valB.replace('$', ''));

    valA = typeof valA === 'string' ? valA.toLowerCase() : valA;
    valB = typeof valB === 'string' ? valB.toLowerCase() : valB;

    if (valA < valB) return currentSort.direction === "asc" ? -1 : 1;
    if (valA > valB) return currentSort.direction === "asc" ? 1 : -1;
    return 0;
  });

  const header = document.querySelector(`th[data-sort="${key}"]`);
  if (header) header.classList.add(`sorted-${currentSort.direction}`);

  renderTable();
}

function filterTable(value) {
  const search = value.toLowerCase();
  filteredData = tableData.filter(row =>
    Object.values(row).some(val =>
      val?.toString().toLowerCase().includes(search)
    )
  );
  currentPage = 1;
  renderTable();
}

document.querySelectorAll("th[data-sort]").forEach(th =>
  th.addEventListener("click", () => sortTable(th.getAttribute("data-sort")))
);

document.getElementById("searchInput-commission").addEventListener("input", (e) =>
  filterTable(e.target.value)
);

document.getElementById("rowsPerPage").addEventListener("change", (e) => {
  rowsPerPage = parseInt(e.target.value);
  currentPage = 1;
  renderTable();
});

renderTable();





// Withdrawals js code here------------>

// 1. Balance Display
let balance = 327.84;
document.getElementById("balanceDisplay").textContent = `$${balance.toFixed(2)}`;

// 2. Transactions
const pendingTransactions = [
  {
    date: "4/10/2025",
    user: "acc1",
    type: "Commission Withdrawal",
    amount: 640.0,
    status: "Pending"
  }

];

const historyTransactions = [
  {
    date: "4/08/2025",
    user: "acc2",
    type: "Bonus Withdrawal",
    amount: 300.0,
    status: "Approved"
  }
];

// 3. Table Rendering
function renderTableData(data, tbodyId) {
  const tbody = document.getElementById(tbodyId);
  tbody.innerHTML = "";

  if (data.length === 0) {
    const row = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 6;
    td.className = "no-data";
    td.textContent = "No transactions found.";
    row.appendChild(td);
    tbody.appendChild(row);
    return;
  }

  data.forEach((item, index) => {
    const row = document.createElement("tr");
    const statusClass =
      item.status === "Approved"
        ? "status-approved"
        : item.status === "Rejected"
        ? "status-rejected"
        : "status-pending";

    const dot = `<span class="dot"></span>`;

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.date}</td>
      <td>${item.user}</td>
      <td>${item.type}</td>
      <td><strong>$${item.amount.toFixed(2)}</strong></td>
      <td class="${statusClass}">${dot}${item.status}</td>
    `;

    tbody.appendChild(row);
  });
}

// 4. Tab Switching Logic
document.querySelectorAll(".withtabs .withtab").forEach(tab => {
  tab.addEventListener("click", () => {
    const targetId = tab.getAttribute("data-tab");

    // Hide all tab contents
    document.querySelectorAll(".withtab-content").forEach(content => {
      content.style.display = "none";
    });

    // Remove active class from all tabs
    document.querySelectorAll(".withtabs .withtab").forEach(btn => {
      btn.classList.remove("active");
    });

    // Show selected tab content
    document.getElementById(targetId).style.display = "block";
    tab.classList.add("active");

    // Render data if needed
    if (targetId === "pendingTab") renderTableData(pendingTransactions, "pendingTableBody");
    if (targetId === "historyTab") renderTableData(historyTransactions, "historyTableBody");
  });
});

// 5. Submit Withdrawal Request
document.getElementById("submitBtn").addEventListener("click", () => {
  const account = document.getElementById("accountSelect").value;
  const amount = parseFloat(document.getElementById("amountInput").value);

  if (!account || account === "Select Trading Account") {
    alert("Please select a trading account.");
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid withdrawal amount.");
    return;
  }

  if (amount > balance) {
    alert("Insufficient balance.");
    return;
  }

  const newTxn = {
    date: new Date().toLocaleDateString(),
    user: account,
    type: "Withdrawal Request",
    amount: amount,
    status: "Pending"
  };

  pendingTransactions.push(newTxn);
  balance -= amount;
  document.getElementById("balanceDisplay").textContent = `$${balance.toFixed(2)}`;
  alert(`Withdrawal of $${amount.toFixed(2)} submitted successfully.`);

  document.getElementById("amountInput").value = "";

  // Refresh pending tab if visible
  const pendingVisible = document.getElementById("pendingTab").style.display !== "none";
  if (pendingVisible) renderTableData(pendingTransactions, "pendingTableBody");
});

// 6. Initial State
document.querySelector(".withtabs .withtab.active").click(); // Trigger first tab
