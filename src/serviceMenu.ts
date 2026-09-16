import modelDetails from "../content/service-details.json" with { type: "json" };
export type ServiceLink = {
  name: string;
  href: string;
};

export type ServiceCategory = {
  name: string;
  href: string;
  description: string;
  links: ServiceLink[];
};

const combinationOptions: ServiceLink[] = [
  {
    name: "13 ft Luxury Combination Trailer, 3 Stalls",
    href: "/services/shower-restroom-combination-trailers/13ft-3-stall/",
  },
  {
    name: "22 ft Luxury Combination Trailer, 6 Stalls",
    href: "/services/shower-restroom-combination-trailers/22ft-6-stall/",
  },
  {
    name: "30 ft Luxury Combination Trailer, 8 Stalls",
    href: "/services/shower-restroom-combination-trailers/30ft-8-stall/",
  },
  {
    name: "Luxury Combination Trailer, 3 Stalls + 1 ADA",
    href: "/services/shower-restroom-combination-trailers/3-stall-1-ada/",
  },
  {
    name: "Luxury Combination Trailer, 8 Stalls + 1 ADA",
    href: "/services/shower-restroom-combination-trailers/8-stall-1-ada/",
  },
];

export const serviceCategories: ServiceCategory[] = [
  {
    name: "Mobile Kitchens",
    href: "/equipment-rental/mobile-kitchen-trailers/",
    description:
      "Commercial mobile kitchen rentals for planned projects, renovations and emergency food service.",
    links: [
      {
        name: "24ft Mobile Kitchen Trailer",
        href: "/services/mobile-kitchen-trailers/24ft/",
      },
      {
        name: "26ft Bulk Mobile Kitchen",
        href: "/services/mobile-kitchen-trailers/26ft-bulk/",
      },
      {
        name: "28ft Mobile Kitchen Trailer",
        href: "/services/mobile-kitchen-trailers/28ft/",
      },
      {
        name: "38ft Mobile Kitchen Trailer",
        href: "/services/mobile-kitchen-trailers/38ft/",
      },
      {
        name: "40ft Mobile Kitchen Trailer",
        href: "/services/mobile-kitchen-trailers/40ft/",
      },
      {
        name: "40ft Combination Mobile Kitchen",
        href: "/services/mobile-kitchen-trailers/40ft-combination/",
      },
      {
        name: "40ft Bulk Combination Mobile Kitchen",
        href: "/services/mobile-kitchen-trailers/40ft-bulk-combination/",
      },
    ],
  },
  {
    name: "Dishwashing",
    href: "/portable-dishwashing-trailer-rental/",
    description:
      "Portable dishwashing facilities for high-volume sanitation and food service support.",
    links: [
      {
        name: "22ft Dishwashing Trailer",
        href: "/services/dishwashing-trailers/22ft/",
      },
      {
        name: "24ft Dishwashing Trailer",
        href: "/services/dishwashing-trailers/24ft/",
      },
      {
        name: "26ft Dishwashing Trailer",
        href: "/services/dishwashing-trailers/26ft/",
      },
      {
        name: "38ft Conveyor Dishwashing Trailer",
        href: "/services/dishwashing-trailers/38ft-conveyor/",
      },
    ],
  },
  {
    name: "Refrigeration",
    href: "/equipment-rental/refrigeration/",
    description:
      "Temporary cold storage options for ingredients, prepared food and temperature-sensitive supplies.",
    links: [
      {
        name: "12ft Refrigeration Trailer",
        href: "/equipment-rental-refrigeration-12ft-refrigerated-trailer/",
      },
      {
        name: "20ft Refrigeration Trailer",
        href: "/20ft-refrigeration-trailers/",
      },
      {
        name: "40ft Refrigerated Container",
        href: "/equipment-rental/refrigerated-containers/",
      },
    ],
  },
  {
    name: "Shower",
    href: "/equipment-rental/shower-trailer/",
    description:
      "Shower-only options include a 22 ft trailer with 10 stalls and a 20 ft container with 5 stalls.",
    links: [
      {
        name: "22 ft Shower Trailer, 10 Stalls",
        href: "/services/shower-trailers/22ft-10-stall/",
      },
      {
        name: "20 ft Shower Container, 5 Stalls",
        href: "/services/shower-containers/20ft-5-stall/",
      },
    ],
  },
  {
    name: "Restroom",
    href: "/equipment-rental/restroom-trailers/",
    description:
      "Restroom rental options use our shower and restroom combination trailers: 13 ft with 3 stalls, 22 ft with 6 stalls, 30 ft with 8 stalls, and accessible configurations.",
    links: combinationOptions,
  },
  {
    name: "Shower and Restroom Combination Trailers",
    href: "/services/shower-restroom-combination-trailers/",
    description:
      "Luxury combination trailers include 13 ft with 3 stalls, 22 ft with 6 stalls, 30 ft with 8 stalls, and accessible configurations.",
    links: combinationOptions,
  },
  {
    name: "Sleeper",
    href: "/equipment-rental/mobile-sleep-trailers/",
    description:
      "Temporary sleeping facilities for rotating crews, remote operations and extended deployments.",
    links: [
      {
        name: "20ft Shared Sleeper Trailer",
        href: "/services/mobile-sleeper-trailers/20ft-shared/",
      },
      {
        name: "20ft Contractor Sleeper Trailer",
        href: "/services/mobile-sleeper-trailers/20ft-contractor/",
      },
      {
        name: "20ft VIP Sleeper Trailer",
        href: "/services/mobile-sleeper-trailers/20ft-vip/",
      },
      {
        name: "Containerized Sleeper Units",
        href: "/remote-containerized-military-berthing-solution-for-rent/",
      },
    ],
  },
  {
    name: "Laundry",
    href: "/equipment-rental/laundry-trailers/",
    description:
      "Mobile laundry facilities for workforce camps, emergency operations and long-duration projects.",
    links: [
      {
        name: "24ft Mobile Laundry Trailer",
        href: "/services/laundry-trailers/24ft/",
      },
      {
        name: "30ft Mobile Laundry Trailer",
        href: "/services/laundry-trailers/30ft/",
      },
    ],
  },
  {
    name: "Handwashing Trailers",
    href: "/equipment-rental/handwashing-stations/",
    description:
      "Portable handwashing facilities that support hygiene plans at active and remote sites.",
    links: [
      {
        name: "Portable Handwashing Stations",
        href: "/equipment-rental/handwashing-stations/",
      },
      {
        name: "Hands-Free Handwashing Stations",
        href: "/services/handwashing-trailers/hands-free/",
      },
    ],
  },
];

const establishedPaths = new Set([
  "/equipment-rental-refrigeration-12ft-refrigerated-trailer/",
  "/20ft-refrigeration-trailers/",
  "/equipment-rental/refrigerated-containers/",
  "/equipment-rental/handwashing-stations/",
  "/remote-containerized-military-berthing-solution-for-rent/",
]);

export const serviceOptions = serviceCategories.flatMap((category) =>
  category.links
    .filter(
      (link) =>
        !establishedPaths.has(link.href) && category.name !== "Restroom",
    )
    .map((link) => ({
      ...link,
      category: category.name,
      categoryHref: category.href,
      categoryDescription: category.description,
      description:
        modelDetails[link.href as keyof typeof modelDetails]?.intro ||
        `${link.name} rental planning from Temporary123.`,
    })),
);

export type ServiceOption = (typeof serviceOptions)[number];
