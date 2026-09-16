export type SeasonalDemand = {
  code: 1 | 2 | 3 | 4 | 5;
  label: string;
  scope: string;
  summary: string[];
  basis: string;
  corridors: string[];
  landmarks: string[];
  sources: { label: string; href: string }[];
};

type StateProfile = {
  climate: string;
  corridors: [string, string, string];
  landmarks: [string, string, string];
  work: string;
  risks: string;
  season: string;
  code: 2 | 3 | 4 | 5;
};

const demandLabels = {
  1: "Very Low",
  2: "Low",
  3: "Moderate",
  4: "High",
  5: "Very High",
} as const;

const profiles: Record<string, StateProfile> = {
  Alabama: {
    climate: "al",
    corridors: ["Interstate 65", "Interstate 20", "US Route 231"],
    landmarks: ["Tennessee River", "Black Belt", "Mobile Bay"],
    work: "manufacturing expansions, utility work and forestry operations",
    risks: "severe storms, tornadoes, river flooding and Gulf tropical weather",
    season:
      "Outdoor construction is most active from spring through fall, while heat and storm planning can affect camp operations.",
    code: 4,
  },
  Alaska: {
    climate: "ak",
    corridors: ["Parks Highway", "Dalton Highway", "Richardson Highway"],
    landmarks: ["Cook Inlet", "Brooks Range", "Inside Passage"],
    work: "oil, mining, fishing, environmental cleanup and remote camp operations",
    risks:
      "extreme cold, wildfire smoke, earthquakes, coastal storms and limited road access",
    season:
      "The short thaw season concentrates construction and field work, while remote operations can require winterized support throughout the year.",
    code: 5,
  },
  Arizona: {
    climate: "az",
    corridors: ["Interstate 10", "Interstate 17", "US Route 60"],
    landmarks: ["Colorado Plateau", "Sonoran Desert", "Grand Canyon"],
    work: "data center, utility, mining and large commercial construction",
    risks: "extreme heat, wildfire, flash flooding and dust storms",
    season:
      "Cooler months favor major outdoor work in the desert, while mountain construction and wildfire readiness increase in warmer months.",
    code: 4,
  },
  Arkansas: {
    climate: "ar",
    corridors: ["Interstate 40", "Interstate 30", "US Route 67"],
    landmarks: ["Ozark Mountains", "Arkansas River", "Mississippi Delta"],
    work: "highway, poultry, timber and manufacturing projects",
    risks: "tornadoes, severe storms, river flooding and ice",
    season:
      "Construction and camp activity generally rises from spring through fall, with storm and flood contingencies shaping site plans.",
    code: 3,
  },
  California: {
    climate: "ca",
    corridors: ["Interstate 5", "US Route 101", "State Route 99"],
    landmarks: ["Sierra Nevada", "Central Valley", "Pacific Coast"],
    work: "infrastructure, agriculture, energy, film and commercial redevelopment",
    risks: "wildfire, earthquakes, floods, heat and landslides",
    season:
      "Dry months support extensive construction, but wildfire response and heat precautions can change access and base camp needs quickly.",
    code: 5,
  },
  Colorado: {
    climate: "co",
    corridors: ["Interstate 25", "Interstate 70", "US Route 50"],
    landmarks: ["Front Range", "Rocky Mountains", "Colorado River headwaters"],
    work: "mountain infrastructure, energy, mining and urban construction",
    risks: "snow, wildfire, hail, floods and high elevation weather",
    season:
      "Lower elevation work expands from spring through fall, while mountain schedules remain sensitive to snowpack and early winter conditions.",
    code: 4,
  },
  Connecticut: {
    climate: "ct",
    corridors: ["Interstate 84", "Interstate 95", "Route 8"],
    landmarks: ["Connecticut River", "Long Island Sound", "Litchfield Hills"],
    work: "institutional renovation, utility upgrades and dense commercial construction",
    risks: "coastal storms, river flooding, winter weather and heat",
    season:
      "Road, campus and building renovation work peaks in the milder months, with winterization and coastal storm planning needed at exposed sites.",
    code: 3,
  },
  Delaware: {
    climate: "de",
    corridors: ["Interstate 95", "US Route 13", "Delaware Route 1"],
    landmarks: ["Delaware Bay", "Atlantic Coast", "Brandywine Valley"],
    work: "chemical, logistics, coastal and institutional projects",
    risks: "coastal flooding, hurricanes, heat and winter storms",
    season:
      "Warm season construction and coastal activity create the strongest demand, while tropical weather may require short notice support planning.",
    code: 3,
  },
  Florida: {
    climate: "fl",
    corridors: ["Interstate 4", "Interstate 75", "Interstate 95"],
    landmarks: ["Everglades", "Gulf Coast", "Florida Keys"],
    work: "resort renovation, transportation, utilities and emergency recovery",
    risks: "hurricanes, flooding, extreme heat, wildfire and sinkholes",
    season:
      "Construction is active year round, with hurricane season and heat increasing the need for resilient temporary kitchens, hygiene facilities and crew bases.",
    code: 5,
  },
  Georgia: {
    climate: "ga",
    corridors: ["Interstate 75", "Interstate 85", "Interstate 16"],
    landmarks: ["Blue Ridge Mountains", "Piedmont", "Savannah River"],
    work: "manufacturing, film, logistics, forestry and port related construction",
    risks:
      "severe storms, tornadoes, flooding, heat and coastal tropical weather",
    season:
      "Mild winters support long construction seasons, while summer heat and coastal storms raise the value of self contained temporary facilities.",
    code: 4,
  },
  Hawaii: {
    climate: "hi",
    corridors: ["H-1 Freeway", "Hana Highway", "Hawaii Belt Road"],
    landmarks: ["Mauna Loa", "Pearl Harbor", "Na Pali Coast"],
    work: "resort renovation, military, utility and environmental projects",
    risks:
      "volcanic activity, wildfire, tropical storms, flooding and earthquakes",
    season:
      "Work continues year round, but island logistics, wet season rainfall and wildfire conditions can lengthen mobilization and servicing plans.",
    code: 4,
  },
  Idaho: {
    climate: "id",
    corridors: ["Interstate 84", "Interstate 90", "US Route 95"],
    landmarks: ["Snake River Plain", "Sawtooth Range", "Clearwater Basin"],
    work: "agriculture, food processing, mining, timber and technology construction",
    risks: "wildfire, smoke, snow, flooding and earthquakes",
    season:
      "The main construction window runs from spring through fall, while mountain and remote camp plans must account for snow and wildfire access.",
    code: 4,
  },
  Illinois: {
    climate: "il",
    corridors: ["Interstate 55", "Interstate 80", "Interstate 90"],
    landmarks: ["Lake Michigan", "Illinois River", "Shawnee Hills"],
    work: "transportation, manufacturing, energy and institutional renovation",
    risks: "tornadoes, river flooding, heat and winter storms",
    season:
      "Major road and facility work concentrates in the warmer months, while severe weather and winter outages can create temporary support needs.",
    code: 4,
  },
  Indiana: {
    climate: "in",
    corridors: ["Interstate 65", "Interstate 69", "Interstate 70"],
    landmarks: [
      "Lake Michigan shore",
      "Wabash River",
      "Hoosier National Forest",
    ],
    work: "manufacturing, logistics, highway and campus construction",
    risks: "tornadoes, flooding, heat and winter storms",
    season:
      "Spring through fall is the busiest construction period, with storm season and industrial shutdowns influencing rental timing.",
    code: 3,
  },
  Iowa: {
    climate: "ia",
    corridors: ["Interstate 35", "Interstate 80", "US Route 20"],
    landmarks: ["Mississippi River", "Loess Hills", "Des Moines River"],
    work: "agriculture, food processing, wind energy and transportation projects",
    risks: "tornadoes, river flooding, derechos, heat and winter storms",
    season:
      "Construction and renewable energy work rise from spring through fall, while harvest operations and severe weather can increase camp and emergency support needs.",
    code: 3,
  },
  Kansas: {
    climate: "ks",
    corridors: ["Interstate 70", "Interstate 35", "US Route 54"],
    landmarks: ["Flint Hills", "Smoky Hills", "Arkansas River"],
    work: "wind energy, agriculture, aviation and transportation construction",
    risks: "tornadoes, hail, wildfire, drought and winter storms",
    season:
      "Wind, road and agricultural projects are busiest in milder months, with severe weather and prairie fire planning affecting remote sites.",
    code: 4,
  },
  Kentucky: {
    climate: "ky",
    corridors: ["Interstate 64", "Interstate 65", "Mountain Parkway"],
    landmarks: ["Bluegrass region", "Cumberland Plateau", "Ohio River"],
    work: "manufacturing, bourbon, mining, highway and institutional projects",
    risks: "flooding, tornadoes, severe storms and winter weather",
    season:
      "Construction generally builds from spring through fall, while Appalachian access and flood exposure can increase support requirements.",
    code: 4,
  },
  Louisiana: {
    climate: "la",
    corridors: ["Interstate 10", "Interstate 20", "US Route 90"],
    landmarks: ["Mississippi River", "Atchafalaya Basin", "Gulf Coast"],
    work: "petrochemical, port, energy, coastal restoration and industrial maintenance",
    risks: "hurricanes, storm surge, flooding, heat and tornadoes",
    season:
      "Industrial work runs year round, while tropical weather and high heat create strong seasonal demand for emergency base camps and self contained facilities.",
    code: 5,
  },
  Maine: {
    climate: "me",
    corridors: ["Interstate 95", "US Route 1", "US Route 201"],
    landmarks: ["Acadia coast", "North Woods", "Kennebec River"],
    work: "forestry, marine, energy, tourism and remote infrastructure projects",
    risks: "heavy snow, ice, coastal storms, flooding and wildfire",
    season:
      "The warmer months concentrate road, forestry and coastal work, while winter projects require heated equipment and reliable access plans.",
    code: 3,
  },
  Maryland: {
    climate: "md",
    corridors: ["Interstate 95", "Interstate 70", "US Route 50"],
    landmarks: ["Chesapeake Bay", "Appalachian Mountains", "Potomac River"],
    work: "federal, medical, port, utility and institutional construction",
    risks: "coastal flooding, hurricanes, heat and winter storms",
    season:
      "Public works and renovation activity is strongest from spring through fall, with bay and coastal projects requiring storm and flood contingencies.",
    code: 4,
  },
  Massachusetts: {
    climate: "ma",
    corridors: ["Interstate 90", "Interstate 93", "Route 128"],
    landmarks: ["Boston Harbor", "Berkshire Hills", "Cape Cod"],
    work: "healthcare, education, transit, life science and coastal construction",
    risks: "nor'easters, coastal flooding, heat and winter storms",
    season:
      "Campus and infrastructure projects peak in warmer months, while dense urban sites and coastal winter weather can make temporary facilities essential.",
    code: 4,
  },
  Michigan: {
    climate: "mi",
    corridors: ["Interstate 75", "Interstate 94", "US Route 2"],
    landmarks: [
      "Great Lakes shoreline",
      "Upper Peninsula",
      "Straits of Mackinac",
    ],
    work: "automotive, battery, mining, forestry and infrastructure projects",
    risks: "lake effect snow, ice, flooding, severe storms and wildfire",
    season:
      "Road and plant work expands during the warmer months, while northern and lakeshore sites face a shorter construction window and demanding winter logistics.",
    code: 4,
  },
  Minnesota: {
    climate: "mn",
    corridors: ["Interstate 35", "Interstate 94", "US Route 53"],
    landmarks: ["Lake Superior", "Iron Range", "Mississippi headwaters"],
    work: "mining, healthcare, manufacturing, renewable energy and road construction",
    risks:
      "extreme cold, blizzards, flooding, wildfire smoke and severe storms",
    season:
      "The warm season compresses road, mine and utility work, while winter operations require heated base camp facilities and dependable servicing.",
    code: 4,
  },
  Mississippi: {
    climate: "ms",
    corridors: ["Interstate 20", "Interstate 55", "US Route 49"],
    landmarks: ["Mississippi Delta", "Pine Belt", "Gulf Coast"],
    work: "forestry, agriculture, shipbuilding, manufacturing and disaster recovery",
    risks: "tornadoes, hurricanes, flooding and extreme heat",
    season:
      "Construction runs through much of the year, with spring severe weather and Gulf tropical conditions increasing emergency facility planning.",
    code: 4,
  },
  Missouri: {
    climate: "mo",
    corridors: ["Interstate 44", "Interstate 70", "US Route 65"],
    landmarks: ["Ozark Plateau", "Missouri River", "Mississippi River"],
    work: "manufacturing, transportation, energy and commercial redevelopment",
    risks: "tornadoes, river flooding, heat and winter storms",
    season:
      "Spring through fall supports the heaviest construction activity, while floodplain and severe storm exposure can trigger temporary support needs.",
    code: 4,
  },
  Montana: {
    climate: "mt",
    corridors: ["Interstate 90", "Interstate 15", "US Route 2"],
    landmarks: ["Glacier Country", "Yellowstone region", "Missouri River"],
    work: "mining, energy, agriculture, forestry and remote infrastructure",
    risks: "wildfire, extreme cold, blizzards, flooding and drought",
    season:
      "A short warm season concentrates construction and remote work, while wildfire smoke and winter travel conditions shape base camp access.",
    code: 4,
  },
  Nebraska: {
    climate: "ne",
    corridors: ["Interstate 80", "US Route 83", "US Route 275"],
    landmarks: ["Sandhills", "Platte River", "Pine Ridge"],
    work: "agriculture, food processing, wind energy and transportation construction",
    risks: "tornadoes, floods, drought, wildfire and winter storms",
    season:
      "Construction and energy work peak from spring through fall, with agricultural seasons and severe weather increasing demand in rural districts.",
    code: 3,
  },
  Nevada: {
    climate: "nv",
    corridors: ["Interstate 15", "Interstate 80", "US Route 95"],
    landmarks: ["Mojave Desert", "Great Basin", "Lake Tahoe"],
    work: "mining, solar energy, resort renovation, logistics and data center construction",
    risks: "extreme heat, wildfire, earthquakes, drought and flash flooding",
    season:
      "Desert projects favor cooler months, while mining and remote energy camps may operate year round with heat and distance driving facility demand.",
    code: 5,
  },
  "New Hampshire": {
    climate: "nh",
    corridors: ["Interstate 93", "Interstate 89", "US Route 3"],
    landmarks: ["White Mountains", "Lakes Region", "Seacoast"],
    work: "tourism, manufacturing, forestry and infrastructure renovation",
    risks: "snow, ice, flooding and coastal storms",
    season:
      "Road and building work intensifies in warmer months, while mountain access and winter storms require careful mobilization planning.",
    code: 3,
  },
  "New Jersey": {
    climate: "nj",
    corridors: ["New Jersey Turnpike", "Garden State Parkway", "Interstate 80"],
    landmarks: ["Atlantic Shore", "Pine Barrens", "Hudson waterfront"],
    work: "port, pharmaceutical, warehouse, utility and dense commercial construction",
    risks: "coastal flooding, hurricanes, heat and winter storms",
    season:
      "Construction is active through much of the year, with shore storms, urban access limits and major renovations supporting steady facility demand.",
    code: 4,
  },
  "New Mexico": {
    climate: "nm",
    corridors: ["Interstate 25", "Interstate 40", "US Route 285"],
    landmarks: [
      "Rio Grande Valley",
      "Sangre de Cristo Mountains",
      "Permian Basin",
    ],
    work: "oil and gas, mining, laboratories, film and renewable energy",
    risks:
      "wildfire, extreme heat, flash flooding, drought and winter mountain weather",
    season:
      "Lower elevation work is strongest in spring and fall, while energy and remote field camps can need continuous support across wide travel areas.",
    code: 5,
  },
  "New York": {
    climate: "ny",
    corridors: ["Interstate 87", "Interstate 90", "Interstate 81"],
    landmarks: ["Adirondacks", "Hudson River", "Great Lakes shoreline"],
    work: "transit, healthcare, manufacturing, energy and institutional renovation",
    risks:
      "lake effect snow, flooding, hurricanes, heat and severe winter storms",
    season:
      "Warm months concentrate road and upstate field work, while urban renovations and emergency continuity needs continue throughout the year.",
    code: 4,
  },
  "North Carolina": {
    climate: "nc",
    corridors: ["Interstate 40", "Interstate 85", "US Route 17"],
    landmarks: ["Blue Ridge Mountains", "Piedmont", "Outer Banks"],
    work: "manufacturing, research, energy, forestry and coastal construction",
    risks: "hurricanes, flooding, landslides, heat and wildfire",
    season:
      "Construction runs for much of the year, with mountain winter access and coastal tropical weather creating different regional peaks.",
    code: 5,
  },
  "North Dakota": {
    climate: "nd",
    corridors: ["Interstate 94", "US Route 2", "US Route 85"],
    landmarks: ["Bakken region", "Badlands", "Red River Valley"],
    work: "oil and gas, agriculture, wind energy and remote infrastructure",
    risks: "extreme cold, blizzards, flooding, drought and wildfire",
    season:
      "Energy camps operate across seasons, while the compressed warm construction window and severe winter conditions sustain high facility demand.",
    code: 5,
  },
  Ohio: {
    climate: "oh",
    corridors: ["Interstate 70", "Interstate 71", "Ohio Turnpike"],
    landmarks: ["Lake Erie", "Ohio River", "Hocking Hills"],
    work: "manufacturing, logistics, healthcare, energy and highway construction",
    risks: "tornadoes, flooding, heat and winter storms",
    season:
      "Construction and plant work peak from spring through fall, with industrial shutdowns and severe weather supporting temporary facility needs.",
    code: 4,
  },
  Oklahoma: {
    climate: "ok",
    corridors: ["Interstate 35", "Interstate 40", "US Route 69"],
    landmarks: ["Red River", "Cross Timbers", "Ouachita Mountains"],
    work: "oil and gas, wind energy, aerospace, agriculture and infrastructure",
    risks: "tornadoes, hail, wildfire, flooding and extreme heat",
    season:
      "Energy and construction work continues year round, while spring storms, summer heat and grass fire conditions affect remote site plans.",
    code: 5,
  },
  Oregon: {
    climate: "or",
    corridors: ["Interstate 5", "US Route 97", "US Route 101"],
    landmarks: ["Cascade Range", "Willamette Valley", "Pacific Coast"],
    work: "forestry, technology, agriculture, renewable energy and transportation",
    risks: "wildfire, earthquakes, floods, landslides and winter storms",
    season:
      "Dry months concentrate construction and forestry activity, while wildfire response and wet season access can increase temporary facility needs.",
    code: 4,
  },
  Pennsylvania: {
    climate: "pa",
    corridors: ["Interstate 76", "Interstate 80", "Interstate 81"],
    landmarks: ["Allegheny Plateau", "Delaware River", "Susquehanna Valley"],
    work: "energy, healthcare, manufacturing, warehousing and institutional renovation",
    risks: "flooding, winter storms, severe thunderstorms and heat",
    season:
      "Road, utility and campus work intensifies in warmer months, while energy sites and building renovations can require support throughout the year.",
    code: 4,
  },
  "Rhode Island": {
    climate: "ri",
    corridors: ["Interstate 95", "Route 4", "US Route 1"],
    landmarks: ["Narragansett Bay", "Block Island Sound", "Blackstone Valley"],
    work: "marine, university, healthcare, utility and coastal renovation",
    risks: "coastal flooding, hurricanes, winter storms and heat",
    season:
      "Marine and building projects rise from spring through fall, while compact sites and coastal storm exposure support temporary facility planning.",
    code: 3,
  },
  "South Carolina": {
    climate: "sc",
    corridors: ["Interstate 26", "Interstate 77", "US Route 17"],
    landmarks: ["Blue Ridge foothills", "Midlands", "Lowcountry coast"],
    work: "manufacturing, port, tourism, forestry and commercial construction",
    risks: "hurricanes, flooding, heat, tornadoes and wildfire",
    season:
      "Construction runs across most seasons, with coastal tropical weather and summer heat increasing demand for resilient crew support.",
    code: 4,
  },
  "South Dakota": {
    climate: "sd",
    corridors: ["Interstate 90", "Interstate 29", "US Route 83"],
    landmarks: ["Black Hills", "Badlands", "Missouri River"],
    work: "agriculture, mining, wind energy, tourism and rural infrastructure",
    risks: "blizzards, wildfire, severe storms, flooding and drought",
    season:
      "The warm season compresses road, energy and tourism projects, while remote winter work requires heated, serviceable facilities.",
    code: 4,
  },
  Tennessee: {
    climate: "tn",
    corridors: ["Interstate 40", "Interstate 75", "Interstate 24"],
    landmarks: [
      "Mississippi River",
      "Cumberland Plateau",
      "Great Smoky Mountains",
    ],
    work: "automotive, battery, logistics, tourism and institutional construction",
    risks:
      "tornadoes, flooding, severe storms, heat and winter mountain weather",
    season:
      "A long building season supports steady demand, while river flooding and severe storms can create short notice facility requirements.",
    code: 4,
  },
  Texas: {
    climate: "tx",
    corridors: ["Interstate 10", "Interstate 35", "Interstate 20"],
    landmarks: ["Permian Basin", "Gulf Coast", "Hill Country"],
    work: "oil and gas, petrochemical, wind, solar, manufacturing and large commercial construction",
    risks:
      "hurricanes, extreme heat, wildfire, flooding, tornadoes and winter freezes",
    season:
      "Major projects and remote camps operate year round, with heat, Gulf storms and broad travel distances producing very high temporary facility demand.",
    code: 5,
  },
  Utah: {
    climate: "ut",
    corridors: ["Interstate 15", "Interstate 80", "US Route 191"],
    landmarks: ["Wasatch Front", "Colorado Plateau", "Great Salt Lake"],
    work: "mining, technology, transportation, tourism and renewable energy",
    risks: "wildfire, earthquakes, extreme heat, snow and flash flooding",
    season:
      "Valley construction peaks from spring through fall, while mountain, mining and desert sites require different seasonal access plans.",
    code: 4,
  },
  Vermont: {
    climate: "vt",
    corridors: ["Interstate 89", "Interstate 91", "US Route 7"],
    landmarks: ["Green Mountains", "Champlain Valley", "Connecticut River"],
    work: "renewable energy, forestry, institutional renovation and rural infrastructure",
    risks: "flooding, heavy snow, ice and severe storms",
    season:
      "The warm season concentrates road and building work, while flooding and winter access make resilient site support valuable.",
    code: 3,
  },
  Virginia: {
    climate: "va",
    corridors: ["Interstate 81", "Interstate 95", "US Route 460"],
    landmarks: ["Blue Ridge Mountains", "Chesapeake Bay", "Tidewater"],
    work: "data centers, federal, shipyard, manufacturing and utility construction",
    risks: "hurricanes, flooding, heat, winter storms and landslides",
    season:
      "Construction remains active through much of the year, with mountain winter weather and coastal tropical risks creating regional differences.",
    code: 4,
  },
  Washington: {
    climate: "wa",
    corridors: ["Interstate 5", "Interstate 90", "US Route 2"],
    landmarks: ["Olympic Peninsula", "Cascade Range", "Columbia Basin"],
    work: "technology, aerospace, hydropower, forestry, agriculture and port construction",
    risks:
      "wildfire, earthquakes, floods, landslides and winter mountain storms",
    season:
      "Dry months concentrate major construction, while wildfire smoke, mountain passes and wet season landslides affect regional access.",
    code: 5,
  },
  "West Virginia": {
    climate: "wv",
    corridors: ["Interstate 64", "Interstate 79", "US Route 50"],
    landmarks: ["Appalachian Mountains", "New River Gorge", "Ohio River"],
    work: "energy, mining, manufacturing, forestry and highway projects",
    risks: "flash flooding, landslides, winter storms and severe weather",
    season:
      "Road, mine and utility work rises in warmer months, while steep terrain and flood exposure can increase base camp and hygiene needs.",
    code: 4,
  },
  Wisconsin: {
    climate: "wi",
    corridors: ["Interstate 39", "Interstate 90", "US Route 41"],
    landmarks: ["Lake Superior", "Lake Michigan", "Driftless Area"],
    work: "manufacturing, dairy, forestry, energy and transportation construction",
    risks: "extreme cold, blizzards, flooding, tornadoes and heat",
    season:
      "The warmer months compress road and plant work, while year round industrial operations and winter outages can require temporary facilities.",
    code: 4,
  },
  Wyoming: {
    climate: "wy",
    corridors: ["Interstate 80", "Interstate 25", "US Route 191"],
    landmarks: ["Powder River Basin", "Wind River Range", "Yellowstone region"],
    work: "oil and gas, coal, wind energy, mining and remote infrastructure",
    risks: "high winds, blizzards, wildfire, extreme cold and flooding",
    season:
      "Remote energy work continues across seasons, while the short construction window and long travel distances keep base camp demand high.",
    code: 5,
  },
};

