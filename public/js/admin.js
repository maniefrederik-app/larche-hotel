// Admin Dashboard JavaScript

let currentSection = 'dashboard';
let data = { rooms: [], venues: [], bookings: [], guests: [], services: [], specials: [] };

// Toggle Sidebar
function toggleSidebar() {
  document.querySelector('.admin-sidebar').classList.toggle('open');
}

// Navigation
document.querySelectorAll('.nav-item[data-section]').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const section = item.dataset.section;
    switchSection(section);
  });
});

function switchSection(section) {
  currentSection = section;
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`.nav-item[data-section="${section}"]`).classList.add('active');
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.getElementById(`section-${section}`).classList.add('active');
  document.getElementById('page-title').textContent = getSectionTitle(section);
  loadSectionData(section);
}

function getSectionTitle(section) {
  const titles = {
    dashboard: 'Dashboard',
    hotel: 'Hotel Profile',
    rooms: 'Room Management',
    venues: 'Venue Management',
    bookings: 'Booking Management',
    guests: 'Guest Profiles',
    services: 'Service Requests',
    specials: 'Specials & Offers'
  };
  return titles[section] || 'Dashboard';
}

// Load Data
async function loadSectionData(section) {
  try {
    if (section === 'dashboard') {
      await loadDashboard();
    } else if (section === 'rooms') {
      await loadRooms();
    } else if (section === 'venues') {
      await loadVenues();
    } else if (section === 'bookings') {
      await loadBookings();
    } else if (section === 'guests') {
      await loadGuests();
    } else if (section === 'services') {
      await loadServices();
    } else if (section === 'specials') {
      await loadSpecials();
    } else if (section === 'hotel') {
      await loadHotel();
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Dashboard
async function loadDashboard() {
  const [rooms, bookings, guests, venues, services] = await Promise.all([
    fetch('/api/rooms').then(r => r.json()),
    fetch('/api/bookings').then(r => r.json()),
    fetch('/api/guests').then(r => r.json()),
    fetch('/api/venues').then(r => r.json()),
    fetch('/api/services').then(r => r.json())
  ]);
  
  data = { rooms, bookings, guests, venues, services };
  
  document.getElementById('stat-rooms').textContent = rooms.length;
  document.getElementById('stat-bookings').textContent = bookings.filter(b => b.status === 'confirmed').length;
  document.getElementById('stat-guests').textContent = guests.length;
  document.getElementById('stat-venues').textContent = venues.length;
  
  // Recent Bookings
  const bookingsBody = document.querySelector('#recent-bookings tbody');
  bookingsBody.innerHTML = bookings.slice(0, 5).map(b => `
    <tr>
      <td>${b.guestName || 'N/A'}</td>
      <td>${b.roomType || 'N/A'}</td>
      <td>${formatDate(b.checkIn)}</td>
      <td><span class="badge badge-${getStatusClass(b.status)}">${b.status}</span></td>
    </tr>
  `).join('') || '<tr><td colspan="4" class="empty-state">No bookings yet</td></tr>';
  
  // Pending Services
  const servicesBody = document.querySelector('#pending-services tbody');
  const pending = services.filter(s => s.status === 'pending');
  servicesBody.innerHTML = pending.slice(0, 5).map(s => `
    <tr>
      <td>${s.guestName}</td>
      <td>${s.type}</td>
      <td><span class="badge badge-warning">${s.status}</span></td>
      <td><button class="btn btn-sm btn-primary" onclick="completeService('${s.id}')">Complete</button></td>
    </tr>
  `).join('') || '<tr><td colspan="4" class="empty-state">No pending services</td></tr>';
}

// Rooms
async function loadRooms() {
  const rooms = await fetch('/api/rooms').then(r => r.json());
  data.rooms = rooms;
  renderTable('rooms-table', rooms, ['roomNumber', 'type', 'floor', 'price', 'status'], 'room');
}

// Venues
async function loadVenues() {
  const venues = await fetch('/api/venues').then(r => r.json());
  data.venues = venues;
  renderTable('venues-table', venues, ['name', 'type', 'capacity', 'pricePerHour', 'status'], 'venue');
}

// Bookings
async function loadBookings() {
  const bookings = await fetch('/api/bookings').then(r => r.json());
  data.bookings = bookings;
  renderTable('bookings-table', bookings, ['id', 'guestName', 'roomType', 'checkIn', 'checkOut', 'status'], 'booking');
}

// Guests
async function loadGuests() {
  const guests = await fetch('/api/guests').then(r => r.json());
  data.guests = guests;
  renderTable('guests-table', guests, ['name', 'email', 'phone', 'vipStatus'], 'guest');
}

// Services
async function loadServices() {
  const services = await fetch('/api/services').then(r => r.json());
  data.services = services;
  renderTable('services-table', services, ['guestName', 'roomNumber', 'type', 'description', 'status'], 'service');
}

// Specials
async function loadSpecials() {
  const specials = await fetch('/api/specials').then(r => r.json());
  data.specials = specials;
  renderTable('specials-table', specials, ['name', 'type', 'originalPrice', 'discountedPrice', 'validUntil', 'active'], 'special');
}

// Hotel
async function loadHotel() {
  const hotel = await fetch('/api/hotel').then(r => r.json());
  const form = document.getElementById('hotel-form');
  Object.keys(hotel).forEach(key => {
    const input = form.querySelector(`[name="${key}"]`);
    if (input) input.value = hotel[key];
  });
}

// Render Table Helper
function renderTable(tableId, items, fields, type) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${fields.length + 1}" class="empty-state">No data found</td></tr>`;
    return;
  }
  tbody.innerHTML = items.map(item => `
    <tr>
      ${fields.map(f => `<td>${f === 'status' || f === 'active' ? `<span class="badge badge-${getStatusClass(item[f])}">${item[f]}</span>` : (item[f] || 'N/A')}</td>`).join('')}
      <td>
        <button class="btn btn-sm btn-secondary" onclick="editItem('${type}', '${item.id}')"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-danger" onclick="deleteItem('${type}', '${item.id}')"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  `).join('');
}

// Save Functions
async function saveHotelProfile() {
  const form = document.getElementById('hotel-form');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  try {
    await fetch('/api/hotel', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    showToast('Hotel profile saved', 'success');
  } catch (e) { showToast('Error saving', 'error'); }
}

async function saveRoom() {
  const form = document.getElementById('room-form');
  const id = document.getElementById('room-id').value;
  const formData = new FormData(form);
  const roomData = Object.fromEntries(formData);
  if (roomData.amenities) roomData.amenities = roomData.amenities.split(',').map(a => a.trim());
  try {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/rooms/${id}` : '/api/rooms';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(roomData) });
    closeModal('room-modal');
    loadRooms();
    showToast('Room saved', 'success');
  } catch (e) { showToast('Error saving', 'error'); }
}

async function saveVenue() {
  const form = document.getElementById('venue-form');
  const id = document.getElementById('venue-id').value;
  const formData = new FormData(form);
  const venueData = Object.fromEntries(formData);
  try {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/venues/${id}` : '/api/venues';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(venueData) });
    closeModal('venue-modal');
    loadVenues();
    showToast('Venue saved', 'success');
  } catch (e) { showToast('Error saving', 'error'); }
}

