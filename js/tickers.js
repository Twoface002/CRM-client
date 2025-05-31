document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ticketForm');
  const subjectInput = document.getElementById('subjectInput');
  const descInput = document.getElementById('descInput');
  const fileInput = document.getElementById('fileInput');
  const openTbody = document.querySelector('#open tbody');
  const pendingTbody = document.querySelector('#pending tbody');
  const closedTbody = document.querySelector('#closed tbody');

  const modal = document.getElementById('ticket-modal');
  const closeBtn = modal.querySelector('.close');
  const modalSubj = document.getElementById('modal-subject');
  const modalMeta = document.getElementById('modal-meta');
  const modalAttach = document.getElementById('modal-attachment');

  const input = document.getElementById('modal-input');
  const sendBtn = document.getElementById('modal-send');
  const reopenBtn = document.querySelector('.reopen-btn');
  const statusTag = document.querySelector('.status-tag');
  

  const modalAttachBtn = document.getElementById('modal-attach');
  const modalFileInput = document.getElementById('modal-file');
  const modalReopenBtn = document.getElementById('reopen-btn');

  const nextId = () => 'TCKT' + Date.now();

  window.showPage = function (page) {
    document.querySelectorAll('.page-section').forEach(sec =>
      sec.classList.toggle('active', sec.id === page));
    document.querySelectorAll('.tab-button').forEach(btn =>
      btn.classList.toggle('active', btn.textContent.toLowerCase().includes(page))
    );
  };

  window.switchTab = function (tab) {
    document.querySelectorAll('.tab-content').forEach(cont =>
      cont.classList.toggle('active', cont.id === tab));
    document.querySelectorAll('.tab-btn').forEach(btn =>
      btn.classList.toggle('active', btn.dataset.tab === tab));
  };

  form.addEventListener('submit', e => {
    e.preventDefault();

    const subject = subjectInput.value.trim();
    const desc = descInput.value.trim();
    if (!subject || !desc) return;

    let attachmentURL = '';
    if (fileInput.files.length) {
      attachmentURL = URL.createObjectURL(fileInput.files[0]);
    }

    const emptyRow = openTbody.querySelector('.empty-box');
    if (emptyRow) emptyRow.remove();

    const created = new Date().toLocaleString();
    const ticketId = nextId();
    const username = 'guest_user';
    const status = 'Waiting';

    const tr = document.createElement('tr');
    tr.dataset.subject = subject;
    tr.dataset.date = created;
    tr.dataset.user = username;
    tr.dataset.status = status;
    tr.dataset.attachment = attachmentURL;

    tr.innerHTML = `
      <td>${created}</td>
      <td>${ticketId}</td>
      <td>${username}</td>
      <td>${subject}</td>
      <td>${status}</td>
      <td><a href="#" class="view-details">View Details</a></td>
    `;

    openTbody.appendChild(tr);
    form.reset();
    if (attachmentURL) URL.revokeObjectURL(attachmentURL);

    showPage('view');
    switchTab('open');
  });

  // View details for Open, Pending, and Closed Tickets
  function viewTicketDetails(e) {
    if (!e.target.matches('.view-details')) return;
    e.preventDefault();

    const row = e.target.closest('tr');
    const subject = row.dataset.subject;
    const status = row.dataset.status;
    const date = row.dataset.date;
    const user = row.dataset.user;
    const attachmentURL = row.dataset.attachment;

    modalSubj.innerHTML = `${subject} <span class="status-tag">• ${status}</span>`;
    modalMeta.innerText = `${date} - ${user}`;
    statusTag.textContent = `• ${status}`;

    if (attachmentURL) {
      modalAttach.href = attachmentURL;
      modalAttach.textContent = 'View Attachment';
      modalAttach.style.display = 'inline';
    } else {
      modalAttach.style.display = 'none';
    }


// Show Send and Attach buttons for all statuses
    input.disabled = false;
    sendBtn.disabled = false;
    reopenBtn.style.display = status.toLowerCase() === 'closed' ? 'inline-block' : 'none'; // Only show "Reopen" for closed tickets


    modal.style.display = 'block';
  }

  openTbody.addEventListener('click', viewTicketDetails);
  pendingTbody.addEventListener('click', viewTicketDetails);
  closedTbody.addEventListener('click', viewTicketDetails);

  closeBtn.addEventListener('click', () => modal.style.display = 'none');

  window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });

  sendBtn.addEventListener('click', () => {
    const message = input.value.trim();
    if (message) {
      console.log('Message sent:', message);
      input.value = '';
    }
  });

  // ✅ FIXED — only ONE listener for reopen logic
  reopenBtn.addEventListener('click', () => {
    // Update the status in the modal
    const subjectText = modalSubj.textContent.split('•')[0].trim();
    const row = [...openTbody.querySelectorAll('tr')].find(tr =>
      tr.dataset.subject === subjectText);

    // Check if row exists before updating
    if (row) {
      // Update row status and display
      row.dataset.status = 'Active';
      row.querySelector('td:nth-child(5)').textContent = 'Active'; // Update the status cell in the table

      // Update modal to reflect the new status
      modalSubj.innerHTML = `${subjectText} <span class="status-tag">• Active</span>`;
      statusTag.textContent = '• Active';


    }
  });
});

