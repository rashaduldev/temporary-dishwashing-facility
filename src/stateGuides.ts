import { equipmentSet } from "./equipmentPhotos";
import { buildStateSeasonalDemand } from "./seasonalDemand";

// Editorial planning prompts, not claims of local inventory, delivery times,
// permitting approval or completed projects. Service labels live in serviceMenu.
const stateGuideDetails: Record<
  string,
  { focus: string; intro: string; question: string }
> = {
  Alabama: {
    focus: "Keep the work area connected",
    intro:
      "For an Alabama plant shutdown or kitchen renovation, map the route between the temporary cooking area and the people it serves. Separate food deliveries from construction traffic and leave room for refrigeration and dishwashing access.",
    question: "Can the kitchen stay in place through every phase of the work?",
  },
  Alaska: {
    focus: "Start with transport feasibility",
    intro:
      "An Alaska rental enquiry should identify the community and the final delivery route before equipment is selected. For a site without direct road access, discuss transport feasibility, unloading arrangements and the return journey at the outset.",
    question:
      "Which transport connections are available for the exact site and rental dates?",
  },
  Arizona: {
    focus: "Plan the working environment",
    intro:
      "For an Arizona outdoor operation, include shaded staff breaks, drinking-water access and the proposed location of refrigerated storage in the site brief. Discuss the equipment's operating conditions and utility demands before choosing a layout.",
    question:
      "Where will staff rest and supplies be stored during the busiest service period?",
  },
  Arkansas: {
    focus: "Check the last stretch of access",
    intro:
      "An Arkansas project outside a town center may depend on a private access road rather than the main highway. Provide gate measurements, photographs of turns and the proposed trailer position so delivery access can be reviewed.",
    question:
      "Can a delivery vehicle enter, turn and leave without crossing the active work zone?",
  },
  California: {
    focus: "Make limited space work",
    intro:
      "For a California renovation on an occupied property, show the available footprint alongside pedestrian routes, deliveries and emergency access. The kitchen, refrigeration and dishwashing layout should support the existing operation throughout construction.",
    question: "Which activities must continue beside the temporary facility?",
  },
  Colorado: {
    focus: "Match the plan to the elevation",
    intro:
      "A Colorado site brief should distinguish an urban property from a mountain location. Include access gradients, the operating season and the exact site elevation for the equipment and delivery teams to assess.",
    question:
      "Do the approach road and proposed setup area have slopes that need review?",
  },
  Connecticut: {
    focus: "Protect the occupied campus",
    intro:
      "For a Connecticut school, healthcare or workplace renovation, plan temporary food service around the people who remain on site. Identify delivery windows and a clear route from preparation to serving that avoids construction activity.",
    question:
      "How will food move from the temporary kitchen to the dining area?",
  },
  Delaware: {
    focus: "Coordinate arrival and service",
    intro:
      "For a Delaware property with a shared service entrance, schedule trailer placement separately from routine food and waste collections. Mark connection points and check that servicing vehicles can reach them once the facility is operating.",
    question:
      "Who controls the service entrance and can reserve the installation window?",
  },
  Florida: {
    focus: "Include a weather contingency",
    intro:
      "A Florida temporary facility plan should include a site-specific weather contingency as well as the normal operating layout. Discuss who will monitor conditions, make operational decisions and coordinate any change to servicing or access.",
    question:
      "Who is responsible for the site's weather response and communication plan?",
  },
  Georgia: {
    focus: "Design around shift changes",
    intro:
      "For a Georgia production or construction project, use the busiest shift change to size the food service and welfare brief. Staggered breaks and separate supply access can influence the arrangement of kitchens, restrooms and handwashing facilities.",
    question:
      "How many people need to use the facilities within the same break period?",
  },
  Hawaii: {
    focus: "Identify the island first",
    intro:
      "A Hawaii enquiry needs the island and site address before delivery options can be assessed. Discuss equipment availability, any required freight connections, receiving access and the removal plan together rather than assuming a mainland-style delivery.",
    question:
      "Who will receive the equipment and coordinate the final movement to site?",
  },
  Idaho: {
    focus: "Prepare for a remote operating day",
    intro:
      "For an Idaho project away from established services, document how food, potable water and waste collections will reach the site. A temporary kitchen plan should account for replenishment between deliveries, as well as the initial installation.",
    question:
      "What supplies must remain on site between scheduled service visits?",
  },
  Illinois: {
    focus: "Keep public and service routes clear",
    intro:
      "For an Illinois urban property, review the delivery approach and the working area separately. Show where the trailer will sit, how staff will enter and where supply vehicles can stop without obstructing public access.",
    question:
      "Does installation require coordination with another property or loading-area operator?",
  },
  Indiana: {
    focus: "Bridge the shutdown period",
    intro:
      "For an Indiana facility shutdown, build the rental schedule around commissioning and handover as well as the construction dates. Allow the project team to verify the temporary kitchen's connections before normal food service transfers across.",
    question: "What must be checked before the existing kitchen can close?",
  },
  Iowa: {
    focus: "Account for changing crew numbers",
    intro:
      "An Iowa seasonal or phased project may have different staffing levels during setup, peak work and demobilization. Share those stages so kitchen capacity, washing facilities and storage can be discussed against actual demand.",
    question: "When does the project reach its highest daily occupancy?",
  },
  Kansas: {
    focus: "Lay out an exposed work site",
    intro:
      "For a Kansas open-site operation, discuss the proposed equipment positions and site conditions with the installation team. Keep staff routes, utility runs and service access visible on the same plan rather than arranging each facility independently.",
    question: "Who will review the placement plan before delivery is booked?",
  },
  Kentucky: {
    focus: "Follow the food service route",
    intro:
      "For a Kentucky renovation or event, work backward from the serving point to preparation, storage and washing. This makes it easier to identify whether a standalone kitchen or coordinated supporting facilities suit the operation.",
    question:
      "Where do clean dishes, used dishes and incoming ingredients move?",
  },
  Louisiana: {
    focus: "Confirm the usable setup area",
    intro:
      "For a Louisiana site, identify a suitable setup surface and discuss drainage and access conditions with the property team. Include a servicing route that remains usable for food deliveries and waste collection during the rental.",
    question:
      "Has the property team reviewed the proposed ground conditions and drainage?",
  },
  Maine: {
    focus: "Plan beyond the delivery date",
    intro:
      "A Maine rental extending across seasons should include operating dates and access arrangements for the whole stay. For an island or remote property, identify any transport connection that affects both equipment movement and routine supplies.",
    question:
      "Could the supply or removal route change before the rental ends?",
  },
  Maryland: {
    focus: "Coordinate a controlled-access site",
    intro:
      "For a Maryland institutional or secured property, include vehicle entry procedures and a named receiving contact in the brief. Plan deliveries and servicing around the site's access process so the temporary facility can be supported after installation.",
    question:
      "What information must drivers provide before arriving at the gate?",
  },
  Massachusetts: {
    focus: "Fit around an existing building",
    intro:
      "For a Massachusetts renovation with a constrained yard or loading area, provide measured access and photographs before selecting equipment. Consider the staff entrance and the route to dining alongside the trailer's footprint.",
    question: "Are there overhead obstructions or tight turns on the approach?",
  },
  Michigan: {
    focus: "Specify the actual destination",
    intro:
      "A Michigan enquiry should name the peninsula, city and exact property location. Discuss delivery routing and the operating season together, especially when a project spans several sites with different access arrangements.",
    question:
      "Will the facilities stay at one property or move between project phases?",
  },
  Minnesota: {
    focus: "Define seasonal operating needs",
    intro:
      "For a Minnesota rental that continues into colder months, discuss connection protection and servicing arrangements with the equipment team. The project brief should give the full operating period, including any planned shutdowns.",
    question:
      "Will the facility operate continuously or be unused for part of the rental?",
  },
  Mississippi: {
    focus: "Connect food service and welfare",
    intro:
      "For a Mississippi field project, plan kitchen service, handwashing and restroom access together. Show where crews gather and how service vehicles will reach the facilities without cutting across the main pedestrian route.",
    question:
      "How far will workers travel from the work area to meals and washing facilities?",
  },
  Missouri: {
    focus: "Sequence a phased installation",
    intro:
      "For a Missouri project with several construction stages, identify when each temporary facility becomes necessary. Reserving installation space and connection routes early can help the temporary operation fit alongside later phases.",
    question:
      "Which part of the site must remain available for the entire rental?",
  },
  Montana: {
    focus: "Build a replenishment plan",
    intro:
      "For a Montana remote crew operation, discuss the interval between food, water and servicing deliveries. Storage and welfare requirements should reflect the working schedule and resupply plan rather than crew numbers alone.",
    question:
      "How often can supply and servicing vehicles realistically reach the site?",
  },
  Nebraska: {
    focus: "Separate meals from deliveries",
    intro:
      "For a Nebraska agricultural or construction project, show how supply vehicles and staff will use the site during meal periods. A clear unloading point and sufficient storage help the team plan food service around the daily workflow.",
    question:
      "Can replenishment happen without interrupting meal preparation or serving?",
  },
  Nevada: {
    focus: "Describe the whole utility setup",
    intro:
      "A Nevada enquiry for an undeveloped site should identify what power, water and wastewater arrangements already exist. Review the complete support setup before selecting a kitchen or accommodation layout.",
    question:
      "Which utilities are installed, and which still need to be arranged?",
  },
  "New Hampshire": {
    focus: "Review access before selecting size",
    intro:
      "For a New Hampshire hillside or rural property, provide the access route and proposed installation position together. Measured turns, gradients and available working space give the delivery team more useful information than a street address alone.",
    question:
      "Can you provide photographs from the entrance to the setup area?",
  },
  "New Jersey": {
    focus: "Use a shared loading area carefully",
    intro:
      "For a New Jersey commercial renovation, list other users of the loading dock or service yard. Discuss trailer placement, waste collection and ingredient deliveries so the temporary operation fits the property's daily logistics.",
    question:
      "Which loading-area activities cannot be rescheduled during installation?",
  },
  "New Mexico": {
    focus: "Plan the distance between facilities",
    intro:
      "For a New Mexico project spread across a large site, show the working areas and staff travel routes. The placement of food service, washing and rest facilities should reflect where people spend their shifts.",
    question:
      "Would one central facility serve the team, or do work areas need separate access?",
  },
  "New York": {
    focus: "Distinguish the property conditions",
    intro:
      "A New York city-center renovation and an upstate field operation need different delivery briefs. Specify the property type, usable access, installation window and distance between the temporary kitchen and the serving area.",
    question:
      "What property-specific constraint will determine equipment placement?",
  },
  "North Carolina": {
    focus: "Explain the site's setting",
    intro:
      "For a North Carolina enquiry, describe whether the site is coastal, inland or in a mountain area, then provide its actual access conditions. Pair those details with the project schedule so delivery and ongoing servicing can be assessed.",
    question:
      "Are there site access conditions that change during the planned rental period?",
  },
  "North Dakota": {
    focus: "Connect occupancy to daily servicing",
    intro:
      "For a North Dakota crew camp or field project, give the expected overnight occupancy as well as shift headcount. Sleeping, shower, laundry and meal requirements can differ even when they support the same workforce.",
    question:
      "How many people will live on site compared with those arriving for each shift?",
  },
  Ohio: {
    focus: "Support a working facility",
    intro:
      "For an Ohio workplace renovation, define which parts of the existing food service will remain operational. Temporary cooking, cold storage or washing capacity can then be discussed around the specific gap in the current facility.",
    question:
      "Which functions must move outside, and which can stay in the building?",
  },
  Oklahoma: {
    focus: "Prepare a flexible operating brief",
    intro:
      "For an Oklahoma field operation, identify the minimum facilities needed at startup and what changes as the workforce grows. Include the site's contingency arrangements and the person authorized to adjust the rental scope.",
    question:
      "What change in crew size would require a different facility arrangement?",
  },
  Oregon: {
    focus: "Keep service access usable",
    intro:
      "For an Oregon outdoor project, review the setup surface and the route used by servicing vehicles throughout the rental. Include drainage, staff walkways and the distance to utility connections in the placement discussion.",
    question:
      "Can the servicing route remain separate from the main staff walkway?",
  },
  Pennsylvania: {
    focus: "Coordinate with the renovation team",
    intro:
      "For a Pennsylvania institutional renovation, align temporary food service with construction phasing and building access. Share the meal schedule and handover dates so installation and removal can be planned around continued occupancy.",
    question:
      "Who will coordinate the temporary facility with the main contractor?",
  },
  "Rhode Island": {
    focus: "Measure a compact site",
    intro:
      "For a Rhode Island property with limited outdoor space, start with a measured site sketch. Include neighboring entrances, the unloading area and the staff route to the building before discussing equipment combinations.",
    question:
      "What usable space remains once delivery and pedestrian access are reserved?",
  },
  "South Carolina": {
    focus: "Match facilities to service periods",
    intro:
      "For a South Carolina hospitality or renovation project, list the number of meals and the timing of each service. Include dish return and ingredient storage so the temporary setup supports the complete daily cycle.",
    question:
      "Which service period creates the highest demand for cooking and washing?",
  },
  "South Dakota": {
    focus: "Plan for peak attendance",
    intro:
      "For a South Dakota event or temporary workforce site, distinguish average attendance from the busiest day. Give the team the operating hours and expected arrival pattern to discuss restrooms, showers and food service access.",
    question:
      "Does demand arrive steadily or in a short peak after shifts or events?",
  },
  Tennessee: {
    focus: "Allow for a changing daily program",
    intro:
      "For a Tennessee event, venue or workplace project, describe how food service demand changes through the day. Preparation, serving and cleanup may require different access arrangements even when they use the same temporary kitchen.",
    question:
      "Can the site support preparation and cleanup while guests or staff are present?",
  },
  Texas: {
    focus: "Locate the crew and the supply route",
    intro:
      "For a Texas project, provide the exact job-site address and explain whether the workforce is local or staying on site. Distance from suppliers and the shift pattern will help shape the discussion about storage, food service and crew facilities.",
    question:
      "What needs to be available on site between scheduled supply deliveries?",
  },
  Utah: {
    focus: "Clarify the approach and operating area",
    intro:
      "For a Utah site beyond an established service yard, share the final approach route and the area available for installation. Discuss gradients, turning space and the utility plan before equipment dimensions are finalized.",
    question:
      "Where can the delivery vehicle safely maneuver after placing the facility?",
  },
  Vermont: {
    focus: "Include the full operating season",
    intro:
      "For a Vermont renovation or rural project, explain how long the temporary facility will remain in use and whether access changes during that period. Plan staff entry, supply deliveries and connection protection with the property team.",
    question:
      "Who will maintain access to the facility for the duration of the rental?",
  },
  Virginia: {
    focus: "Plan the transition between kitchens",
    intro:
      "For a Virginia campus or government-site project, outline how food service will transfer to the temporary facility and back again. Include site entry procedures, connection checks and the people responsible for each handover.",
    question:
      "What needs to be ready before meals move to the temporary kitchen?",
  },
  Washington: {
    focus: "Identify any transport connection",
    intro:
      "For a Washington island or otherwise constrained location, flag any ferry connection or restricted approach in the initial enquiry. Discuss both equipment transport and the regular supply route before agreeing the rental schedule.",
    question:
      "Does any part of the journey require a separate booking or receiving arrangement?",
  },
  "West Virginia": {
    focus: "Review turns and gradients",
    intro:
      "For a West Virginia hillside or valley site, the final approach can be as important as the installation footprint. Provide photographs and measurements of gates, tight turns and slopes for a route review.",
    question:
      "Is there enough space to position the trailer without blocking the access road?",
  },
  Wisconsin: {
    focus: "Link rental dates to facility demand",
    intro:
      "For a Wisconsin school, workplace or seasonal operation, explain whether demand changes during the rental. Include closure dates, staff numbers and the peak meal schedule so the temporary capacity matches the operating calendar.",
    question:
      "Will occupancy or meal production change before the permanent facility reopens?",
  },
  Wyoming: {
    focus: "Keep a remote crew supplied",
    intro:
      "For a Wyoming remote project, describe the on-site workforce and the distance between work, meals and sleeping areas. Discuss supply storage and servicing access as part of the facility layout, including the final removal route.",
    question:
      "Who coordinates food, water and servicing deliveries during the working week?",
  },
};

