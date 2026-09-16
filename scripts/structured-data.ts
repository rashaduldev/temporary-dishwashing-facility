import site from "../site.json" with { type: "json" };

const origin = site.origin.replace(/\/$/, "");
export function pageSchema(input: {
  path: string;
  title: string;
  description: string;
  crumbs: { name: string; item: string }[];
  service?: boolean;
  area?: { name: string; state?: string };
  image?: { src: string; alt: string; width?: number; height?: number };
}) {
  const url = new URL(input.path, origin).href;
  const organizationId = `${origin}/#organization`;
  const websiteId = `${origin}/#website`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: site.brand,
      url: `${origin}/`,
      telephone: site.phoneE164,
      logo: `${origin}/images/temporary123-logo.png`,
      areaServed: { "@type": "Country", name: "United States" },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: site.phoneE164,
        contactType: "Emergency temporary facilities rental support",
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "00:00",
          closes: "23:59",
        },
      },
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: site.brand,
      url: `${origin}/`,
      publisher: { "@id": organizationId },
    },
  ];
  const area = input.area
    ? {
        "@type": input.area.state ? "Place" : "State",
        name: input.area.name,
        containedInPlace: input.area.state
          ? {
              "@type": "State",
              name: input.area.state,
              containedInPlace: { "@type": "Country", name: "United States" },
            }
          : { "@type": "Country", name: "United States" },
      }
    : { "@type": "Country", name: "United States" };
  graph.push({
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: input.title,
    description: input.description,
    isPartOf: { "@id": websiteId },
    publisher: { "@id": organizationId },
    inLanguage: "en-US",
    ...(input.area ? { about: area } : {}),
    ...(input.crumbs.length
      ? { breadcrumb: { "@id": `${url}#breadcrumb` } }
      : {}),
    ...(input.service ? { mainEntity: { "@id": `${url}#service` } } : {}),
    ...(input.image
      ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            contentUrl: new URL(input.image.src, origin).href,
            caption: input.image.alt,
            width: input.image.width,
            height: input.image.height,
          },
        }
      : {}),
  });
  if (input.service)
    graph.push({
      "@type": "Service",
      "@id": `${url}#service`,
      url,
      name: input.title,
      description: input.description,
      provider: { "@id": organizationId },
      serviceType: "Temporary facilities rental and lease",
      areaServed: area,
    });
  if (input.crumbs.length)
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: input.crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.item,
      })),
    });
  return { "@context": "https://schema.org", "@graph": graph };
}
