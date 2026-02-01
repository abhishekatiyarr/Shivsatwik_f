export interface Homestay {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  checkInTime: string;
  checkOutTime: string;
  createdAt: string;
  unitTypes: UnitType[];
}

export interface UnitType {
  id: number;
  homestayId: number;
  type: string;
  title: string;
  description: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  basePricePerNight: number;
  totalUnits: number;
}