const firstSentence = (copy: string) =>
  copy.match(/^.*?[.!?](?:\s|$)/)?.[0].trim() || copy;

// These are plain-language travel planning areas rather than claims about
// official sales territories. They help callers describe the part of a state
// where a base camp or temporary facility will be placed.
const stateLocalDetails: Record<string, { regions: string[]; fact: string }> = {
  Alabama: {
    regions: ["North Alabama", "Central Alabama", "Wiregrass", "Gulf Coast"],
    fact: "Montgomery is the state capital.",
  },
  Alaska: {
    regions: ["Southcentral", "Interior", "Southeast", "Southwest", "Arctic"],
    fact: "Juneau is the state capital.",
  },
  Arizona: {
    regions: ["Northern Arizona", "Phoenix area", "Southern Arizona"],
    fact: "Phoenix is the state capital.",
  },
  Arkansas: {
    regions: ["Ozarks", "Arkansas River Valley", "Delta", "Southwest Arkansas"],
    fact: "Little Rock is the state capital.",
  },
  California: {
    regions: [
      "North Coast",
      "Bay Area",
      "Central Valley",
      "Los Angeles Basin",
      "Inland Empire",
      "San Diego",
    ],
    fact: "Sacramento is the state capital.",
  },
  Colorado: {
    regions: [
      "Front Range",
      "Western Slope",
      "Eastern Plains",
      "San Luis Valley",
    ],
    fact: "Denver is the state capital.",
  },
  Connecticut: {
    regions: [
      "Litchfield Hills",
      "Greater Hartford",
      "Connecticut River Valley",
      "Connecticut Shoreline",
    ],
    fact: "Hartford is the state capital.",
  },
  Delaware: {
    regions: ["Northern Delaware", "Central Delaware", "Delaware Beaches"],
    fact: "Dover is the state capital.",
  },
  Florida: {
    regions: [
      "Panhandle",
      "North Florida",
      "Central Florida",
      "South Florida",
      "Florida Keys",
    ],
    fact: "Tallahassee is the state capital.",
  },
  Georgia: {
    regions: [
      "North Georgia",
      "Metro Atlanta",
      "Central Georgia",
      "Coastal Georgia",
      "South Georgia",
    ],
    fact: "Atlanta is the state capital.",
  },
  Hawaii: {
    regions: ["Oahu", "Maui County", "Hawaii Island", "Kauai"],
    fact: "Honolulu is the state capital.",
  },
  Idaho: {
    regions: [
      "North Idaho",
      "Southwest Idaho",
      "Central Mountains",
      "Eastern Idaho",
    ],
    fact: "Boise is the state capital.",
  },
  Illinois: {
    regions: [
      "Chicago area",
      "Northern Illinois",
      "Central Illinois",
      "Southern Illinois",
    ],
    fact: "Springfield is the state capital.",
  },
  Indiana: {
    regions: ["Northern Indiana", "Central Indiana", "Southern Indiana"],
    fact: "Indianapolis is the state capital.",
  },
  Iowa: {
    regions: [
      "Northwest Iowa",
      "Central Iowa",
      "Northeast Iowa",
      "Southern Iowa",
    ],
    fact: "Des Moines is the state capital.",
  },
  Kansas: {
    regions: [
      "Western Kansas",
      "North Central Kansas",
      "Kansas City area",
      "South Central Kansas",
      "Southeast Kansas",
    ],
    fact: "Topeka is the state capital.",
  },
  Kentucky: {
    regions: [
      "Western Coalfields",
      "Bluegrass region",
      "Eastern Kentucky",
      "South Central Kentucky",
    ],
    fact: "Frankfort is the state capital.",
  },
  Louisiana: {
    regions: [
      "North Louisiana",
      "Acadiana",
      "Capital Region",
      "Greater New Orleans",
      "River Parishes",
    ],
    fact: "Baton Rouge is the state capital.",
  },
  Maine: {
    regions: [
      "Aroostook County",
      "Highlands",
      "Western Lakes and Mountains",
      "Midcoast",
      "DownEast and Acadia",
      "Southern Coast",
    ],
    fact: "Augusta is the state capital.",
  },
  Maryland: {
    regions: [
      "Western Maryland",
      "Capital Region",
      "Central Maryland",
      "Eastern Shore",
      "Southern Maryland",
    ],
    fact: "Annapolis is the state capital.",
  },
  Massachusetts: {
    regions: [
      "Berkshires",
      "Central Massachusetts",
      "Greater Boston",
      "North Shore",
      "South Shore and Cape Cod",
    ],
    fact: "Boston is the state capital.",
  },
  Michigan: {
    regions: [
      "Upper Peninsula",
      "Northern Lower Peninsula",
      "West Michigan",
      "Mid Michigan",
      "Southeast Michigan",
    ],
    fact: "Lansing is the state capital.",
  },
  Minnesota: {
    regions: [
      "Northwest Minnesota",
      "Northeast Minnesota",
      "Central Minnesota",
      "Twin Cities",
      "Southern Minnesota",
    ],
    fact: "Saint Paul is the state capital.",
  },
  Mississippi: {
    regions: [
      "Delta",
      "Hills",
      "Central Mississippi",
      "Pine Belt",
      "Gulf Coast",
    ],
    fact: "Jackson is the state capital.",
  },
  Missouri: {
    regions: [
      "Northwest Missouri",
      "Kansas City area",
      "Central Missouri",
      "Ozarks",
      "St. Louis area",
      "Southeast Missouri",
    ],
    fact: "Jefferson City is the state capital.",
  },
  Montana: {
    regions: [
      "Glacier Country",
      "Central Montana",
      "Yellowstone Country",
      "Missouri River Country",
      "Southeast Montana",
    ],
    fact: "Helena is the state capital.",
  },
  Nebraska: {
    regions: [
      "Panhandle",
      "Sandhills",
      "Central Nebraska",
      "Northeast Nebraska",
      "Lincoln and Omaha corridor",
    ],
    fact: "Lincoln is the state capital.",
  },
  Nevada: {
    regions: [
      "Northern Nevada",
      "Reno Tahoe",
      "Central Nevada",
      "Las Vegas Valley",
      "Southern Nevada",
    ],
    fact: "Carson City is the state capital.",
  },
  "New Hampshire": {
    regions: [
      "Great North Woods",
      "White Mountains",
      "Lakes Region",
      "Dartmouth Lake Sunapee",
      "Merrimack Valley",
      "Seacoast",
    ],
    fact: "Concord is the state capital.",
  },
  "New Jersey": {
    regions: [
      "Skylands",
      "Gateway Region",
      "Central Jersey",
      "Shore Region",
      "Delaware River Region",
      "Southern Shore",
    ],
    fact: "Trenton is the state capital.",
  },
  "New Mexico": {
    regions: [
      "North Central New Mexico",
      "Northeast New Mexico",
      "Albuquerque area",
      "Southeast New Mexico",
      "Southwest New Mexico",
    ],
    fact: "Santa Fe is the state capital.",
  },
  "New York": {
    regions: [
      "North Country",
      "Capital Region",
      "Central New York",
      "Finger Lakes",
      "Western New York",
      "Hudson Valley",
      "New York City and Long Island",
    ],
    fact: "Albany is the state capital.",
  },
  "North Carolina": {
    regions: [
      "Mountains",
      "Piedmont Triad",
      "Charlotte region",
      "Research Triangle",
      "Coastal Plain",
      "Outer Banks",
    ],
    fact: "Raleigh is the state capital.",
  },
  "North Dakota": {
    regions: [
      "Western North Dakota",
      "North Central North Dakota",
      "Red River Valley",
      "South Central North Dakota",
    ],
    fact: "Bismarck is the state capital.",
  },
  Ohio: {
    regions: [
      "Northeast Ohio",
      "Northwest Ohio",
      "Central Ohio",
      "Southwest Ohio",
      "Southeast Ohio",
    ],
    fact: "Columbus is the state capital.",
  },
  Oklahoma: {
    regions: [
      "Panhandle",
      "Northwest Oklahoma",
      "Green Country",
      "Central Oklahoma",
      "Kiamichi Country",
      "Southwest Oklahoma",
    ],
    fact: "Oklahoma City is the state capital.",
  },
  Oregon: {
    regions: [
      "Oregon Coast",
      "Willamette Valley",
      "Southern Oregon",
      "Central Oregon",
      "Eastern Oregon",
    ],
    fact: "Salem is the state capital.",
  },
  Pennsylvania: {
    regions: [
      "Erie region",
      "Pittsburgh and Southwest",
      "Pennsylvania Wilds",
      "Central Pennsylvania",
      "Northeast Pennsylvania",
      "Philadelphia and Southeast",
    ],
    fact: "Harrisburg is the state capital.",
  },
  "Rhode Island": {
    regions: [
      "Providence area",
      "Blackstone Valley",
      "Newport County",
      "South County",
    ],
    fact: "Providence is the state capital.",
  },
  "South Carolina": {
    regions: ["Upstate", "Midlands", "Pee Dee", "Lowcountry"],
    fact: "Columbia is the state capital.",
  },
  "South Dakota": {
    regions: [
      "Black Hills and Badlands",
      "Central South Dakota",
      "Glacial Lakes and Prairies",
      "Southeast South Dakota",
    ],
    fact: "Pierre is the state capital.",
  },
  Tennessee: {
    regions: [
      "West Tennessee",
      "Middle Tennessee",
      "Cumberland Plateau",
      "East Tennessee",
    ],
    fact: "Nashville is the state capital.",
  },
  Texas: {
    regions: [
      "Panhandle",
      "North Texas",
      "East Texas",
      "Central Texas",
      "West Texas",
      "Gulf Coast",
      "South Texas",
    ],
    fact: "Austin is the state capital.",
  },
  Utah: {
    regions: [
      "Northern Utah",
      "Wasatch Front",
      "Central Utah",
      "Southeastern Utah",
      "Southwestern Utah",
    ],
    fact: "Salt Lake City is the state capital.",
  },
  Vermont: {
    regions: [
      "Northeast Kingdom",
      "Champlain Valley",
      "Central Vermont",
      "Southern Vermont",
    ],
    fact: "Montpelier is the state capital.",
  },
  Virginia: {
    regions: [
      "Northern Virginia",
      "Shenandoah Valley",
      "Central Virginia",
      "Hampton Roads",
      "Eastern Shore",
      "Southwest Virginia",
    ],
    fact: "Richmond is the state capital.",
  },
  Washington: {
    regions: [
      "Olympic Peninsula",
      "Puget Sound",
      "North Cascades",
      "Central Washington",
      "Eastern Washington",
      "Southwest Washington",
    ],
    fact: "Olympia is the state capital.",
  },
  "West Virginia": {
    regions: [
      "Northern Panhandle",
      "Mountaineer Country",
      "Eastern Panhandle",
      "Metro Valley",
      "New River Greenbrier Valley",
      "Southern Coalfields",
    ],
    fact: "Charleston is the state capital.",
  },
  Wisconsin: {
    regions: [
      "Northwoods",
      "Lake Superior region",
      "Central Wisconsin",
      "Fox Valley",
      "Madison area",
      "Milwaukee and Southeast",
      "Driftless Area",
    ],
    fact: "Madison is the state capital.",
  },
  Wyoming: {
    regions: [
      "Northwest Wyoming",
      "Northeast Wyoming",
      "Central Wyoming",
      "Southwest Wyoming",
      "Southeast Wyoming",
    ],
    fact: "Cheyenne is the state capital.",
  },
};

