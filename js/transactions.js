
function showSection(id,event) {
    const sections = document.querySelectorAll('.section');
    const tabs = document.querySelectorAll('.tab');
    
    sections.forEach(section => {
      section.classList.remove('active');
    });

    tabs.forEach(tab => {
      tab.classList.remove('active');
    });

    document.getElementById(id).classList.add('active');
    event.target.classList.add('active');
  }

  // Example function to fetch transaction data from an API
async function fetchTransactionData() {
  try {
    // Replace with your actual API endpoint
    const response = await fetch('https://api.example.com/transactions');
    const data = await response.json(); // Assuming the data returned is in JSON format
    populateTransactionData(data); // Call function to populate data into the table
  } catch (error) {
    console.error('Error fetching transaction data:', error);
  }
}

// Function to populate data into the table
function populateTransactionData(data) {
  const sections = ['deposits', 'withdrawals', 'transfers', 'pendings'];

  // Loop over each section (tab) and populate the respective table
  sections.forEach(section => {
    const tableBody = document.querySelector(`#${section} tbody`);
    tableBody.innerHTML = ''; // Clear existing rows
    
    // Filter data for each section (assuming data is structured with a 'type' field)
    const sectionData = data.filter(item => item.type === section);

    sectionData.forEach(transaction => {
      const row = document.createElement('tr');
      
      // Create table cells for each column
      row.innerHTML = `
        <td>${new Date(transaction.date).toLocaleString()}</td>
        <td>${transaction.accountId}</td>
        <td>${transaction.accountName}</td>
        <td>$${transaction.amount.toFixed(2)}</td>
        <td><span class="${transaction.status.toLowerCase()}">${transaction.status}</span></td>
      `;

      // Append row to table body
      tableBody.appendChild(row);
    });
  });
}

// Initial load function
function loadTransactions() {
  fetchTransactionData();
}

// Call loadTransactions when the page loads
window.onload = loadTransactions;

// Function to handle tab switching
function showSection(sectionId, event) {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.classList.remove('active'));

  event.target.classList.add('active');

  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.classList.remove('active'));

  const selectedSection = document.getElementById(sectionId);
  selectedSection.classList.add('active');
}


