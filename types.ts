export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
}

export enum VehicleType {
  CAR = 'car',
  BIKE = 'bike',
  VAN = 'van',
  SUV = 'SUV'
}

export enum VehicleStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked'
}

export interface Vehicle {
  id: string;
  vehicle_name: string;
  type: VehicleType;
  registration_number: string;
  daily_rent_price: number;
  availability_status: VehicleStatus;
  image_url: string;
  description: string;
}

export enum BookingStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  RETURNED = 'returned'
}

export interface Booking {
  id: string;
  customer_id: string;
  vehicle_id: string;
  vehicle_name: string; // Denormalized for easier UI
  rent_start_date: string;
  rent_end_date: string;
  total_price: number;
  status: BookingStatus;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}