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
};

export const SUCCESS_STORY_TESTIMONIALS: Testimonial[] = [
  {
    id: "lily-brooks",
    name: "Lily Brooks",
    location: "South Africa",
    quote:
      "Booking our dream home was incredibly easy with Dueno. The interface was user-friendly.",
    avatar: "assets/img/users/user-01.jpg",
  },
  {
    id: "ethan-wells",
    name: "Ethan Wells",
    location: "United Kingdom",
    quote:
      "Booking our dream home was so simple with Dueno. The site was easy to use!",
    avatar: "assets/img/users/user-06.jpg",
  },
  {
    id: "daniel-cooper",
    name: "Daniel Cooper",
    location: "United States of America",
    quote: "Dueno made home booking a breeze. Super easy and stress-free!",
    avatar: "assets/img/users/user-04.jpg",
  },
  {
    id: "emma-davidson",
    name: "Emma Davidson",
    location: "Japan",
    quote:
      "Dueno made booking our dream home effortless. The interface was so easy to navigate!",
    avatar: "assets/img/users/user-07.jpg",
  },
];
