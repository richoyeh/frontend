let driverData = []; // Store the fetched driver data

// Fetch driver data from backend
async function fetchDriverData() {
  document.getElementById('loader').style.display = 'block';
  
  const response = await fetch('http://localhost:5000/api/drivers');
  const data = await response.json();
  driverData = data;

  document.getElementById('loader').style.display = 'none';

  renderTable();
}

// Function to render the dashboard table
function renderTable() {
  const tableBody = document.querySelector('#driverTable tbody');
  tableBody.innerHTML = ''; // Clear existing data

  driverData.forEach((driver, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${driver.name.title} ${driver.name.first} ${driver.name.last}</td>
      <td>${driver.email}</td>
      <td>${driver.phone}</td>
      <td>Medium</td>
      <td>
        <button class="btn btn-info" onclick="viewDocument('${driver.picture.large}')">View</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Function to view uploaded document
function viewDocument(filePath) {
  window.open(filePath, '_blank');
}

// Open registration form modal when "Register New Driver" is clicked
document.getElementById('openFormBtn').addEventListener('click', function() {
  $('#formModal').modal('show');
});

// Prevent modal close when clicking outside, only close by clicking close icon
document.getElementById('formModal').addEventListener('hidden.bs.modal', function (e) {
  if (!e.relatedTarget || !e.relatedTarget.id === 'closeModal') {
    e.preventDefault();  // Prevent modal from closing when clicking outside
  }
});

// Handle form submission
document.getElementById('registrationForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent default form submission

  // Show loader while submitting
  document.getElementById('loader').style.display = 'block';

  // Get form data
  const formData = new FormData(this);

  // Submit form data via POST request
  const response = await fetch('http://localhost:5000/api/submit', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  // Hide loader once submission is done
  document.getElementById('loader').style.display = 'none';

  // Check if registration was successful
  if (data.message === "Driver registered successfully!") {
    toastr.success('Registration Successful!');
    fetchDriverData(); // Refresh the dashboard data before closing the modal
    $('#formModal').modal('hide'); // Close the form modal
  } else {
    toastr.error('Registration Failed. Please try again!');
  }
});

// Fetch initial data when the page loads
window.onload = fetchDriverData;
