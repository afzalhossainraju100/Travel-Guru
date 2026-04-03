import React, { useRef } from "react";
import HomeBg from "../../assets/images/Rectangle1.png";
import Sajek from "../../assets/images/Sajek.png";
import Sreemongol from "../../assets/images/Sreemongol.png";
import Sundorbon from "../../assets/images/sundorbon.png";

const Home = () => {
  const cardRowRef = useRef(null);

  const destinations = [
    { id: 1, name: "COX'S BAZAR", image: Sajek },
    { id: 2, name: "SREEMANGAL", image: Sreemongol },
    { id: 3, name: "SUNDARBANS", image: Sundorbon },
  ];

  const scrollCards = (direction) => {
    if (!cardRowRef.current) return;

    cardRowRef.current.scrollBy({
      left: direction === "next" ? 320 : -320,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center"
      style={{ backgroundImage: `url(${HomeBg})` }}
    >
      <div className="flex w-full items-start justify-between gap-8 px-4 md:px-8 lg:px-12">
        <div className="w-[90%] md:w-[80%] lg:w-[70%] mx-auto text-white bg-black/45 backdrop-blur-[1px] rounded-2xl p-6 md:p-10 shadow-2xl border border-white/20">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-wide drop-shadow-lg">
            Enjoy Your Vacations With <br></br>Travel Guru
          </h1>
          <button className="bg-[#F9A51A] hover:bg-yellow-500 text-[#000000] font-bold py-2 px-6 rounded mt-4 flex items-center gap-2">
            Get Started →
          </button>
        </div>
        <div className="w-full lg:w-[56%]">
          <div
            ref={cardRowRef}
            className="flex gap-4 overflow-x-auto pb-3 pr-2 scroll-smooth"
          >
            {destinations.map((destination, index) => (
              <div
                key={destination.id}
                className={`relative h-82.5 w-45 md:w-52.5 lg:w-57.5 shrink-0 overflow-hidden rounded-3xl border-2 shadow-2xl cursor-pointer transition-all duration-300 hover:border-[#F9A51A] ${
                  index === 0 ? "" : "border-transparent"
                }`}
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <h3 className="absolute bottom-4 left-4 right-4 text-white bebas-neue-regular text-2xl tracking-wide drop-shadow-lg">
                  {destination.name}
                </h3>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-3 lg:justify-start">
            <button
              onClick={() => scrollCards("prev")}
              className="grid h-8 w-8 place-items-center rounded-full bg-white text-black shadow-md transition hover:bg-gray-200"
              aria-label="Scroll left"
            >
              ❮
            </button>
            <button
              onClick={() => scrollCards("next")}
              className="grid h-8 w-8 place-items-center rounded-full bg-white text-black shadow-md transition hover:bg-gray-200"
              aria-label="Scroll right"
            >
              ❯
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
