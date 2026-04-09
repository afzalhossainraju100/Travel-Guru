import SajekImage from "../assets/images/Sajek.png";
import SreemongolImage from "../assets/images/Sreemongol.png";
import SundorbonImage from "../assets/images/sundorbon.png";
import CoxBazarImage from "../assets/images/Coxbazar.jpg";

const locationImage2Map = {
  cox: CoxBazarImage,
  rangamati: SajekImage,
  sajek: SajekImage,
  sundarban: SundorbonImage,
  khulna: SundorbonImage,
  sylhet: SreemongolImage,
  sreemangal: SreemongolImage,
};

const getImage2ByLocation = (location = "") => {
  const normalizedLocation = location.toLowerCase();
  const matchedKey = Object.keys(locationImage2Map).find((key) =>
    normalizedLocation.includes(key),
  );

  return matchedKey ? locationImage2Map[matchedKey] : CoxBazarImage;
};

const normalizePackage = (pkg) => ({
  id: pkg.id,
  title: pkg.title,
  destinationName: pkg.destinationName,
  location: pkg.location,
  image2: pkg.image2,
  duration: pkg.duration,
  startDate: pkg.startDate,
  endDate: pkg.endDate,
  priceBdt: pkg.priceBdt,
  image: pkg.image,
  features: pkg.features,
  spots: pkg.spots,
  spotImages: pkg.spotImages,
  description: pkg.description,
});

const packagesData = [
  normalizePackage({
    id: 1,
    title: "Cox's Bazar Escape",
    destinationName: "COX'S BAZAR",
    location: "Cox's Bazar, Bangladesh",
    image2: CoxBazarImage,
    duration: "3 Days / 2 Nights",
    startDate: "2026-05-10",
    endDate: "2026-05-12",
    priceBdt: 29900,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    features: ["Hotel Stay", "Breakfast", "Airport Pickup"],
    spots: ["Laboni Beach", "Inani Beach", "Himchari National Park"],
    spotImages: [
      {
        name: "Laboni Beach",
        image:
          "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Inani Beach",
        image:
          "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Himchari National Park",
        image:
          "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    description:
      "Travel with my team from 10 May 2026 to 12 May 2026 and explore Cox's Bazar's top highlights including Laboni Beach, Inani Beach, and Himchari National Park, along with sea views, fresh seafood, and relaxing sunset moments.",
  }),
  normalizePackage({
    id: 2,
    title: "Sajek Valley Retreat",
    destinationName: "SAJEK",
    location: "Rangamati, Bangladesh",
    image2: getImage2ByLocation("Rangamati, Bangladesh"),
    duration: "2 Days / 1 Night",
    startDate: "2026-06-14",
    endDate: "2026-06-15",
    priceBdt: 22900,
    image:
      "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1200&q=80",
    features: ["Resort Stay", "Dinner", "Tour Guide"],
    spots: ["Konglak Hill", "Ruilui Para", "Sajek Helipad"],
    spotImages: [
      {
        name: "Konglak Hill",
        image:
          "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Ruilui Para",
        image:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Sajek Helipad",
        image:
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    description:
      "Join my team from 14 June 2026 to 15 June 2026 for a refreshing Sajek tour, where we visit Konglak Hill, Ruilui Para, and the famous Sajek Helipad for cloud-kissed hill views and peaceful mornings.",
  }),
  normalizePackage({
    id: 3,
    title: "Sundarban Mangrove Adventure",
    destinationName: "SUNDARBAN",
    location: "Khulna, Bangladesh",
    image2: getImage2ByLocation("Khulna, Bangladesh"),
    duration: "3 Days / 2 Nights",
    startDate: "2026-06-25",
    endDate: "2026-06-27",
    priceBdt: 31900,
    image:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80",
    features: ["Boat Safari", "Forest Guide", "Meals Included"],
    spots: ["Harbaria Eco Park", "Karamjal Wildlife Center", "Kotka Beach"],
    spotImages: [
      {
        name: "Harbaria Eco Park",
        image:
          "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Karamjal Wildlife Center",
        image:
          "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Kotka Beach",
        image:
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    description:
      "Travel with my team from 25 June 2026 to 27 June 2026 through the world's largest mangrove forest and visit Harbaria Eco Park, Karamjal Wildlife Center, and Kotka Beach with guided boat safari experiences.",
  }),
  normalizePackage({
    id: 4,
    title: "Sreemangal Tea Tour",
    destinationName: "SREEMANGAL",
    location: "Sylhet, Bangladesh",
    image2: getImage2ByLocation("Sylhet, Bangladesh"),
    duration: "4 Days / 3 Nights",
    startDate: "2026-07-05",
    endDate: "2026-07-08",
    priceBdt: 35900,
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
    features: ["Tea Garden Visit", "Hotel Stay", "Transport"],
    spots: ["Lawachara National Park", "Madhabpur Lake", "Nilkantha Tea Cabin"],
    spotImages: [
      {
        name: "Lawachara National Park",
        image:
          "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Madhabpur Lake",
        image:
          "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Nilkantha Tea Cabin",
        image:
          "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    description:
      "Come with my team from 05 July 2026 to 08 July 2026 to discover Sreemangal's best spots, including Lawachara National Park, Madhabpur Lake, and Nilkantha Tea Cabin, with calm tea garden walks and local culture.",
  }),
];

export default packagesData;