async function saveBooking() {
  const form = document.getElementById('booking-form');
  const id = document.getElementById('booking-id').value;
  const formData = new FormData(form);
  const bookingData = Object.fromEntries(formData);
  try {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/bookings/${id}` : '/api/bookings';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bookingData) });
    closeModal('booking-modal');
    loadBookings();
    showToast('Booking saved', 'success');
  } catch (e) { showToast('Error saving', 'error'); }
}

async function saveGuest() {
  const form = document.getElementById('guest-form');
  const id = document.getElementById('guest-id').value;
  const formData = new FormData(form);
  const guestData = Object.fromEntries(formData);
  try {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/guests/${id}` : '/api/guests';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(guestData) });
    closeModal('guest-modal');
    loadGuests();
    showToast('Guest saved', 'success');
  } catch (e) { showToast('Error saving', 'error'); }
}

async function saveService() {
  const form = document.getElementById('service-form');
  const id = document.getElementById('service-id').value;
  const formData = new FormData(form);
  const serviceData = Object.fromEntries(formData);
  try {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/services/${id}` : '/api/services';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(serviceData) });
    closeModal('service-modal');
    loadServices();
    showToast('Service saved', 'success');
  } catch (e) { showToast('Error saving', 'error'); }
}

async function saveSpecial() {
  const form = document.getElementById('special-form');
  const id = document.getElementById('special-id').value;
  const formData = new FormData(form);
  const specialData = Object.fromEntries(formData);
  specialData.active = specialData.active === 'true';
  try {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/specials/${id}` : '/api/specials';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(specialData) });
    closeModal('special-modal');
    loadSpecials();
    showToast('Special saved', 'success');
  } catch (e) { showToast('Error saving', 'error'); }
}

// Edit Item
function editItem(type, id) {
  const item = data[type + 's'].find(i => i.id === id);
  if (!item) return;
  
  document.getElementById(`${type}-id`).value = id;
  document.getElementById(`${type}-modal-title`).textContent = `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  
  const form = document.getElementById(`${type}-form`);
  Object.keys(item).forEach(key => {
    const input = form.querySelector(`[name="${key}"]`);
    if (input) {
      if (key === 'amenities' && Array.isArray(item[key])) {
        input.value = item[key].join(', ');
      } else if (key === 'active') {
        input.value = item[key].toString();
      } else {
        input.value = item[key];
      }
    }
  });
  
  openModal(`${type}-modal`);
}

// Delete Item
async function deleteItem(type, id) {
  if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
  try {
    await fetch(`/api/${type}s/${id}`, { method: 'DELETE' });
    loadSectionData(currentSection);
    showToast(`${type} deleted`, 'success');
  } catch (e) { showToast('Error deleting', 'error'); }
}

// Complete Service
async function completeService(id) {
  try {
    await fetch(`/api/services/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'completed' }) });
    loadDashboard();
    showToast('Service completed', 'success');
  } catch (e) { showToast('Error updating', 'error'); }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
});
