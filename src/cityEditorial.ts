// Only city guides with a reviewed, location-specific planning angle are
// linked as landing pages. The remaining Census places stay in the regional
// directory until their local copy and source have been reviewed.
export type CityEditorial = {
  heading: string;
  intro: string;
  answer: string;
  local: string;
  seasonal: string;
  question: string;
  sourceTitle: string;
  sourceUrl: string;
  seasonalSourceTitle: string;
  seasonalSourceUrl: string;
  photo: { image: string; alt: string; caption: string; sourceUrl: string };
};

export const cityEditorial: Record<string, CityEditorial> = {
  "5355365": {
    heading: "Port Angeles, Washington Mobile Kitchen Trailer Rental",
    intro:
      "A Port Angeles project brief should identify whether the site is near the waterfront, the US 101 corridor or a more constrained approach toward the peninsula's interior. Temporary123 can discuss mobile kitchens, hygiene trailers and crew accommodation for a construction job, renovation or base camp after the exact address and operating period are known.",
    answer:
      "For a Port Angeles base camp, rent or lease a mobile commercial kitchen alongside shower and restroom combination trailers, a 22 ft shower-only unit with 10 stalls, or sleeper and bunkbed trailers. Refrigeration, dishwashing and laundry can support a longer crew assignment. Confirm the required capacity before selecting equipment.",
    local:
      "Port Angeles identifies US 101, the Tumwater Truck Route and streets connecting to the ferry landing as significant parts of its transportation network. For a temporary kitchen or sleeper trailer, those routes are orientation points, not a delivery promise. Share the installation address, turns, unloading area, utility connections and any ferry-dependent movement so the rental team can assess the actual trip and site layout.",
    seasonal:
      "Spring through fall is a practical planning window for peninsula road work and outdoor camps; a facility renovation can need temporary food service at any time. In wetter or stormier months, a kitchen, showers and dry sleeper space may help a planned crew stay operational, but any emergency deployment depends on the actual event and accessible route.",
    question:
      "Will equipment arrive by a road-only route, or does any part of the project depend on a ferry or separate receiving arrangement?",
    sourceTitle: "City of Port Angeles transportation plan",
    sourceUrl:
      "https://www.cityofpa.us/DocumentCenter/View/13310/2023-Amended-Comprehensive-Plan-",
    seasonalSourceTitle: "WSDOT Olympic Peninsula construction overview",
    seasonalSourceUrl:
      "https://engage.wsdot.wa.gov/olympic-peninsula-construction",
    photo: {
      image: "/media/sheet-28ft-kitchen-exterior.png",
      alt: "Full exterior of a 28 ft mobile commercial kitchen trailer",
      caption: "28 ft mobile kitchen trailer",
      sourceUrl:
        "https://drive.google.com/file/d/1nfL9Kylpa1xaGNBE_3OvKVx40HMRGw_l/view",
    },
  },
  "5363385": {
    heading: "Sequim, Washington Temporary Facilities Rental",
    intro:
      "Sequim sits on the northern Olympic Peninsula, with city and surrounding sites that can have different access and utility arrangements. A rental discussion can cover temporary food service, shower and restroom capacity, and sleeper trailers for a renovation, work camp or emergency base camp without assuming that every property has the same setup space.",
    answer:
      "Sequim teams can ask about kitchen trailer rental or lease, shower and restroom combination units, a 22 ft shower-only trailer with 10 stalls, and sleeper or bunkbed trailers. Laundry, refrigeration, dishwashing and handwashing can be added when the camp size or food program calls for them. Size the facility package around the actual number of users.",
    local:
      "The City of Sequim maintains a transportation planning program covering local streets, safety and access. For a Sequim facility rental, document the route from the main road to the property and the usable pad before choosing trailer lengths or a shower-stall configuration. A compact in-town site and a larger district work area may need different circulation and servicing plans even when both use Sequim as the location name.",
    seasonal:
      "Outdoor construction and campground support often rise in the milder spring-to-fall period on the northern peninsula. Summer wildfire readiness and winter storm contingencies can also lead a project team to discuss temporary hygiene or crew accommodation, without implying that an emergency is underway. Occupied-building renovations can need a mobile kitchen in any season.",
    question:
      "Does the equipment need to fit within an occupied property, or can the project dedicate a separate service and unloading area?",
    sourceTitle: "City of Sequim transportation planning",
    sourceUrl: "https://www.sequimwa.gov/1302/Transportation-Planning",
    seasonalSourceTitle: "Washington DNR fire season overview",
    seasonalSourceUrl:
      "https://dnr.wa.gov/news/2025/commissioner-upthegrove-encourages-fire-safety-over-memorial-day-weekend",
    photo: {
      image: "/media/sheet-24ft-kitchen-interior.png",
      alt: "Full interior view of a 24 ft mobile commercial kitchen trailer",
      caption: "24 ft mobile kitchen interior",
      sourceUrl:
        "https://drive.google.com/file/d/1s1gafYUfg4Ik_2mgs2egSL1GNrqU17NJ/view",
    },
  },
  "5363000": {
    heading: "Seattle, Washington Temporary Facilities Rental",
    intro:
      "Seattle rental planning often turns on the last part of the delivery route and the amount of room available on an active property. Temporary123 can discuss a mobile commercial kitchen, showers, combination restrooms and sleeper support for a renovation, construction crew or base camp once site access and occupancy are specified.",
    answer:
      "A Seattle facility plan can start with a mobile commercial kitchen, shower and restroom combination trailers, a 22 ft shower-only trailer with 10 stalls, and sleeper or bunkbed accommodation. A dishwashing trailer, refrigeration or laundry can keep a temporary food operation and crew base camp functioning. Rent or lease options depend on the site and term.",
    local:
      "Seattle's transportation department identifies designated truck streets and freight corridors serving industrial and port areas. That network makes an exact street address important: the appropriate approach to a waterfront work area may differ from an occupied school, hospital or downtown property. Provide loading restrictions, available curb or yard space, pedestrian routes and utility points so equipment placement can be assessed without assuming a truck can stop at any entrance.",
    seasonal:
      "Spring through fall is a common construction window around Puget Sound, while kitchens and restroom trailers can also bridge an indoor renovation or equipment failure year-round. Winter rain increases the value of covered servicing and a clear drainage plan for any temporary setup. Emergency 24/7 support is available to discuss an actual outage or disruption, subject to equipment and access.",
    question:
      "Where can a delivery vehicle stop and turn without blocking people, freight movement or the operation that must remain open?",
    sourceTitle: "Seattle Department of Transportation freight program",
    sourceUrl:
      "https://www.seattle.gov/transportation/projects-and-programs/programs/freight-program",
    seasonalSourceTitle: "WSDOT Puget Sound construction season",
    seasonalSourceUrl:
      "https://apps.wsdot.wa.gov/about/news/2026/plan-ahead-overlapping-major-road-construction-across-puget-sound-beginning-aug-7",
    photo: {
      image: "/media/sheet-dish-trailer-interior.png",
      alt: "Dishwashing trailer interior with stainless wash and handwashing stations",
      caption: "Mobile dishwashing trailer interior",
      sourceUrl:
        "https://drive.google.com/file/d/1-zL2k3va48Gzz0v-WAAWazaA0gVa7wGV/view",
    },
  },
  "5370000": {
    heading: "Tacoma, Washington Sleeper Bunkbed Trailer Rental",
    intro:
      "Tacoma combines residential, institutional and industrial work areas, so a temporary facility plan should start with the specific site rather than the city name alone. For a crew base camp or occupied-facility renovation, Temporary123 can review kitchen, shower, restroom and sleeper trailer rental options alongside servicing needs.",
    answer:
      "Tacoma crews can rent or lease mobile commercial kitchens, shower and restroom combination trailers, a 22 ft 10-stall shower-only trailer, and sleeper or bunkbed units. A longer man camp may also need laundry, refrigeration, dishwashing, separate restrooms and handwashing. Choose capacity after confirming shift size and available utility connections.",
    local:
      "Tacoma's transportation plan maps freight corridors and a heavy-haul network around its industrial areas. A project near the Tideflats may therefore require a different delivery and staging discussion from a compact property elsewhere in Tacoma. Identify the access gate, proposed equipment footprint, worker routes and water, power and waste connections before requesting a trailer configuration or longer lease.",
    seasonal:
      "Outdoor work and base camp setup may be easier to schedule in the milder spring-to-fall months, though industrial maintenance and facility shutdowns can occur throughout the year. During wetter periods, crews should plan ground conditions and regular trailer servicing; storms can also create unplanned needs for showers, kitchens or sleeping space. The rental team assesses any actual emergency request separately.",
    question:
      "Is the work site in a freight or industrial setting, and who can confirm the final approach and unloading window?",
    sourceTitle: "City of Tacoma freight network map",
    sourceUrl:
      "https://tacoma.gov/wp-content/uploads/2025/09/TMP_Freight-Map.pdf",
    seasonalSourceTitle: "WSDOT Puget Sound construction season",
    seasonalSourceUrl:
      "https://apps.wsdot.wa.gov/about/news/2026/plan-ahead-overlapping-major-road-construction-across-puget-sound-beginning-aug-7",
    photo: {
      image: "/media/4b67ae2ec507c379fdf9a7e3.png",
      alt: "Bunkbed sleeping accommodation inside a Temporary123 crew trailer",
      caption: "Bunkbed trailer accommodation",
      sourceUrl: "https://temporary123.com/",
    },
  },
  "5351300": {
    heading: "Olympia, Washington Shower and Restroom Trailer Rental",
    intro:
      "An Olympia project can range from an occupied campus or government property to a separate work compound. Temporary123 can discuss kitchens, shower and restroom trailers, and sleeper accommodation for construction, renovation or emergency planning when the project team defines the site boundary and who must keep using it.",
    answer:
      "Olympia project teams can discuss a mobile kitchen rental, shower and restroom combination trailers, a 22 ft 10-stall shower-only trailer, and sleeper or bunkbed accommodation. For a temporary base camp or a building renovation, refrigeration, laundry, dishwashing and handwashing may complete the setup. Lease length and final equipment are confirmed with the team.",
    local:
      "The Washington State Capitol Campus in Olympia publishes specific visitor access and parking directions, illustrating why a location name is not enough for a trailer delivery brief. For a government or institutional site, clarify who controls the service entrance, any reserved arrival window, pedestrian separation and utility connections. Those details matter more than a generalized citywide arrival estimate when planning temporary facilities.",
    seasonal:
      "Campus and public-facility renovations are often scheduled around the people who must continue using the site; outdoor installation is generally simpler in the milder months. Winter rain can affect the trailer pad and utility servicing, while storm-related interruptions may create an emergency need at any time. A shower and restroom combination unit can support an occupied facility while its permanent space is unavailable.",
    question:
      "Who controls access to the exact property, and can the project reserve a safe installation and servicing area?",
    sourceTitle: "Washington State Capitol Campus directions and parking",
    sourceUrl: "https://capitol.wa.gov/visit/getting-here-directions-parking",
    seasonalSourceTitle: "WSDOT seasonal construction example near Olympia",
    seasonalSourceUrl:
      "https://wsdot.wa.gov/construction-planning/search-projects/i-5-old-highway-99-maytown-road-paving",
    photo: {
      image: "/media/e90d8c3a5518fa97ef4dd69c.png",
      alt: "Shower and restroom combination trailer interior from Temporary123",
      caption: "Shower and restroom combination interior",
      sourceUrl: "https://temporary123.com/",
    },
  },
};
