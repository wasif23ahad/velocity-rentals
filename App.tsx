import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthState, User, UserRole, Vehicle, Booking, VehicleStatus, BookingStatus } from './types';
import { MOCK_USERS, MOCK_VEHICLES, MOCK_BOOKINGS, delay } from './services/mockData';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CreditCard, Menu, X, MessageSquare, MapPin, Calendar, User as UserIcon, LogOut, ShieldCheck } from 'lucide-react';

// --- Contexts ---

interface AppContextType {
  auth: AuthState;
  login: (email: string) => void;
  signup: (user: User) => void;
  logout: () => void;
  vehicles: Vehicle[];
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  deleteVehicle: (id: string) => void; // Admin only
}

const AppContext = createContext<AppContextType | null>(null);

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

// --- Components ---

const Navbar = () => {
  const { auth, logout } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? "text-accent font-semibold" : "text-gray-300 hover:text-white";

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <CreditCard className="h-8 w-8 text-accent" />
              <span className="font-bold text-xl tracking-tight">Velocity Rentals</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className={`px-3 py-2 rounded-md text-sm transition-colors ${isActive('/')}`}>Home</Link>
              <Link to="/vehicles" className={`px-3 py-2 rounded-md text-sm transition-colors ${isActive('/vehicles')}`}>Vehicles</Link>
              {auth.isAuthenticated && (
                <Link to="/dashboard" className={`px-3 py-2 rounded-md text-sm transition-colors ${isActive('/dashboard')}`}>Dashboard</Link>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {auth.isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-300">Welcome, {auth.user?.name}</span>
                  <button onClick={logout} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors" title="Logout">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-accent hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign In
                </Link>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-700">Home</Link>
            <Link to="/vehicles" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700">Vehicles</Link>
            {auth.isAuthenticated && (
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700">Dashboard</Link>
            )}
            {auth.isAuthenticated ? (
              <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300 hover:bg-slate-700">Logout</button>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-accent hover:text-blue-400 hover:bg-slate-700">Sign In</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};



// --- Pages ---

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative bg-primary py-24 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="Hero" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Drive Your Dream Today
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Premium vehicles for every occasion. From rugged SUVs to electric speedsters,
            Velocity Rentals gets you where you need to go in style.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/vehicles" className="rounded-md bg-accent px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              View Inventory
            </Link>
            <Link to="/login" className="text-sm font-semibold leading-6 text-white">
              Log in <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-accent">Faster Rental</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need to hit the road</p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We've streamlined the process. No paperwork, just instant booking and AI-powered recommendations.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  Secure Booking
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">Enterprise-grade security for your data and payments.</dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  Flexible Dates
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">Change your plans? Cancel or modify bookings easily.</dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  Multiple Locations
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">Pick up and drop off at convenient spots city-wide.</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const { login, auth } = useAppContext();
  const [email, setEmail] = useState('');

  if (auth.isAuthenticated) return <Navigate to="/dashboard" />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <CreditCard className="mx-auto h-12 w-12 text-accent" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@velocity.com or john@example.com"
            />
          </div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Don't have an account? <Link to="/signup" className="text-accent hover:underline">Sign up</Link></p>
        </div>
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Demo Login Tips:</p>
          <p className="mt-1">Admin: <code className="bg-gray-100 px-1 rounded">admin@velocity.com</code></p>
          <p className="mt-1">Customer: <code className="bg-gray-100 px-1 rounded">john@example.com</code></p>
        </div>
      </div>
    </div>
  );
};

const SignupPage = () => {
  const { signup, auth } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '' // Note: In a real app, handle password securely. Mock doesn't store it for simplicity or hash it.
  });

  if (auth.isAuthenticated) return <Navigate to="/dashboard" />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: UserRole.CUSTOMER
    };
    signup(newUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <CreditCard className="mx-auto h-12 w-12 text-accent" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-gray-600">Join Velocity Rentals today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
            Sign Up
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Already have an account? <Link to="/login" className="text-accent hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

const VehicleList = () => {
  const { vehicles, auth, addBooking } = useAppContext();
  const [filter, setFilter] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const filteredVehicles = filter === 'all'
    ? vehicles
    : vehicles.filter(v => v.type === filter);

  const handleBook = (vehicle: Vehicle) => {
    if (!auth.isAuthenticated) {
      alert("Please login to book a vehicle");
      return;
    }
    setSelectedVehicle(vehicle);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Fleet</h1>
        <div className="mt-4 md:mt-0 flex gap-2 overflow-x-auto pb-2">
          {['all', 'car', 'SUV', 'bike', 'van'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${filter === type ? 'bg-accent text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
            <div className="relative h-48">
              <img src={vehicle.image_url} alt={vehicle.vehicle_name} className="w-full h-full object-cover" />
              <div className={`absolute top-4 right-4 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${vehicle.availability_status === VehicleStatus.AVAILABLE ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {vehicle.availability_status}
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{vehicle.vehicle_name}</h3>
                  <p className="text-sm text-gray-500">{vehicle.registration_number}</p>
                </div>
                <span className="text-lg font-bold text-accent">${vehicle.daily_rent_price}<span className="text-sm text-gray-500 font-normal">/day</span></span>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{vehicle.description}</p>
              <button
                onClick={() => handleBook(vehicle)}
                disabled={vehicle.availability_status !== VehicleStatus.AVAILABLE}
                className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {vehicle.availability_status === VehicleStatus.AVAILABLE ? 'Book Now' : 'Currently Unavailable'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedVehicle && auth.user && (
        <BookingModal
          vehicle={selectedVehicle}
          user={auth.user}
          onClose={() => setSelectedVehicle(null)}
          onConfirm={(booking) => {
            addBooking(booking);
            setSelectedVehicle(null);
            alert("Booking Confirmed!");
          }}
        />
      )}
    </div>
  );
};

const BookingModal = ({ vehicle, user, onClose, onConfirm }: { vehicle: Vehicle, user: User, onClose: () => void, onConfirm: (b: Booking) => void }) => {
  const [startDate, setStartDate] = useState('');
  const [days, setDays] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate) return;

    const start = new Date(startDate);
    const end = new Date(start.getTime() + days * 86400000);

    const booking: Booking = {
      id: `b-${Date.now()}`,
      customer_id: user.id,
      vehicle_id: vehicle.id,
      vehicle_name: vehicle.vehicle_name,
      rent_start_date: start.toISOString(),
      rent_end_date: end.toISOString(),
      total_price: days * vehicle.daily_rent_price,
      status: BookingStatus.ACTIVE
    };
    onConfirm(booking);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Book {vehicle.vehicle_name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (Days)</label>
            <input
              type="number"
              min="1"
              max="30"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={days}
              onChange={e => setDays(parseInt(e.target.value))}
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between text-sm mb-2">
              <span>Daily Rate:</span>
              <span>${vehicle.daily_rent_price}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${days * vehicle.daily_rent_price}</span>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-accent text-white rounded-md hover:bg-blue-600">Confirm Booking</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const { auth, bookings, vehicles, updateBookingStatus, deleteVehicle } = useAppContext();

  if (!auth.isAuthenticated || !auth.user) return <Navigate to="/login" />;

  const isUser = auth.user.role === UserRole.CUSTOMER;
  const isAdmin = auth.user.role === UserRole.ADMIN;

  const userBookings = isAdmin ? bookings : bookings.filter(b => b.customer_id === auth.user?.id);

  // Stats for Admin
  const totalRevenue = bookings.reduce((sum, b) => b.status !== BookingStatus.CANCELLED ? sum + b.total_price : sum, 0);
  const activeBookingsCount = bookings.filter(b => b.status === BookingStatus.ACTIVE).length;

  const vehicleStats = [
    { name: 'Available', value: vehicles.filter(v => v.availability_status === VehicleStatus.AVAILABLE).length },
    { name: 'Booked', value: vehicles.filter(v => v.availability_status === VehicleStatus.BOOKED).length },
  ];
  const COLORS = ['#10b981', '#ef4444'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Manage your rental activities</p>
      </div>

      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Active Rentals</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{activeBookingsCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium uppercase">Fleet Status</h3>
              <p className="text-sm text-gray-400 mt-1">{vehicles.length} Total Vehicles</p>
            </div>
            <div className="h-16 w-16">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={vehicleStats} innerRadius={15} outerRadius={30} paddingAngle={5} dataKey="value">
                    {vehicleStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">{isAdmin ? 'All System Bookings' : 'My Bookings'}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{booking.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.vehicle_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(booking.rent_start_date).toLocaleDateString()} - {new Date(booking.rent_end_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">${booking.total_price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${booking.status === BookingStatus.ACTIVE ? 'bg-green-100 text-green-800' :
                        booking.status === BookingStatus.RETURNED ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {isAdmin && booking.status === BookingStatus.ACTIVE && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, BookingStatus.RETURNED)}
                        className="text-accent hover:text-blue-900 mr-4"
                      >
                        Mark Returned
                      </button>
                    )}
                    {((isUser && booking.status === BookingStatus.ACTIVE) || isAdmin) && booking.status === BookingStatus.ACTIVE && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, BookingStatus.CANCELLED)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {userBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAdmin && (
        <div className="mt-10 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Vehicle Inventory Management</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {vehicles.map(v => (
              <li key={v.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <img src={v.image_url} className="h-10 w-10 rounded object-cover" alt="" />
                  <div>
                    <p className="font-medium text-gray-900">{v.vehicle_name}</p>
                    <p className="text-xs text-gray-500">Reg: {v.registration_number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-2 py-1 rounded ${v.availability_status === VehicleStatus.AVAILABLE ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                    {v.availability_status}
                  </span>
                  <button onClick={() => deleteVehicle(v.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// --- App Container ---

const AppProvider = ({ children }: { children?: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({ user: null, isAuthenticated: false });
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  // Keep track of registered users in state for demo purposes
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(MOCK_USERS);

  const login = (email: string) => {
    // Mock Login Logic
    const user = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setAuth({ user, isAuthenticated: true });
    } else {
      alert("User not found. Try 'admin@velocity.com' or 'john@example.com'");
    }
  };

  const signup = (user: User) => {
    setRegisteredUsers(prev => [...prev, user]);
    setAuth({ user, isAuthenticated: true });
    alert("Account created successfully!");
  };

  const logout = () => {
    setAuth({ user: null, isAuthenticated: false });
  };

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
    // Update vehicle status
    setVehicles(prev => prev.map(v => v.id === booking.vehicle_id ? { ...v, availability_status: VehicleStatus.BOOKED } : v));
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));

    // If returned or cancelled, free up the vehicle
    if (status === BookingStatus.RETURNED || status === BookingStatus.CANCELLED) {
      const booking = bookings.find(b => b.id === id);
      if (booking) {
        setVehicles(prev => prev.map(v => v.id === booking.vehicle_id ? { ...v, availability_status: VehicleStatus.AVAILABLE } : v));
      }
    }
  };

  const deleteVehicle = (id: string) => {
    // Check for active bookings
    const hasActive = bookings.some(b => b.vehicle_id === id && b.status === BookingStatus.ACTIVE);
    if (hasActive) {
      alert("Cannot delete vehicle with active bookings.");
      return;
    }
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  return (
    <AppContext.Provider value={{ auth, login, signup, logout, vehicles, bookings, addBooking, updateBookingStatus, deleteVehicle }}>
      {children}
    </AppContext.Provider>
  );

};

export default function App() {
  return (
    <Router>
      <AppProvider>
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/vehicles" element={<VehicleList />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

        </div>
      </AppProvider>
    </Router>
  );
}