// ========== Search Filter Logic ========== 
document.querySelectorAll('.tab-content').forEach(tab => {
  const input = tab.querySelector('.search-box input');
  const table = tab.querySelector('table tbody');

  if (input && table) {
    input.addEventListener('keyup', function () {
      const query = this.value.toLowerCase();
      const rows = table.querySelectorAll('tr');

      let visibleRowCount = 0;

      rows.forEach(row => {
        if (row.classList.contains('empty-box')) return;

        const rowText = row.textContent.toLowerCase();
        const isMatch = rowText.includes(query);
        row.style.display = isMatch ? '' : 'none';
        if (isMatch) visibleRowCount++;
      });

      const emptyRow = table.querySelector('.empty-box');
      if (emptyRow) {
        emptyRow.style.display = visibleRowCount === 0 ? '' : 'none';
      }
    });
  }
});


  /* chat – attach */
  modalAttachBtn.onclick = () => modalFileInput.click();
  modalFileInput.onchange = () => {
    const f = modalFileInput.files[0];
    if (f) alert('Attached: ' + f.name);
  };

  /* chat – send */
  sendBtn.onclick = () => {
    const msg = input.value.trim();
    if (!msg) { alert('Type a message first'); return; }
    console.log('Message:', msg);
    alert('Message sent: ' + msg);
    input.value = '';
  };



reopenBtn.addEventListener('click', () => {
  const subjectText = modalSubj.textContent.split('•')[0].trim();

  // Find the row in CLOSED table
  const closedRows = [...closedTbody.querySelectorAll('tr')];
  const closedRow = closedRows.find(tr => tr.dataset.subject === subjectText);

  if (closedRow) {
    // Update dataset and status cell
    closedRow.dataset.status = 'Waiting';
    closedRow.querySelector('td:nth-child(5)').textContent = 'Waiting';

    // Move the row to the OPEN table
    openTbody.appendChild(closedRow);

    // Remove "empty-box" in open if present
    const emptyOpen = openTbody.querySelector('.empty-box');
    if (emptyOpen) emptyOpen.remove();

    // Show empty message in closed if now empty
    const nonEmptyClosed = [...closedTbody.querySelectorAll('tr')].filter(tr => !tr.classList.contains('empty-box'));
    if (nonEmptyClosed.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.className = 'empty-box';
      emptyRow.innerHTML = `<td colspan="6">No closed tickets</td>`;
      closedTbody.appendChild(emptyRow);
    }

    // Update modal
    modalSubj.innerHTML = `${subjectText} <span class="status-tag">• Waiting</span>`;
    statusTag.textContent = '• Waiting';
    reopenBtn.style.display = 'none';
  }
});


























