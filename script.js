// StaffSync App Logic
// Employee records are loaded from employees.json.

let employees = [];

const loginScreen = document.getElementById('loginScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const detailScreen = document.getElementById('detailScreen');

function showScreen(screen) {
  [loginScreen, dashboardScreen, detailScreen].forEach(item => item.classList.add('hidden'));
  screen.classList.remove('hidden');
}

async function loadEmployees() {
  try {
    const response = await fetch('employees.json');
    if (!response.ok) throw new Error('Could not load employee data.');
    employees = await response.json();
    document.getElementById('totalEmployees').textContent = employees.length;
    document.getElementById('totalDepartments').textContent = new Set(employees.map(e => e.dept)).size;
    renderEmployees();
  } catch (error) {
    document.getElementById('employeeList').textContent =
      'Unable to load employees.json. Run this project using a local web server.';
  }
}

function signIn() {
  const phone = document.getElementById('phoneInput').value.trim();
  const message = document.getElementById('loginMessage');
  if (phone.replace(/\\D/g, '').length < 10) {
    message.textContent = 'Please enter a valid phone number.';
    return;
  }
  message.textContent = '';
  document.getElementById('logoutBtn').classList.remove('hidden');
  showScreen(dashboardScreen);
  loadEmployees();
}

function renderEmployees(filter = '') {
  const list = document.getElementById('employeeList');
  const query = filter.toLowerCase();
  const filtered = employees.filter(emp =>
    emp.name.toLowerCase().includes(query) ||
    emp.role.toLowerCase().includes(query) ||
    emp.dept.toLowerCase().includes(query)
  );

  list.innerHTML = '';
  document.getElementById('emptyMessage').classList.toggle('hidden', filtered.length !== 0);

  filtered.forEach(emp => {
    const button = document.createElement('button');
    button.className = 'employee';
    button.type = 'button';
    button.innerHTML = `<span class="avatar">${emp.initials}</span>
      <span class="employee-info"><strong></strong><span></span></span><span class="arrow">›</span>`;
    button.querySelector('strong').textContent = emp.name;
    button.querySelector('.employee-info span').textContent = `${emp.role} · ${emp.dept}`;
    button.addEventListener('click', () => showEmployeeDetail(emp.id));
    list.appendChild(button);
  });
}

function showEmployeeDetail(id) {
  const emp = employees.find(item => item.id === id);
  if (!emp) return;
  document.getElementById('detailAvatar').textContent = emp.initials;
  document.getElementById('detailName').textContent = emp.name;
  document.getElementById('detailRole').textContent = emp.role;
  document.getElementById('detailId').textContent = emp.id;
  document.getElementById('detailDept').textContent = emp.dept;
  document.getElementById('detailEmail').textContent = emp.email;
  document.getElementById('detailPhone').textContent = emp.phone;
  showScreen(detailScreen);
}

document.getElementById('loginBtn').addEventListener('click', signIn);
document.getElementById('phoneInput').addEventListener('keydown', event => {
  if (event.key === 'Enter') signIn();
});
document.getElementById('searchInput').addEventListener('input', event => renderEmployees(event.target.value));
document.getElementById('backBtn').addEventListener('click', () => showScreen(dashboardScreen));
document.getElementById('logoutBtn').addEventListener('click', () => {
  document.getElementById('logoutBtn').classList.add('hidden');
  document.getElementById('phoneInput').value = '';
  showScreen(loginScreen);
});
