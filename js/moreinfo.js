function loadTab(file, clickedTab, event) {
  event.preventDefault();

  // Fetch the content of the HTML file
  fetch(file)
    .then(response => {
      if (!response.ok) throw new Error("Failed to load content");
      return response.text();
    })
    .then(html => {
      // Inject HTML into the content area
      document.getElementById('content-area').innerHTML = html;

      // Update active tab styling
      document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
      clickedTab.classList.add('active');
    })
    .catch(error => {
      document.getElementById('content-area').innerHTML = `<p style="color:red;">Error loading content: ${error.message}</p>`;
    });
}

function loadTab(tabId, element, event) {
  event.preventDefault();
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(tabContent => tabContent.style.display = 'none');

  element.classList.add('active');
  document.getElementById(tabId).style.display = 'block';
}

