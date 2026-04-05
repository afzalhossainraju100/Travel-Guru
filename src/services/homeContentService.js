import Sajek from "../assets/images/Sajek.png";
import Sreemongol from "../assets/images/Sreemongol.png";
import Sundorbon from "../assets/images/sundorbon.png";

const destinations = [
  { id: 1, name: "COX'S BAZAR", image: Sajek },
  { id: 2, name: "SREEMANGAL", image: Sreemongol },
  { id: 3, name: "SUNDARBANS", image: Sundorbon },
];

const faqs = [
  {
    id: 1,
    question: "How do I book a tour package?",
    answer:
      "Open any package details page, click Book Now, choose traveler count in Ledger, then complete payment to save it in your Booking List.",
  },
  {
    id: 2,
    question: "Can I save a place for later without booking?",
    answer:
      "Yes. Use the Wish button in package details to add it to your Wish List for future travel planning.",
  },
  {
    id: 3,
    question: "Can I remove bookings and wishlist items later?",
    answer:
      "Yes. Both Booking List and Wish List cards include delete actions so you can manage your saved tours anytime.",
  },
  {
    id: 4,
    question: "Do I need to login before booking?",
    answer:
      "Yes. Booking, wishlist, payment, and profile features are protected and available after you sign in.",
  },
];

export const getHomeDestinations = () => {
  return destinations;
};

export const getHomeFaqs = () => {
  return faqs;
};
