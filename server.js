const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// In-memory data store
let data = {
  hotel: { 
    profile: { 
      name: "L'Arche De La Vie Hotel & Venue Estate", 
      description: "The L'Arche De La Vie is an exceptional hotel and event venue situated in the heart of Gauteng, South Africa. Located at the corner of Smith and Small Street, Benoni, this establishment offers a unique and captivating experience for business trips or tourists.", 
      starRating: "5", 
      yearEstablished: "2010",
      address: "Cnr Smith and Small Street",
      city: "Benoni",
      country: "South Africa",
      province: "Gauteng",
      postalCode: "1513",
      phone: "+27 11 123 4567",
      email: "info@larchedelavie.co.za"
    } 
  },
  rooms: [
    { id: "1", roomNumber: "101", type: "standard", floor: "1", price: "150", status: "available", maxOccupancy: "2", amenities: ["WiFi", "TV", "AC"], images: ["/logo11.PNG"], createdAt: new Date().toISOString() },
    { id: "2", roomNumber: "201", type: "deluxe", floor: "2", price: "250", status: "available", maxOccupancy: "3", amenities: ["WiFi", "TV", "AC", "Mini Bar"], images: ["/logo7.PNG"], createdAt: new Date().toISOString() },
    { id: "3", roomNumber: "301", type: "suite", floor: "3", price: "450", status: "available", maxOccupancy: "4", amenities: ["WiFi", "TV", "AC", "Mini Bar", "Jacuzzi"], images: ["/logo12.PNG"], createdAt: new Date().toISOString() }
  ],
  venues: [
    { id: "1", name: "Grand Ballroom", type: "ballroom", capacity: "500", pricePerHour: "1000", status: "available", description: "Elegant ballroom for grand events", createdAt: new Date().toISOString() },
    { id: "2", name: "Conference Room A", type: "conference", capacity: "50", pricePerHour: "200", status: "available", description: "Modern conference room", createdAt: new Date().toISOString() },
    { id: "3", name: "Garden Terrace", type: "garden", capacity: "200", pricePerHour: "500", status: "available", description: "Beautiful outdoor venue", createdAt: new Date().toISOString() }
  ],
  bookings: [],
  guests: [],
  services: [],
  specials: [
    { id: "1", name: "Weekend Getaway", type: "package", description: "2 nights with breakfast included", originalPrice: "500", discountedPrice: "399", validFrom: "2026-01-01", validUntil: "2026-12-31", active: true, createdAt: new Date().toISOString() }
  ],
  amenities: [
    { id: "1", name: "Free WiFi", icon: "fas fa-wifi", createdAt: new Date().toISOString() },
    { id: "2", name: "Swimming Pool", icon: "fas fa-swimming-pool", createdAt: new Date().toISOString() },
    { id: "3", name: "Restaurant", icon: "fas fa-utensils", createdAt: new Date().toISOString() },
    { id: "4", name: "Spa", icon: "fas fa-spa", createdAt: new Date().toISOString() },
    { id: "5", name: "Fitness Center", icon: "fas fa-dumbbell", createdAt: new Date().toISOString() },
    { id: "6", name: "Parking", icon: "fas fa-parking", createdAt: new Date().toISOString() }
  ]
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to generate ID
const genId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// API Routes - Hotel
app.get('/api/hotel', (req, res) => {
  res.json(data.hotel.profile || {});
});

app.put('/api/hotel', (req, res) => {
  data.hotel.profile = { ...data.hotel.profile, ...req.body };
  res.json({ message: 'Hotel profile updated', data: data.hotel.profile });
});

app.get('/api/hotel/amenities', (req, res) => {
  res.json(data.amenities || []);
});

app.post('/api/hotel/amenities', (req, res) => {
  const amenity = { id: genId(), ...req.body, createdAt: new Date().toISOString() };
  data.amenities.push(amenity);
  res.json({ id: amenity.id, message: 'Amenity added' });
});

// API Routes - Rooms
app.get('/api/rooms', (req, res) => {
  res.json(data.rooms || []);
});

app.get('/api/rooms/:id', (req, res) => {
  const room = data.rooms.find(r => r.id === req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json(room);
});

app.post('/api/rooms', (req, res) => {
  const room = { id: genId(), ...req.body, createdAt: new Date().toISOString() };
  data.rooms.push(room);
  res.json({ id: room.id, message: 'Room created' });
});

app.put('/api/rooms/:id', (req, res) => {
  const index = data.rooms.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Room not found' });
  data.rooms[index] = { ...data.rooms[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ message: 'Room updated' });
});

app.delete('/api/rooms/:id', (req, res) => {
  data.rooms = data.rooms.filter(r => r.id !== req.params.id);
  res.json({ message: 'Room deleted' });
});

// API Routes - Venues
app.get('/api/venues', (req, res) => {
  res.json(data.venues || []);
});

app.get('/api/venues/:id', (req, res) => {
  const venue = data.venues.find(v => v.id === req.params.id);
  if (!venue) return res.status(404).json({ error: 'Venue not found' });
  res.json(venue);
});

app.post('/api/venues', (req, res) => {
  const venue = { id: genId(), ...req.body, createdAt: new Date().toISOString() };
  data.venues.push(venue);
  res.json({ id: venue.id, message: 'Venue created' });
});

app.put('/api/venues/:id', (req, res) => {
  const index = data.venues.findIndex(v => v.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Venue not found' });
  data.venues[index] = { ...data.venues[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ message: 'Venue updated' });
});

app.delete('/api/venues/:id', (req, res) => {
  data.venues = data.venues.filter(v => v.id !== req.params.id);
  res.json({ message: 'Venue deleted' });
});

// API Routes - Bookings
app.get('/api/bookings', (req, res) => {
  res.json(data.bookings || []);
});

app.get('/api/bookings/:id', (req, res) => {
  const booking = data.bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  res.json(booking);
});

app.post('/api/bookings', (req, res) => {
  const booking = { id: genId(), ...req.body, createdAt: new Date().toISOString() };
  data.bookings.push(booking);
  res.json({ id: booking.id, message: 'Booking created' });
});

app.put('/api/bookings/:id', (req, res) => {
  const index = data.bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Booking not found' });
  data.bookings[index] = { ...data.bookings[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ message: 'Booking updated' });
});

app.delete('/api/bookings/:id', (req, res) => {
  data.bookings = data.bookings.filter(b => b.id !== req.params.id);
  res.json({ message: 'Booking deleted' });
});

// API Routes - Guests
app.get('/api/guests', (req, res) => {
  res.json(data.guests || []);
});

app.get('/api/guests/:id', (req, res) => {
  const guest = data.guests.find(g => g.id === req.params.id);
  if (!guest) return res.status(404).json({ error: 'Guest not found' });
  res.json(guest);
});

app.post('/api/guests', (req, res) => {
  const guest = { id: genId(), ...req.body, createdAt: new Date().toISOString() };
  data.guests.push(guest);
  res.json({ id: guest.id, message: 'Guest created' });
});

app.put('/api/guests/:id', (req, res) => {
  const index = data.guests.findIndex(g => g.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Guest not found' });
  data.guests[index] = { ...data.guests[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ message: 'Guest updated' });
});

app.delete('/api/guests/:id', (req, res) => {
  data.guests = data.guests.filter(g => g.id !== req.params.id);
  res.json({ message: 'Guest deleted' });
});

// API Routes - Services
app.get('/api/services', (req, res) => {
  res.json(data.services || []);
});

app.get('/api/services/:id', (req, res) => {
  const service = data.services.find(s => s.id === req.params.id);
  if (!service) return res.status(404).json({ error: 'Service not found' });
  res.json(service);
});

app.post('/api/services', (req, res) => {
  const service = { id: genId(), ...req.body, createdAt: new Date().toISOString() };
  data.services.push(service);
  res.json({ id: service.id, message: 'Service created' });
});

app.put('/api/services/:id', (req, res) => {
  const index = data.services.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Service not found' });
  data.services[index] = { ...data.services[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ message: 'Service updated' });
});

app.delete('/api/services/:id', (req, res) => {
  data.services = data.services.filter(s => s.id !== req.params.id);
  res.json({ message: 'Service deleted' });
});

// API Routes - Specials
app.get('/api/specials', (req, res) => {
  res.json(data.specials || []);
});

app.get('/api/specials/active', (req, res) => {
  const now = new Date().toISOString();
  const active = data.specials.filter(s => s.active && s.validUntil >= now);
  res.json(active);
});

app.get('/api/specials/:id', (req, res) => {
  const special = data.specials.find(s => s.id === req.params.id);
  if (!special) return res.status(404).json({ error: 'Special not found' });
  res.json(special);
});

app.post('/api/specials', (req, res) => {
  const special = { id: genId(), ...req.body, createdAt: new Date().toISOString() };
  data.specials.push(special);
  res.json({ id: special.id, message: 'Special created' });
});

app.put('/api/specials/:id', (req, res) => {
  const index = data.specials.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Special not found' });
  data.specials[index] = { ...data.specials[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ message: 'Special updated' });
});

app.delete('/api/specials/:id', (req, res) => {
  data.specials = data.specials.filter(s => s.id !== req.params.id);
  res.json({ message: 'Special deleted' });
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Serve pages
app.get('/:page', (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, 'public', 'pages', `${page}.html`), (err) => {
    if (err) res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
});

// Export for Vercel
module.exports = app;

// Start server if running locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`L'Arche Hotel Server running on http://localhost:${PORT}`);
});