const federalSources = (climate: string) => [
  {
    label: "NOAA State Climate Summary",
    href: `https://statesummaries.ncics.org/chapter/${climate}/`,
  },
  { label: "FEMA National Risk Index", href: "https://hazards.fema.gov/nri/" },
  {
    label: "FHWA construction schedule guidance",
    href: "https://www.fhwa.dot.gov/majorprojects/schedule_estimating/",
  },
  {
    label: "Temporary123 delivery and logistics",
    href: "https://temporary123.com/temporary-facilities-2/",
  },
  {
    label: "2024 Census Gazetteer place data",
    href: "https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.html",
  },
];

const regionalModifiers = [
  "Access around the corridor and landmark should be confirmed before equipment is dispatched.",
  "Project planners should allow for crew changes, utility connections and the route used by service vehicles.",
  "Remote or constrained sites benefit from a single base camp plan for food, hygiene, lodging and cold storage.",
  "Renovations, equipment failures and temporary Health Department closures can also create short notice facility needs.",
  "Construction camps and environmental cleanup sites may need phased capacity as the workforce changes.",
  "Emergency staging plans should account for safe access, dependable utilities and regular waste servicing.",
] as const;

export function buildStateSeasonalDemand(
  state: string,
  index: number,
): SeasonalDemand {
  const profile = profiles[state];
  const code = profile.code;
  return {
    code,
    label: demandLabels[code],
    scope: `${state} statewide service area`,
    summary: [
      `${profile.season} Work near ${profile.corridors[0]} and ${profile.landmarks[0]} commonly includes ${profile.work}.`,
      `Normal planning conditions include ${profile.risks}; these are regional patterns rather than a claim that an emergency is active.`,
      `Temporary mobile commercial kitchens, shower and restroom combinations, 22 ft shower trailers with 10 stalls, sleeper and bunkbed trailers, laundry, refrigeration, dishwashing, restrooms and handwashing units can support construction, man camps, renovations, commercial kitchen fires, Health Department closures, equipment failures, cleanup and emergency base camps.`,
      regionalModifiers[index % regionalModifiers.length],
    ],
    basis: `Estimated Seasonal Facility Demand Code ${code}, ${demandLabels[code]}. This estimate applies to the ${state} statewide service area because seasonal work patterns, travel conditions and regional hazards can affect temporary facility planning. It is an estimate for project planning and is not an official government risk rating.`,
    corridors: profile.corridors,
    landmarks: profile.landmarks,
    sources: federalSources(profile.climate),
  };
}

