document.addEventListener("DOMContentLoaded", () => {
  loadDashboardData();
  loadRecentActivity();
});

// Format timestamps into readable strings
function formatTime(ts) {
  return new Date(ts).toLocaleString();
}

// Load dashboard box values dynamically
async function loadDashboardData() {
  try {
    const data = await fetchWithAuth('/api/dashboard-data');
    for (const [key, value] of Object.entries(data)) {
      const box = document.querySelector(`.dashboard-box.${key}`);
      if (box) {
        box.innerHTML = `<strong>${key}</strong><span>${value}</span>`;
      }
    }
  } catch (err) {
    console.error("Failed to load dashboard data:", err);
    showToast("Dashboard data could not be loaded.");
  }
}

// Load recent activities with graceful fallback
async function loadRecentActivity() {
  const list = document.getElementById("recent-activity-list");
  list.innerHTML = "<li>Loading...</li>";

  try {
    const activities = await fetchWithAuth('/api/recent-activity');
    list.innerHTML = "";

    if (activities.length === 0) {
      list.innerHTML = "<li>No recent activity.</li>";
      return;
    }

    activities.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${item.type}</strong>: ${item.amount} <small>(${formatTime(item.time)})</small>`;
      list.appendChild(li);
    });
  } catch (err) {
    list.innerHTML = "<li>Error loading activity</li>";
    console.error("Failed to load recent activity:", err);
    showToast("Could not fetch recent activity.");
  }
}

// Optional toast function for better UI feedback
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