// One owned Temporary123 photograph per state. These recovered assets came from
// the production media library, so the service-area experience can vary without
// relying on third-party stock imagery or repeating a photograph.
const stateVisuals = [
  [
    "/media/37575655390d18f0ca9e357d.png",
    "Stainless steel cooking line inside a mobile kitchen trailer",
  ],
  [
    "/media/41a2ee3cfcd6483b1a9c9939.png",
    "Tow vehicle transporting a Temporary123 facility trailer",
  ],
  [
    "/media/655fb7048f20d305203873c3.jpg",
    "Clear-span temporary structure prepared for a project site",
  ],
  [
    "/media/6a41707211fa615937b3936d.png",
    "Temporary facility entrance with commercial access stairs",
  ],
  [
    "/media/30edc5b4ac0956615e579ab5.png",
    "Commercial mobile kitchen with stainless steel preparation equipment",
  ],
  [
    "/media/a42a84ee8e932638b27ac426.png",
    "Wooden access ramp connected to a temporary facility",
  ],
  [
    "/media/81ec66874a7d2f333b98a291.jpg",
    "Mobile kitchen cooking and preparation workspace",
  ],
  [
    "/media/00283c22743a462ae815f094.png",
    "Connected temporary kitchen and refrigeration facility walkway",
  ],
  [
    "/media/e5bfe18449d2639300dc2066.png",
    "Freshwater and wastewater support tanks beside temporary facilities",
  ],
  [
    "/media/5f76b7a5967b4ca4818e2fb9.png",
    "Dining hall arranged with tables and seating for a workforce",
  ],
  [
    "/media/89fc19f3af3cac1b095788f8.png",
    "Compact temporary facility trailer ready for delivery",
  ],
  [
    "/media/4e54342585946d7f0e0254a2.png",
    "Refrigerated container for temporary cold storage",
  ],
  [
    "/media/486c33ac02031ac74b2a6e01.png",
    "Aerial view of mobile kitchen facilities at an active site",
  ],
  [
    "/media/0d8812a2273ed0d840f29bb5.png",
    "Dishwashing trailer with stainless steel sinks and worktables",
  ],
  [
    "/media/4b67ae2ec507c379fdf9a7e3.png",
    "Mobile sleeper unit fitted with multiple bunk beds",
  ],
  [
    "/media/e4c4ec3a81b6ed6fec49b183.png",
    "Modular temporary buildings being installed at a project site",
  ],
  [
    "/media/58d6431453111a9ae162178c.jpg",
    "Commercial cooking equipment inside a mobile kitchen",
  ],
  [
    "/media/1581ae8f5596a3ff6de998bc.png",
    "Accessible ramp leading to a temporary facility entrance",
  ],
  [
    "/media/9b8c1d6a8e92cd55cd909891.png",
    "Row of temporary sleeper modules at a wooded project site",
  ],
  [
    "/media/a82699176e52dc1827cc9495.jpg",
    "Solar-powered mobile security camera trailer",
  ],
  [
    "/media/93ab328afe054439996c17d1.png",
    "Combination shower and restroom trailer with separate entrances",
  ],
  [
    "/media/014607cb28f6de203d8dfa1d.png",
    "Refrigeration trailer exterior prepared for site placement",
  ],
  [
    "/media/217e577ab42026fa591bec3a.png",
    "Interior of a temporary refrigeration trailer",
  ],
  [
    "/media/0bc5577144c573df6a7cbfad.png",
    "Combined shower and restroom interior with private fixtures",
  ],
  [
    "/media/6ec88e391d22b5c6ce13ebb3.png",
    "Temporary sleeping modules installed beside an active work area",
  ],
  [
    "/media/599283a9ef6bf5d260ca0648.png",
    "Sleeper trailer interior with practical workforce bunk beds",
  ],
  [
    "/media/7ff2fcf2451eedc60c0fefc4.png",
    "Large temporary dining structure with arranged seating",
  ],
  [
    "/media/c120f1a788627b5c7ac5f743.png",
    "Mobile generator trailers supporting temporary facilities",
  ],
  [
    "/media/ee08834224bac1265eab5282.jpg",
    "Commercial ramp and stair system for temporary site access",
  ],
  [
    "/media/9013233787520e004bc8027f.jpg",
    "Mobile security cameras mounted for site monitoring",
  ],
  [
    "/media/fbafc6f8bbd15bd8a96fd5b9.png",
    "Temporary facilities enclosed by a dedicated service area",
  ],
  [
    "/media/cbf21c26707070c668fa6966.png",
    "Mobile sink trailer configured for field handwashing",
  ],
  [
    "/media/fb803de06002fc35d0c4d28f.png",
    "Exterior service side of a mobile handwashing trailer",
  ],
  [
    "/media/92093075ae986ac89edb2378.png",
    "Private temporary accommodation with a bed and work area",
  ],
  [
    "/media/138d2338adf9b187214939ae.jpg",
    "Commercial oven bank inside a mobile kitchen facility",
  ],
  [
    "/media/c5d1c17a2c736f35748c95c2.png",
    "High-capacity dishwashing trailer production line",
  ],
  [
    "/media/a83c096fb47e6af0e2acb64c.jpg",
    "Ramp and handrail system connecting a temporary facility",
  ],
  [
    "/media/398705f8cd3d002715488f73.jpg",
    "Stainless steel kitchen line with commercial ovens",
  ],
  [
    "/media/62dd9d0d9722a8000251c8e4.png",
    "Compact shower and restroom combination interior",
  ],
  [
    "/media/cb83c677ef352724248ff935.png",
    "Dishwashing trailer with organized sinks and preparation counters",
  ],
  [
    "/media/8ed76a87f67926d2fda452b5.png",
    "Mobile sink trailer with multiple handwashing stations",
  ],
  [
    "/media/0431732ea8f95dc309cc85ff.png",
    "Dishwashing facility arranged for efficient service flow",
  ],
  [
    "/media/975bd6d0d31e613e775308c2.jpg",
    "Temporary kitchen complex supporting high-volume meal service",
  ],
  [
    "/media/bb1003576a3549f1ab666e8f.jpg",
    "Modular ramp system installed beside temporary facilities",
  ],
  [
    "/media/456530fa23f7eef5c804225b.png",
    "Mobile locker storage designed for workforce facilities",
  ],
  [
    "/media/3585cdff4e89fa69dddb6708.png",
    "Commercial mobile kitchen with cooking and ventilation equipment",
  ],
  [
    "/media/ec34054c5890d01d82208188.png",
    "Temporary facility connected by an elevated access ramp",
  ],
  [
    "/media/d200bc065035db6ed9cca8d6.jpg",
    "Long commercial ramp providing access to a temporary building",
  ],
  [
    "/media/58466b5d345e4e3197f239ee.png",
    "Mobile laundry trailer with rows of commercial dryers",
  ],
  [
    "/media/26e57177286bf38e7705fd10.png",
    "Commercial washers installed inside a mobile laundry facility",
  ],
] as const;

