export type RequestLanguage = "ar" | "de" | "en";

export type SearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

export type RequestCustomer = {
  requestId?: string;
  requestLanguage?: RequestLanguage;
  fullName?: string;
  email?: string;
  phone?: string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  subject?: string;
  message?: string;
};

export type LegacyRequestCustomer = {
  requestId?: string;
  requestLanguage?: RequestLanguage | string;
  fullName?: string;
  email?: string;
  phone?: string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  subject?: string;
  message?: string;
};

export type RequestStatus = "new" | "in_progress" | "done";

export type AppointmentStatus =
  | "new"
  | "confirmed"
  | "in_progress"
  | "done"
  | "cancelled"
  | "rejected";

export type AdminEntryStatus = RequestStatus | AppointmentStatus;

export type AppointmentType =
  | "consultation"
  | "design"
  | "visit"
  | "installation";

export type AppointmentMode =
  | "at_store"
  | "we_come_free"
  | "phone_call";

export type AdminEntrySource = "request" | "appointment";

export type BookingSlotStatus =
  | "available"
  | "booked"
  | "blocked";

export type AdminOfficeId =
  | "requests_new"
  | "requests_in_progress"
  | "requests_done"
  | "appointments_new"
  | "appointments_in_progress"
  | "appointments_done"
  | "appointments_cancelled"
  | "appointments_rejected"
  | "schedule_settings"
  | "request_actions"
  | "customer_data";

export type MainOfficeId = "requests" | "appointments" | "data";

export type RequestRow = {
  id: string;
  status: RequestStatus;
  channel: string;
  created_at?: string;
  customer?: RequestCustomer;
};

export type RawRequestRow = {
  id?: string;
  status?: string;
  channel?: string;
  created_at?: string;
  customer?: LegacyRequestCustomer | null;
  customerData?: LegacyRequestCustomer | null;
  fullName?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  street?: string | null;
  houseNumber?: string | null;
  house_number?: string | null;
  postalCode?: string | null;
  postal_code?: string | null;
  city?: string | null;
  subject?: string | null;
  message?: string | null;
  requestId?: string | null;
  request_id?: string | null;
  requestLanguage?: string | null;
  request_language?: string | null;
};

export type AppointmentCustomer = {
  requestId: string;
  requestLanguage?: RequestLanguage;
  fullName?: string;
  email?: string;
  phone?: string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  subject?: string;
  message?: string;
};

export type AppointmentRow = {
  id: string;
  status: AppointmentStatus;
  channel: string;
  created_at?: string;
  date?: string;
  time?: string;
  type?: AppointmentType;
  mode?: AppointmentMode;
  customer?: AppointmentCustomer;
};

export type RawAppointmentRow = {
  id?: string;
  status?: string;
  created_at?: string;
  date?: string | null;
  time?: string | null;
  type?: string | null;
  mode?: string | null;
  fullName?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  street?: string | null;
  houseNumber?: string | null;
  house_number?: string | null;
  postalCode?: string | null;
  postal_code?: string | null;
  city?: string | null;
  notes?: string | null;
  language?: string | null;
};

export type AdminEntry = {
  id: string;
  source: AdminEntrySource;
  status: AdminEntryStatus;
  channel: string;
  created_at?: string;
  customer: RequestCustomer;
  appointment?: {
    date?: string;
    time?: string;
    type?: AppointmentType;
    mode?: AppointmentMode;
  };
};

export type AvailableBookingDay = {
  id: string;
  date: string;
  note?: string;
  created_at?: string;
};

export type RawAvailableBookingDay = {
  id?: string;
  date?: string | null;
  note?: string | null;
  created_at?: string | null;
};

export type BookingSlot = {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: BookingSlotStatus;
  note?: string;
  created_at?: string;
};

export type RawBookingSlot = {
  id?: string;
  booking_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  status?: string | null;
  note?: string | null;
  created_at?: string | null;
};

export type CustomerRow = {
  id: string;
  customer_id?: string;
  customer_code?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  street?: string;
  house_number?: string;
  postal_code?: string;
  city?: string;
  created_at?: string;
};

export type RawCustomerRow = {
  id?: string;
  customer_id?: string | null;
  customerId?: string | null;
  customer_code?: string | null;
  customerCode?: string | null;
  first_name?: string | null;
  firstName?: string | null;
  last_name?: string | null;
  lastName?: string | null;
  full_name?: string | null;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  street?: string | null;
  house_number?: string | null;
  houseNumber?: string | null;
  postal_code?: string | null;
  postalCode?: string | null;
  city?: string | null;
  created_at?: string | null;
};

export type CustomerDataRow = {
  index: number;
  id: string;
  customerNumber: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address: string;
};

export type OfficeDefinition = {
  id: AdminOfficeId;
  label: Record<RequestLanguage, string>;
};

export type MainOfficeDefinition = {
  id: MainOfficeId;
  label: Record<RequestLanguage, string>;
  description: Record<RequestLanguage, string>;
};

export type AdminAlertTone = "red" | "blue" | "green" | "purple" | "yellow";

export type AdminAlertItem = {
  id: string;
  label: string;
  value: number;
  tone: AdminAlertTone;
};