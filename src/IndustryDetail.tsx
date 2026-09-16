import site from "../site.json" with { type: "json" };
import { equipmentPhotos } from "./equipmentPhotos";
import { serviceCategories } from "./serviceMenu";
import { capitalizeLinkLabel } from "./linkLabels";

export const industryGuides = [
  {
    path: "/man-camps-for-rent/",
    name: "Construction & Workforce",
    title: "Construction Trailer Rental & Base Camp Facilities",
    layout: "workforce",
    photos: [28, 0, 20],
    description:
      "Rent or lease Temporary Facilities for construction and workforce projects. Rental kitchens, shower and restroom combinations, showers and sleeper trailers. Emergency 24/7.",
    intro:
      "Rent or lease Temporary Facilities around your crew's working day. Construction rental plans start with mobile commercial kitchens, shower and restroom combination trailers, shower trailers, and sleeper or bunkbed accommodation. Bring meals, hygiene and rest together in one base camp or man camp plan.",
    answer:
      "A workforce camp can combine food preparation, private washing facilities and sleeping accommodation. Size the rental around the busiest shift and explain whether workers stay on site or travel in each day.",
    steps: [
      [
        "Crew and shifts",
        "Share the peak headcount, shift changes and expected occupancy. Separate sleeping capacity from the number of people who need meals or showers.",
      ],
      [
        "Camp layout",
        "Identify firm ground, vehicle turning space and routes between the kitchen, hygiene trailers and sleeping units. Keep servicing access clear as construction progresses.",
      ],
      [
        "Changing demand",
        "Discuss phased arrivals, project extensions and the removal sequence. Laundry, refrigeration and dishwashing can support a longer assignment when those functions are needed.",
      ],
    ],
    planning:
      "Provide a site address, access restrictions, utility details and a receiving contact. Confirm water, power, wastewater and servicing responsibilities in the rental proposal. Availability and placement depend on the actual project.",
  },
  {
    path: "/food-services-2/",
    name: "Food Service & Hospitality",
    title: "Food Service Kitchen Trailer Lease",
    layout: "hospitality",
    photos: [1, 46, 24],
    description:
      "Rent or lease Temporary Facilities for food service and hospitality. Rental kitchens, shower and restroom combinations, showers and sleeper trailers. Emergency 24/7.",
    intro:
      "Keep your food operation connected with Temporary Facilities for rent or lease. Food service rental options lead with mobile commercial kitchens, shower and restroom combination trailers, shower trailers, and sleeper or bunkbed trailers when staff need on-site support. Build the facility mix around the service you need to maintain.",
    answer:
      "A temporary kitchen can support meal preparation during renovations, equipment failures or an unexpected closure. Share the menu, meals per service and serving location so the rental conversation covers the actual workflow.",
    steps: [
      [
        "Follow the menu",
        "Describe cooking methods, preparation space and peak meal volume. Identify whether you need the full kitchen or only the functions affected by downtime.",
      ],
      [
        "Connect the workflow",
        "Plan the route between receiving, cold storage, preparation, cooking and service. Add refrigeration and dishwashing rentals where the existing facilities cannot support the work.",
      ],
      [
        "Support your team",
        "Review hygiene and accommodation needs for events, remote hospitality sites or extended assignments. Laundry and handwashing facilities can complete a base camp or man camp setup.",
      ],
    ],
    planning:
      "Bring the proposed footprint, utility connections and service access details. Confirm any applicable inspection or approval requirements with the relevant authority. Equipment rental does not itself authorize a kitchen to open or resume operations.",
  },
  {
    path: "/government/",
    name: "Government & Public Services",
    title: "Government Temporary Facilities Rental",
    layout: "public",
    photos: [26, 6, 29],
    description:
      "Rent or lease Temporary Facilities for government and public services. Rental kitchens, shower and restroom combinations, showers and sleeper trailers. Emergency 24/7.",
    intro:
      "Plan public-service continuity with Temporary Facilities for rent or lease. Our rental services start with mobile commercial kitchens, shower and restroom combination trailers, shower trailers, and sleeper or bunkbed trailers. Discuss a coordinated base camp or man camp when multiple facilities are required at one location.",
    answer:
      "Government facility planning starts with the operating brief and the requirements of the purchasing organization. Temporary123 can discuss equipment options for maintenance, renovation, field operations and emergency support.",
    steps: [
      [
        "Define the requirement",
        "Share occupancy, operating hours and the functions that must remain available. Identify food service, hygiene, accommodation and supporting facility needs before comparing configurations.",
      ],
      [
        "Review the site",
        "Provide receiving procedures, access controls, available utilities and placement restrictions. Discuss accessible equipment configurations and confirm their suitability for the specific site.",
      ],
      [
        "Prepare the proposal",
        "Confirm the requested rental period, servicing responsibilities and procurement documents. Supplier eligibility, purchasing terms and any required approvals must be checked for the actual procurement.",
      ],
    ],
    planning:
      "Supporting options include refrigeration, dishwashing, laundry, restrooms and handwashing. Ask the rental team to document the proposed equipment and responsibilities. Do not assume that a listed unit, contract vehicle or purchasing authorization applies to every project.",
  },
  {
    path: "/disaster-relief-man-camp-workforce-rentals/",
    name: "Emergency & Disaster Response",
    title: "Emergency Response Trailer Rental",
    layout: "emergency",
    photos: [23, 14, 30],
    description:
      "Emergency 24/7: rent or lease Temporary Facilities for response crews. Rental kitchens, shower and restroom combinations, showers and sleeper trailers for base camps.",
    intro:
      "Emergency 24/7 rental support helps you plan Temporary Facilities to rent or lease when essential services are interrupted. Start with mobile commercial kitchens, shower and restroom combination trailers, shower trailers, and sleeper or bunkbed trailers for response teams. Coordinate food, hygiene and rest within an emergency base camp or man camp.",
    answer:
      "Call with the site location, team size and the services you need first. The rental team will discuss equipment availability, access and setup requirements for the conditions you describe.",
    steps: [
      [
        "Establish priorities",
        "Explain which facilities are unavailable and which operations must continue. Kitchen fires, equipment failures, storm damage or cleanup assignments can create different support needs.",
      ],
      [
        "Check safe access",
        "Share known road restrictions, ground conditions and available utilities. Receiving access and placement must be confirmed before equipment can be dispatched.",
      ],
      [
        "Support the response",
        "Review refrigeration, laundry, dishwashing and handwashing alongside the four leading services. Discuss capacity changes and regular servicing as the workforce or assignment develops.",
      ],
    ],
    planning:
      "Emergency 24/7 describes access to our rental team, not a guaranteed arrival time. Confirm the equipment, transport arrangements and responsibilities in your proposal. Follow local emergency instructions and coordinate the receiving site with the responsible personnel.",
  },
] as const;
export const industryGuideByPath = Object.fromEntries(
  industryGuides.map((guide) => [guide.path, guide]),
);

