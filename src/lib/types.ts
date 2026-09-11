import seed from "@/db/seed-data.json";

export type Trail = {
  id: number;
  slug: string;
  name: string;
  area: string;
  summary: string;
  description: string;
  lengthMiles: string;
  difficulty: string;
  surface: string;
  elevationFt: number;
  accessPoint: string;
  condition: "open" | "caution" | "closed";
  conditionNote: string | null;
  lastCheckedAt: string | null;
  facilities: string[];
  hasParking: boolean;
  trailerParking: boolean;
  hasWater: boolean;
  shade: boolean;
  mapCoords: [number, number][];
  photoAlt: string;
  orderIndex: number;
};

export type TrailReport = {
  id: number;
  trailSlug: string;
  trailName: string;
  reporterName: string;
  reporterEmail: string;
  condition: "open" | "caution" | "closed";
  note: string;
  riddenOn: string | null;
  status: "pending" | "approved" | "rejected";
  moderationNote: string | null;
  createdAt: string;
};

export type Listing = {
  id: number;
  slug: string;
  name: string;
  category: string;
  region: string;
  description: string;
  services: string[];
  phone: string | null;
  email: string | null;
  website: string | null;
  city: string;
  memberLevel: string;
  memberSince: string | null;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
};

export type CeaEvent = {
  id: number;
  slug: string;
  title: string;
  dateLabel: string;
  dayNum: string;
  monthShort: string;
  year: string;
  timeLabel: string;
  location: string;
  category: string;
  summary: string;
  cost: string | null;
  imageAlt: string;
  sortDate: string;
};

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  category: string;
  dateLabel: string;
  sortDate: string;
  readingMinutes: number;
};

export type Resource = {
  id: number;
  title: string;
  description: string;
  category: string;
  fileType: string;
  fileSize: string;
  href: string;
  updatedAt: string;
  audience: string;
};

export type MembershipTier = {
  id: number;
  slug: string;
  name: string;
  price: number;
  cadence: string;
  blurb: string;
  benefits: string[];
  featured: boolean;
  orderIndex: number;
};

export const seedTrails = seed.trails as unknown as Trail[];
export const seedTrailReports = seed.trailReports as unknown as TrailReport[];
export const seedListings = seed.listings as unknown as Listing[];
export const seedEvents = seed.events as unknown as CeaEvent[];
export const seedPosts = seed.posts as unknown as Post[];
export const seedResources = seed.resources as unknown as Resource[];
export const seedTiers = seed.membershipTiers as unknown as MembershipTier[];

export const CONDITION_LABEL: Record<string, string> = {
  open: "Open",
  caution: "Ride with care",
  closed: "Closed",
};

export const ROLES = ["visitor", "rider", "business", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABEL: Record<Role, string> = {
  visitor: "Visitor",
  rider: "Registered Rider",
  business: "Business Owner",
  admin: "CEA Admin",
};
