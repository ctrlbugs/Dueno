export const all_routes = {
  //Auth routes
  signup:'/signup',
  signin:'/signin',
  forgotPassword:'/forgot-password',
  resetPassword:'/reset-password',
 
 

  //Home routes
  index: "/index",
  index2: "/index-2",
  index3: "/home",

  //Listing routes
  buyProperty:'/buy-property',
  buyPropertyGrid:'/buy-property',
  buyPropertyList:'/buy-property-list',
  buyPropertyMap:'/buy-property-map',
  buyPropertyGridSidebar:'/buy-property-grid-sidebar',
  buyPropertyListSidebar:'/buy-property-list-sidebar',
  buyGridMap:'/buy-grid-map',
  buyListMap:'/buy-list-map',
  buyDetails:'/buy-details/:propertySlug',
  buyDetailsLegacy:'/buy-details',
  rentProperty:'/rent-property',
  rentPropertyGrid:'/rent-property',
  rentPropertyList:'/rent-property-list',
  rentGridMap:'/rent-grid-map',
  rentListMap:'/rent-list-map',
  rentPropertyGridSidebar:'/rent-property-grid-sidebar',
  rentPropertyListSidebar:'/rent-property-list-sidebar',
  rentDetails:'/rent-details/:propertySlug',
  rentDetailsLegacy:'/rent-details',
  rentBooking:'/rent-booking',
  rentalOrderDetails:'/rental-order-details',
  rentalOrderConfirmation:'/rental-order-confirmation',
  rentalPayment:'/rental-payment',

  //Agent routes
  agentGrid:'/agent-grid',
  agentList:'/agent-list',
  agentGridSidebar:'/agent-grid-sidebar',
  agentListSidebar:'/agent-list-sidebar',
  agentDetails:'/agent-details',
  duenoAgentProfile:'/dueno-agent/:agentId',
  
  //Agency routes
  agencyGrid:'/agency-grid',
  agencyList:'/agency-list',
  agencyGridSidebar:'/agency-grid-sidebar',
  agencyListSidebar:'/agency-list-sidebar',
  agencyDetails:'/agency-details',

  //Pages routes
  aboutUs:'/about-us',
   invoiceDetails:'/invoice-details',
  contactUs:'/contact-us',
  services:'/services',
  serviceDetail:'/services/:serviceSlug',
  error404:'/error-404',
  error500:'/error-500',
  pricing:'/pricing',
  faq:'/faq',
  gallery:'/gallery',
  ourTeam:'/our-team',
  testimonial:'/testimonial',
  termsCondition:'/terms-condition',
  privacyPolicy:'/privacy-policy',
  maintenance:'/maintenance',
  comingSoon:'/coming-soon',
  cart:'/cart',
  notification:'/notification',
  addpropertybuy:'/add-property-buy',
  agentDashboard:'/agent/dashboard',
  agentListings:'/agent/listings',
  agentNewListing:'/agent/listings/new',
  agentPendingReview:'/agent/pending-review',
  wishlist:'/wishlist',
  buyDetailsSchedule:'/buy-details-schedule',
  checkout:'/checkout',

  //Blogs routes
  blogList:'/blog-list',
  blogGrid:'/blog-grid',
  blogDetails:'/blog-details',
  blogDetailsArticle:'/blog-details/:articleId',

};
