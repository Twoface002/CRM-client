let currentSort = {
    column: '',
    direction: ''
  };
  
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
  