export function IndustryDetail({ path }: { path: string }) {
  const guide = industryGuideByPath[path];
  const photos = guide.photos.map((index) => equipmentPhotos[index]);
  const priority = [
    "Mobile Kitchens",
    "Shower and Restroom Combination Trailers",
    "Shower",
    "Sleeper",
  ];
  const services = [...serviceCategories].sort(
    (a, b) =>
      (priority.includes(a.name) ? priority.indexOf(a.name) : 9) -
      (priority.includes(b.name) ? priority.indexOf(b.name) : 9),
  );
  const names: Record<string, string> = {
    "Mobile Kitchens": "Mobile Commercial Kitchen Rentals",
    Shower: "Shower Trailers: 22 ft with 10 Stalls",
    Sleeper: "Sleeper and Bunkbed Trailer Rentals",
  };
  return (
    <article className={`industry-page industry-layout-${guide.layout}`}>
      <section className="industry-hero">
        <div className="wrap">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <a href="/industries/">Industries</a>
            <span>/</span>
            <span aria-current="page">{guide.name}</span>
          </nav>
          <div className="industry-hero-grid">
            <div>
              <span className="eyebrow">{guide.name}</span>
              <h1>{guide.title}</h1>
              <p>{guide.intro}</p>
              <a className="button" href={`tel:${site.phoneE164}`}>
                Emergency 24/7 · {site.phoneDisplay}
              </a>
            </div>
            <figure>
              <img
                src={photos[0].image}
                alt={photos[0].imageAlt}
                width="850"
                height="650"
                fetchPriority="high"
              />
              <figcaption>{photos[0].caption}</figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section className="wrap industry-services">
        <div>
          <span className="eyebrow">RENTAL SERVICES</span>
          <h2>Facilities for your operation</h2>
          <p>{guide.answer}</p>
        </div>
        <ul>
          {services.map((service) => (
            <li key={service.href}>
              <a href={service.href}>
                {capitalizeLinkLabel(names[service.name] || service.name)}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section className="industry-planning">
        <div className="wrap">
          <span className="eyebrow">RENTAL PLANNING CONDITIONS</span>
          <h2>Bring the right details together</h2>
          <div className="industry-step-grid">
            {guide.steps.map(([title, text], index) => (
              <div key={title}>
                <span className="industry-step-number">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <p className="industry-planning-note">{guide.planning}</p>
        </div>
      </section>
      <section className="wrap industry-equipment">
        <div>
          <span className="eyebrow">TEMPORARY123 EQUIPMENT</span>
          <h2>Equipment for the work ahead</h2>
        </div>
        <div className="industry-photo-grid">
          {photos.slice(1).map((photo) => (
            <figure key={photo.image}>
              <img
                src={photo.image}
                alt={photo.imageAlt}
                width="850"
                height="650"
                loading="lazy"
              />
              <figcaption>{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <nav
        className="wrap industry-related"
        aria-label="Related rental planning"
      >
        <a href="/service-areas/">Explore State and Regional Rental Services</a>
        {industryGuides
          .filter((item) => item.path !== path)
          .map((item) => (
            <a key={item.path} href={item.path}>
              {item.name} Rentals
            </a>
          ))}
      </nav>
    </article>
  );
}