export function buildRegionSeasonalDemand(
  state: string,
  region: string,
  regionIndex: number,
  cities: string[],
): SeasonalDemand {
  const profile = profiles[state];
  const corridor = profile.corridors[regionIndex % profile.corridors.length];
  const landmark = profile.landmarks[regionIndex % profile.landmarks.length];
  const code = profile.code;
  const cityList =
    cities.length === 2
      ? `${cities[0]} and ${cities[1]}`
      : `${cities.slice(0, -1).join(", ")}, and ${cities.at(-1)}`;
  const variants = [
    `${profile.season} In ${region}, work near ${corridor} and ${landmark} can include ${profile.work}.`,
    `Project activity around ${cityList} follows local weather and access conditions. ${profile.season}`,
    `${region} connects projects near ${corridor} with the broader ${landmark} travel area. ${profile.season}`,
    `Seasonal work in ${region}, including sites near ${cityList}, is shaped by access, weather and workforce schedules. ${profile.season}`,
    `The location of ${region} near ${landmark} makes route planning on ${corridor} part of a practical facility plan. ${profile.season}`,
    `Construction camps and temporary work sites across ${region} may mobilize at different times around ${cityList}. ${profile.season}`,
  ];
  return {
    code,
    label: demandLabels[code],
    scope: `${region} regional district`,
    summary: [
      variants[regionIndex % variants.length],
      `Relevant planning risks include ${profile.risks}; this describes normal regional patterns and does not state that an emergency is happening now.`,
      `Temporary mobile commercial kitchens, shower and restroom combination trailers, 22 ft shower trailers with 10 stalls, sleeper and bunkbed trailer rentals, laundry, refrigeration, dishwashing, restrooms and handwashing units can support construction projects, man camps, renovations, commercial kitchen fires, Health Department closures, cleanup work, equipment failures and emergency base camps.`,
      regionalModifiers[
        (regionIndex + state.length) % regionalModifiers.length
      ],
    ],
    basis: `Estimated Seasonal Facility Demand Code ${code}, ${demandLabels[code]}. This estimate applies to the ${region} regional district because its normal work season, travel access and regional hazards can affect temporary facility demand. It is an estimate for project planning and is not an official government risk rating.`,
    corridors: [corridor],
    landmarks: [landmark],
    sources: federalSources(profile.climate),
  };
}
