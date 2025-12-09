import { User, UserRole, Vehicle, VehicleType, VehicleStatus, Booking, BookingStatus } from '../types';
import mercedesImg from './assets/mercedes.jpg';

// Initial Mock Data
export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Admin User',
    email: 'admin@velocity.com',
    role: UserRole.ADMIN,
    phone: '555-0100'
  },
  {
    id: 'u2',
    name: 'John Doe',
    email: 'john@example.com',
    role: UserRole.CUSTOMER,
    phone: '555-0101'
  }
];

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 'v1',
    vehicle_name: 'Tesla Model 3',
    type: VehicleType.CAR,
    registration_number: 'EV-2024-01',
    daily_rent_price: 120,
    availability_status: VehicleStatus.AVAILABLE,
    image_url: 'https://picsum.photos/id/111/400/300',
    description: 'Electric performance with minimalist interior.'
  },
  {
    id: 'v2',
    vehicle_name: 'Ford Mustang GT',
    type: VehicleType.CAR,
    registration_number: 'US-MUS-88',
    daily_rent_price: 150,
    availability_status: VehicleStatus.AVAILABLE,
    image_url: 'https://picsum.photos/id/133/400/300',
    description: 'American muscle car with raw power.'
  },
  {
    id: 'v3',
    vehicle_name: 'Harley Davidson',
    type: VehicleType.BIKE,
    registration_number: 'HD-CYCLE-99',
    daily_rent_price: 80,
    availability_status: VehicleStatus.AVAILABLE,
    image_url: 'https://picsum.photos/id/146/400/300',
    description: 'Classic cruiser for the open road.'
  },
  {
    id: 'v4',
    vehicle_name: 'Range Rover Sport',
    type: VehicleType.SUV,
    registration_number: 'UK-SUV-44',
    daily_rent_price: 200,
    availability_status: VehicleStatus.BOOKED,
    image_url: 'https://picsum.photos/id/183/400/300',
    description: 'Luxury SUV with off-road capability.'
  },
  {
    id: 'v5',
    vehicle_name: 'Mercedes Sprinter',
    type: VehicleType.VAN,
    registration_number: 'DE-VAN-22',
    daily_rent_price: 100,
    availability_status: VehicleStatus.AVAILABLE,
    image_url: mercedesImg,
    description: 'Spacious van for group travel or cargo.'
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    customer_id: 'u2',
    vehicle_id: 'v4',
    vehicle_name: 'Range Rover Sport',
    rent_start_date: new Date().toISOString(),
    rent_end_date: new Date(Date.now() + 86400000 * 3).toISOString(),
    total_price: 600,
    status: BookingStatus.ACTIVE
  }
];

// Helper to simulate API delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));