const stateCodes = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
] as const;

const baseCampGalleryVisuals = [
  [
    "/images/catalog/mobile-kitchen-trailers-960.webp",
    "Mobile commercial kitchen trailer prepared for temporary food service",
  ],
  [
    "/images/catalog/shower-trailer-960.webp",
    "Private fixtures inside a mobile shower trailer",
  ],
  [
    "/images/catalog/mobile-sleep-trailers-960.webp",
    "Mobile sleeper trailer ready to support a temporary base camp",
  ],
  [
    "/images/catalog/restroom-trailers-960.webp",
    "Clean mobile restroom trailer interior for a temporary site",
  ],
  [
    "/images/catalog/bunkhouse-trailers-960.webp",
    "Bunkhouse trailer with sleeping space for a remote crew",
  ],
  [
    "/images/catalog/temporary-shower-trailers-960.webp",
    "Temporary shower trailer configured for workforce hygiene",
  ],
  [
    "/images/catalog/laundry-trailers-960.webp",
    "Commercial laundry equipment inside a mobile trailer",
  ],
  [
    "/images/catalog/refrigeration-trailers-960.webp",
    "Refrigeration trailer supporting temporary food storage",
  ],
  [
    "/images/catalog/handwashing-stations-960.webp",
    "Mobile handwashing stations for a temporary work site",
  ],
  [
    "/images/catalog/dining-structure-rental-960.webp",
    "Temporary dining structure arranged for a base camp workforce",
  ],
] as const;

