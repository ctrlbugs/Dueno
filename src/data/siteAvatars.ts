/** Customer avatar paths used across homepage trust badges and testimonials. */
export const CUSTOMER_AVATAR_STACK = [
  "assets/img/users/user-01.jpg",
  "assets/img/users/user-02.jpg",
  "assets/img/users/user-03.jpg",
  "assets/img/users/user-04.jpg",
] as const;

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  quote: string;
  avatar: string;
  rating: number;
};

export const SUCCESS_STORY_TESTIMONIALS: Testimonial[] = [
  {
    id: "chioma-okafor",
    name: "Chioma Okafor",
    location: "Lagos",
    quote:
      "Dueno made finding my apartment in Lekki incredibly easy. The listings were verified, the process was transparent, and I found exactly what I was looking for within days.",
    avatar: "assets/img/users/user-01.jpg",
    rating: 3,
  },
  {
    id: "amina-bello",
    name: "Amina Bello",
    location: "Abuja",
    quote:
      "As a first-time homebuyer, I had many questions. The Dueno team guided me through every step and connected me with trusted professionals. It was a smooth experience from start to finish.",
    avatar: "assets/img/users/user-03.jpg",
    rating: 4,
  },
  {
    id: "yetunde-adebayo",
    name: "Yetunde Adebayo",
    location: "Ibadan",
    quote:
      "I listed my property on Dueno and started receiving genuine inquiries almost immediately. The platform is simple, professional, and effective.",
    avatar: "assets/img/users/user-05.jpg",
    rating: 4,
  },
  {
    id: "chinedu-eze",
    name: "Chinedu Eze",
    location: "Port Harcourt",
    quote:
      "I've used several property platforms, but Dueno stands out because of the quality of listings and customer support. I successfully secured an investment property through the platform.",
    avatar: "assets/img/users/user-06.jpg",
    rating: 5,
  },
  {
    id: "emmanuel-adewale",
    name: "Emmanuel Adewale",
    location: "Lagos",
    quote:
      "Dueno helped me find office space for my growing business. The search filters and property details saved me a lot of time and effort.",
    avatar: "assets/img/users/user-02.jpg",
    rating: 5,
  },
  {
    id: "ibrahim-musa",
    name: "Ibrahim Musa",
    location: "Abuja",
    quote:
      "The professionalism and transparency on Dueno gave me confidence throughout the property search process. I would highly recommend it to anyone looking to buy or rent property in Nigeria.",
    avatar: "assets/img/users/user-08.jpg",
    rating: 5,
  },
];

export const SUCCESS_STORY_CARDS_PER_SLIDE = 4;

export const chunkSuccessStoryTestimonials = (
  testimonials: Testimonial[],
  size = SUCCESS_STORY_CARDS_PER_SLIDE,
) => {
  const slides: Testimonial[][] = [];

  for (let index = 0; index < testimonials.length; index += size) {
    slides.push(testimonials.slice(index, index + size));
  }

  return slides;
};
