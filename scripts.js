let driverData = [];
const endpoint = "https://backend-mbcb.vercel.app";

// Fetch driver data from backend
async function fetchDriverData() {
  document.getElementById('loader').style.display = 'block';
  const response = await fetch(`${endpoint}/api/drivers`);
  const data = await response.json();
  driverData = data;
  document.getElementById('loader').style.display = 'none';
  renderTable();
}

// Function to render the dashboard table
function renderTable() {
  const tableBody = document.querySelector('#driverTable tbody');
  tableBody.innerHTML = '';
  driverData.forEach((driver, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${driver.fullName}</td>
      <td>${driver.email}</td>
      <td>${driver.phone}</td>
      <td>${driver.truckType}</td>
      <td>
        <button class="btn btn-info" onclick="viewDocument('${driver.filePath}')">View</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Function to view uploaded document
function viewDocument(filePath) {
  window.open(`${endpoint}/${filePath}`, '_blank');
}

document.getElementById('openFormBtn').addEventListener('click', function() {
  $('#formModal').modal('show');
});

document.getElementById('formModal').addEventListener('hidden.bs.modal', function (e) {
  if (!e.relatedTarget || !e.relatedTarget.id === 'closeModal') {
    e.preventDefault();
  }
});

// Handle form submission
document.getElementById('registrationForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  document.getElementById('loader').style.display = 'block';
  const formData = new FormData(this);
  
  const response = await fetch(`${endpoint}/api/submit`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  document.getElementById('loader').style.display = 'none';

  if (data.message === "Driver registered successfully!") {
    toastr.success('Registration Successful!');
    fetchDriverData();
    $('#formModal').modal('hide');
  } else {
    toastr.error('Registration Failed. Please try again!');
  }
});
window.onload = fetchDriverData;
