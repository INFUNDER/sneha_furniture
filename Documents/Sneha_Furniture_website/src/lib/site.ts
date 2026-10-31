// Single source of truth for business details shown across the site.
export const SITE_URL = 'https://snehafurniture.in';
export const BRAND_NAME = 'Sneha Furniture';

export const CONTACT_EMAIL = 'snehafurnituresddn@gmail.com';
export const PHONES = [
  { display: '+91 87555 94915', tel: '+918755594915' },
  { display: '+91 96343 12102', tel: '+919634312102' },
];
export const WHATSAPP_NUMBER = '918755594915';

export const ADDRESS = {
  street: '7, Saharanpur Rd, Patel Nagar',
  city: 'Dehradun',
  state: 'Uttarakhand',
  pincode: '248001',
};

// Consumer Protection (E-Commerce) Rules, 2020 require a named Grievance Officer with designation.
// TODO(owner): fill in the officer's name and designation.
export const GRIEVANCE_OFFICER = {
  name: '',
  designation: '',
  email: CONTACT_EMAIL,
  phone: PHONES[0].display,
};

export const SOCIAL = {
  instagram: 'https://www.instagram.com/snehafurniture.in',
  facebook: 'https://www.facebook.com/share/1Hd1tiWFCt/',
};

export const PRODUCT_CATEGORIES = ['Sofa', 'Living Room', 'Bedroom', 'Dining', 'Office', 'Outdoor'];

// Online payments stay hidden until Razorpay is configured and tested end to end.
export const ONLINE_PAYMENTS_ENABLED = process.env.NEXT_PUBLIC_ONLINE_PAYMENTS_ENABLED === 'true';

// Only allow same-site relative paths as post-login redirects.
export function safeRedirectPath(path: string | null | undefined, fallback = '/profile') {
  if (!path || !path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) return fallback;
  return path;
}