// Dummy Data for Tickets testing
function seedDummyTickets() {
  const openTbody = document.querySelector('#open tbody');
  const pendingTbody = document.querySelector('#pending tbody');
  const closedTbody = document.querySelector('#closed tbody');

  const tickets = [
    // Open Tickets
    {
      subject: 'Unable to reset password',
      created: '2025-05-15 09:00:00',
      ticketId: 'TCKT1001',
      username: 'john_doe',
      status: 'Waiting',
      attachmentURL: 'https://via.placeholder.com/150'
    },
    {
      subject: 'Requesting refund',
      created: '2025-05-12 10:05:00',
      ticketId: 'TCKT1004',
      username: 'alice_w',
      status: 'Waiting',
      attachmentURL: ''
    },

    // Pending Tickets
    {
      subject: 'Incorrect billing amount',
      created: '2025-05-14 16:20:30',
      ticketId: 'TCKT1002',
      username: 'jane_smith',
      status: 'Pending',
      attachmentURL: ''
    },

    // Closed Tickets
    {
      subject: 'Site crashing on login',
      created: '2025-05-13 12:45:00',
      ticketId: 'TCKT1003',
      username: 'mark_z',
      status: 'Closed',
      attachmentURL: 'https://via.placeholder.com/150'
    },
    {
      subject: 'Feature request: Dark mode',
      created: '2025-05-11 14:10:00',
      ticketId: 'TCKT1005',
      username: 'emma_b',
      status: 'Closed',
      attachmentURL: ''
    }
  ];

  // Add Open Tickets
  tickets.filter(ticket => ticket.status === 'Waiting').forEach(ticket => {
    const tr = document.createElement('tr');
    tr.dataset.subject = ticket.subject;
    tr.dataset.date = ticket.created;
    tr.dataset.user = ticket.username;
    tr.dataset.status = ticket.status;
    tr.dataset.attachment = ticket.attachmentURL;

    tr.innerHTML = `
      <td>${ticket.created}</td>
      <td>${ticket.ticketId}</td>
      <td>${ticket.username}</td>
      <td>${ticket.subject}</td>
      <td>${ticket.status}</td>
      <td><a href="#" class="view-details">View Details</a></td>
    `;
    openTbody.appendChild(tr);
  });

  // Add Pending Tickets
  tickets.filter(ticket => ticket.status === 'Pending').forEach(ticket => {
    const tr = document.createElement('tr');
    tr.dataset.subject = ticket.subject;
    tr.dataset.date = ticket.created;
    tr.dataset.user = ticket.username;
    tr.dataset.status = ticket.status;
    tr.dataset.attachment = ticket.attachmentURL;

    tr.innerHTML = `
      <td>${ticket.created}</td>
      <td>${ticket.ticketId}</td>
      <td>${ticket.username}</td>
      <td>${ticket.subject}</td>
      <td>${ticket.status}</td>
      <td><a href="#" class="view-details">View Details</a></td>
    `;
    pendingTbody.appendChild(tr);
  });

  // Add Closed Tickets
  tickets.filter(ticket => ticket.status === 'Closed').forEach(ticket => {
    const tr = document.createElement('tr');
    tr.dataset.subject = ticket.subject;
    tr.dataset.date = ticket.created;
    tr.dataset.user = ticket.username;
    tr.dataset.status = ticket.status;
    tr.dataset.attachment = ticket.attachmentURL;

    tr.innerHTML = `
      <td>${ticket.created}</td>
      <td>${ticket.ticketId}</td>
      <td>${ticket.username}</td>
      <td>${ticket.subject}</td>
      <td>${ticket.status}</td>
      <td><a href="#" class="view-details">View Details</a></td>
    `;
    closedTbody.appendChild(tr);
  });
}

// Call the function after page load
document.addEventListener('DOMContentLoaded', seedDummyTickets);


