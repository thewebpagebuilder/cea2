export type NavChild = { label: string; href: string; description: string };

export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export const mainNav: NavItem[] = [
  {
    label: "Trails",
    href: "/trails",
    children: [
      {
        label: "Interactive Trail Guide",
        href: "/trails",
        description: "Filterable map of every rideable route in Bidwell Park",
      },
      {
        label: "Trail Conditions Board",
        href: "/trails/conditions",
        description: "Rider-submitted reports, moderated by CEA volunteers",
      },
      {
        label: "Safety & Etiquette",
        href: "/safety",
        description: "Passing protocol, water crossings, and trail courtesy",
      },
      {
        label: "Report a Condition",
        href: "/trails/conditions#report",
        description: "Tell other riders what you found out there",
      },
    ],
  },
  {
    label: "Directory",
    href: "/directory",
    children: [
      {
        label: "Business & Member Directory",
        href: "/directory",
        description: "Farriers, vets, feed, boarding, and instruction",
      },
      {
        label: "Submit a Listing",
        href: "/directory/submit",
        description: "Apply for a listing as a CEA business member",
      },
      {
        label: "Business Membership",
        href: "/membership#business",
        description: "What business members get for $150 a year",
      },
    ],
  },
  {
    label: "Membership",
    href: "/membership",
    children: [
      {
        label: "Join or Renew",
        href: "/membership",
        description: "Individual, Family, Business, and Lifetime options",
      },
      {
        label: "Volunteer & Get Involved",
        href: "/get-involved",
        description: "Trail crews, events, committees, and the board",
      },
      {
        label: "Scholarship",
        href: "/resources#scholarship",
        description: "The Mike Mathis Scholarship for ag students",
      },
    ],
  },
  {
    label: "About",
    href: "/about",
    children: [
      {
        label: "Our Story",
        href: "/about",
        description: "Keeping Annie Bidwell's dream alive since 1947",
      },
      {
        label: "Board & Volunteers",
        href: "/about/board",
        description: "The people who keep the lights on at the arena",
      },
      {
        label: "Sponsors & Partners",
        href: "/sponsors",
        description: "Businesses that underwrite CEA programming",
      },
      {
        label: "Contact",
        href: "/contact",
        description: "Mail, phone, and where to find the arena",
      },
    ],
  },
  { label: "Events", href: "/events" },
  { label: "News", href: "/news" },
  { label: "Resources", href: "/resources" },
];

export const utilityNav = [
  { label: "Trail status line", href: "tel:+15308967899", meta: "530-896-7899" },
  { label: "Arena Way gate", href: "tel:+15308967800", meta: "530-896-7800" },
];

export const site = {
  name: "Chico Equestrian Association",
  shortName: "CEA",
  tagline: "Keeping horses in Bidwell Park since 1947",
  address: "CEA Arena, Upper Bidwell Park, Chico, CA",
  email: "info@chicoequestrianassociation.org",
  phone: "(530) 519-3803",
  phoneHref: "tel:+15305193803",
  trailLine: "(530) 896-7899",
  trailLineHref: "tel:+15308967899",
  gateLine: "(530) 896-7800",
  gateLineHref: "tel:+15308967800",
  citySite: "https://www.chico.ca.us",
};