const serviceSummaries = [
  "Base camp rentals include mobile commercial kitchens, 22 ft 10-stall shower trailers, shower and restroom combinations, and sleeper/bunkbed trailers. Dishwashing, laundry, refrigeration, restroom and handwashing facilities are also available.",
  "Core base camp services include kitchen trailers, mobile showers, shower and restroom combination trailers, and sleeper/bunkbed rentals. Supporting refrigeration, laundry, dishwashing, restroom and handwashing units can be added.",
  "Temporary base camp equipment includes mobile kitchens, showers, shower and restroom combinations, and sleeper/bunkbed trailers. Rental plans can also include dishwashing, refrigeration, laundry, restroom and handwashing facilities.",
  "Rent mobile commercial kitchens, 22 ft 10-stall shower trailers, combination shower and restroom units, and sleeper/bunkbed trailers for a base camp. Additional temporary facilities include laundry, refrigeration, dishwashing, restrooms and handwashing.",
  "Base camp facility leases can combine kitchen, shower, shower and restroom combination, and sleeper/bunkbed trailers. Refrigeration, dishwashing, laundry, restroom and handwashing rentals remain available for wider site needs.",
] as const;

const rentalContexts = [
  (name: string) =>
    `Temporary facility rental services can be planned for projects in ${name}, USA. Customers can rent equipment for short-term work or request a longer lease.`,
  (name: string) =>
    `Customers can rent temporary facilities for projects in ${name}, USA through a rental agreement or a longer lease.`,
  (name: string) =>
    `Temporary facility rental options in ${name}, USA include equipment to rent for short-term projects and longer lease arrangements.`,
  (name: string) =>
    `Project teams in ${name}, USA can rent temporary facilities under a short-term rental or a longer lease.`,
  (name: string) =>
    `For projects in ${name}, USA, customers can rent temporary facilities through a short-term rental agreement or request a longer lease.`,
  (name: string) =>
    `Temporary facility rental planning in ${name}, USA supports customers who need to rent equipment for a short-term project or arrange a longer lease.`,
];

