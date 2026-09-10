import { MapLocation } from '../../types/browser';

/**
 * Fictional Northbridge geography used by Case 27.
 *
 * Coordinates are authored in the same 0-100 city grid used by OmniMaps.
 * They are intentionally independent from real-world addresses: the map is a
 * visual city basemap, while this layer keeps the fictional investigation
 * geographically consistent.
 */
export const CASE_27_MAP_LOCATIONS: MapLocation[] = [
  {
    id: 'loc_anna_home',
    name: 'Anna Bell Residence',
    category: 'Residential',
    address: '42 Willow Street',
    district: 'Willow / 4th District',
    x: 48,
    y: 50,
    description: 'Anna Bell\'s residence and the primary scene referenced in Case 27.',
    icon: 'Home',
  },
  {
    id: 'loc_bell_electronics',
    name: 'Bell Electronics Components',
    category: 'Commercial',
    address: '104 Waterfront Way',
    district: 'Waterfront Industrial',
    x: 30,
    y: 63,
    description: 'Former semiconductor assembly plant where Anna worked as an auditor.',
    icon: 'Factory',
  },
  {
    id: 'loc_crownline_depot',
    name: 'Crownline Logistics — Harbor Depot',
    category: 'Commercial',
    address: '18 Freight Terminal Road',
    district: 'Waterfront Industrial',
    x: 24,
    y: 68,
    description: 'Freight depot linked to Bell Electronics shipments and the 1989 Internal Affairs investigation.',
    icon: 'Warehouse',
  },
  {
    id: 'loc_canal_storage',
    name: 'Canal Storage Facility',
    category: 'Commercial',
    address: '400 Canal Road',
    district: 'Industrial Canal',
    x: 70,
    y: 77,
    description: 'Self-storage facility containing Locker CS-14, rented by Anna two days before her disappearance.',
    icon: 'Archive',
  },
  {
    id: 'loc_canal_road',
    name: 'Canal Road Culvert',
    category: 'Road',
    address: 'Canal Road / East Culvert',
    district: 'Industrial Canal',
    x: 69,
    y: 78,
    description: 'Recovery location for Anna\'s Ford Taurus, 18 days after the disappearance.',
    icon: 'Car',
  },
  {
    id: 'loc_grand_diner',
    name: 'Grand Avenue Diner',
    category: 'Food',
    address: '612 Grand Avenue',
    district: 'Downtown / Grand Avenue',
    x: 40,
    y: 50,
    description: 'The area where Leo Vance reported seeing Anna drive away at approximately 22:15.',
    icon: 'Utensils',
  },
];

/** Main roads are deliberately sparse: they give the investigation a readable
 * city structure without turning the map into a hand-drawn diagram. */
export const CASE_27_ROADS: Array<{ name: string; points: Array<[number, number]> }> = [
  { name: 'Grand Avenue', points: [[34, 42], [40, 50], [48, 56], [61, 62], [78, 65]] },
  { name: 'Willow Street', points: [[48, 32], [48, 42], [48, 50], [49, 59], [51, 70]] },
  { name: '4th Avenue', points: [[28, 42], [40, 42], [48, 42], [61, 43], [76, 44]] },
  { name: 'Waterfront Way', points: [[16, 63], [24, 63], [30, 63], [40, 64], [54, 65], [69, 66]] },
  { name: 'Freight Terminal Road', points: [[18, 72], [24, 68], [30, 63], [36, 58]] },
  { name: 'Canal Road', points: [[58, 72], [64, 75], [69, 78], [70, 84], [76, 90]] },
  { name: 'Lower Shore Parkway', points: [[69, 58], [78, 61], [86, 65], [94, 70]] },
];

export const CASE_27_DISTANCE_NOTES = {
  bellToWillow: 'approximately 1.8 mi by road',
  willowToCanalStorage: 'approximately 1.9 mi by road',
  canalStorageToVehicleRecovery: 'approximately 200 yd',
  bellToCrownline: 'approximately 0.6 mi by road',
};
