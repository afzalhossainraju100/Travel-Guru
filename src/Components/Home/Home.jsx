import React, { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HomeBg from "../../assets/images/Rectangle1.png";
import Sajek from "../../assets/images/Sajek.png";
import Sreemongol from "../../assets/images/Sreemongol.png";
import Sundorbon from "../../assets/images/sundorbon.png";
import AuthContext from "../../Contextx/AuthContext/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const cardRowRef = useRef(null);

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

  const scrollCards = (direction) => {
    if (!cardRowRef.current) return;

    cardRowRef.current.scrollBy({
      left: direction === "next" ? 320 : -320,
      behavior: "smooth",
    });
  };

  const handleGetStarted = () => {
    if (user) {
      navigate("/packages");
      return;
    }

    navigate("/login", {
      state: { from: { pathname: "/packages" } },
    });
  };

  return (
    <>
      <section
        className="relative min-h-screen bg-cover bg-center bg-no-repeat px-4 py-6 sm:px-6 sm:py-8 lg:px-12"
        style={{ backgroundImage: `url(${HomeBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/55" />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-12">
          <section className="flex w-full flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:gap-12">
            <div className="w-full rounded-3xl border border-white/20 bg-black/45 p-6 text-center text-white shadow-2xl backdrop-blur-md sm:p-8 md:p-10 lg:w-[42%] lg:text-left">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#F9A51A] sm:text-sm">
                Explore Bangladesh
              </p>
              <h1 className="text-3xl font-bold leading-tight tracking-wide drop-shadow-lg sm:text-4xl md:text-5xl lg:text-6xl">
                Enjoy Your Vacations With <br />
                Travel Guru
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/80 sm:text-base lg:mx-0">
                Discover curated destinations, plan quickly, and start your trip
                with a smoother booking experience.
              </p>
              <button
                onClick={handleGetStarted}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#F9A51A] px-6 py-3 font-bold text-black transition duration-300 hover:bg-yellow-500 hover:shadow-lg hover:shadow-[#F9A51A]/20 active:scale-[0.98]"
              >
                Get Started →
              </button>
            </div>

            <div className="w-full lg:w-[58%]">
              <div
                ref={cardRowRef}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pr-1 scroll-smooth sm:gap-5 lg:gap-6"
              >
                {destinations.map((destination, index) => (
                  <div
                    key={destination.id}
                    className={`relative h-[280px] w-[220px] shrink-0 snap-center overflow-hidden rounded-3xl border-2 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#F9A51A] sm:h-[320px] sm:w-[240px] md:h-[350px] md:w-[260px] lg:h-[380px] lg:w-[275px] ${
                      index === 0 ? "" : "border-transparent"
                    }`}
                  >
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <h3 className="absolute bottom-4 left-4 right-4 text-white bebas-neue-regular text-2xl tracking-wide drop-shadow-lg sm:text-3xl">
                      {destination.name}
                    </h3>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-center gap-3 lg:justify-start">
                <button
                  onClick={() => scrollCards("prev")}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-black shadow-md transition hover:bg-white hover:shadow-lg"
                  aria-label="Scroll left"
                >
                  ❮
                </button>
                <button
                  onClick={() => scrollCards("next")}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-black shadow-md transition hover:bg-white hover:shadow-lg"
                  aria-label="Scroll right"
                >
                  ❯
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="bg-linear-to-b from-cyan-50 via-white to-sky-50 px-4 py-12 sm:px-6 lg:px-12">
        <div className="mx-auto w-full max-w-7xl rounded-3xl border border-cyan-100 bg-white p-6 shadow-xl sm:p-8 md:p-10">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700 sm:text-sm">
              Help Center
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-800 sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Find quick answers before you book your next destination.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.id}
                className="group rounded-2xl border border-slate-200 bg-white px-4 py-3 open:border-cyan-300 open:bg-cyan-50/50 sm:px-5"
              >
                <summary className="cursor-pointer list-none pr-8 text-left font-semibold text-slate-800">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
