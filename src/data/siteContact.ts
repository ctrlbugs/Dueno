/** Contact form side image — upload to public/assets/img/contact-us/ */
export const CONTACT_FORM_IMAGE = "assets/img/contact-us/contact-us-img-02.jpg";

export const SITE_CONTACT = {
  name: "Dueno Property",
  teamName: "Dueno Property",
  email: "contact@duenoproperty.com",
  phone: "+234 800 000 0000",
  phoneTel: "+2348000000000",
  whatsappUrl: "https://wa.me/2348000000000",
  address: "Asokoro District Abuja, Diplomatic Zone, Abuja",
  location: {
    label: "Location",
    lines: ["Asokoro District Abuja", "Diplomatic Zone, Abuja"],
    mapQuery: "Asokoro District, Abuja, Nigeria",
  },
} as const;

/** Shared company contact defaults for listings and enquiry forms */
export const DUENO_CONTACT = SITE_CONTACT;

export const getSiteContactMapEmbedUrl = () =>
  `https://maps.google.com/maps?q=${encodeURIComponent(
    SITE_CONTACT.location.mapQuery,
  )}&hl=en&z=14&output=embed`;