const buildStateGallery = (index: number, state: string) =>
  equipmentSet(index + 246);

export const stateGuides = Object.fromEntries(
  Object.entries(stateGuideDetails).map(([name, guide], index) => {
    const local = stateLocalDetails[name];
    const gallery = buildStateGallery(index, name);
    const seasonal = buildStateSeasonalDemand(name, index);
    return [
      name,
      {
        ...guide,
        intro: `Rental Services in ${name}: rent or lease Temporary Facilities for base camp and man camp projects. ${firstSentence(guide.intro)}`,
        image: gallery[0].image,
        imageAlt: gallery[0].imageAlt,
        gallery,
        regions: local.regions,
        fact: local.fact,
        serviceSummary: serviceSummaries[index % serviceSummaries.length],
        abbreviation: stateCodes[index],
        layout: String(index % 5),
        motion: String((index + Math.floor(index / 5) * 2) % 10),
        seasonal,
      },
    ];
  }),
) as Record<
  string,
  (typeof stateGuideDetails)[string] & {
    image: string;
    imageAlt: string;
    gallery: { image: string; imageAlt: string }[];
    regions: string[];
    fact: string;
    serviceSummary: string;
    abbreviation: string;
    layout: string;
    motion: string;
    seasonal: ReturnType<typeof buildStateSeasonalDemand>;
  }
>;

export const stateAnchor = (name: string) =>
  `planning-${name.toLowerCase().replaceAll(" ", "-")}`;
