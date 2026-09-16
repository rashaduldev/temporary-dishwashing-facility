import { equipmentPhotos } from "./equipmentPhotos";
import { cityRentalHeadline } from "./rentalHeadlines";

// City selections retain the existing service URL and query. They are not new indexable city pages.
export function applyCityRentalView(location: string) {
  const main = document.querySelector<HTMLElement>("main");
  const title = main?.querySelector("h1");
  if (
    !main ||
    !title ||
    !/\/(equipment-rental|services)\//.test(window.location.pathname)
  )
    return;
  const originalTitle = title.textContent || "Temporary123 equipment";
  main.dataset.cityView = "true";
  const headline = cityRentalHeadline(location, originalTitle);
  title.replaceChildren(document.createTextNode(headline));
  const description = document.createElement("p");
  description.className = "model-intro";
  description.textContent = `Rent or lease Temporary Facilities for your ${location} project. Explore ${originalTitle} and discuss rental availability with Temporary123. Emergency 24/7.`;
  title.after(description);
  main.querySelectorAll("figure").forEach((figure) => (figure.hidden = true));
  main.querySelectorAll("img").forEach((image) => (image.hidden = true));
  const photoType = /kitchen/i.test(originalTitle)
    ? "kitchen"
    : /sleep|bunk/i.test(originalTitle)
      ? "Sleeper"
      : /shower|restroom/i.test(originalTitle)
        ? "Shower"
        : "equipment";
  const pool = equipmentPhotos.filter((photo) =>
    photo.imageAlt.toLowerCase().includes(photoType.toLowerCase()),
  );
  const index =
    [...location].reduce(
      (total, letter) => (total * 31 + letter.charCodeAt(0)) >>> 0,
      0,
    ) % pool.length;
  const gallery = document.createElement("div");
  gallery.className = "city-rental-gallery";
  gallery.setAttribute(
    "aria-label",
    `Rental equipment for ${location} project planning`,
  );
  for (let i = 0; i < 3; i++) {
    const photo = pool[(index + i) % pool.length];
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = photo.image;
    image.alt = photo.imageAlt;
    image.width = 850;
    image.height = 650;
    const caption = document.createElement("figcaption");
    caption.textContent = photo.caption;
    figure.append(image, caption);
    gallery.append(figure);
  }
  description.after(gallery);
  document.title = `${headline}: Temporary Facilities to Rent or Lease | Temporary123`;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", description.textContent);
  document
    .querySelectorAll('script[type="application/ld+json"]')
    .forEach((script) => {
      const schema = JSON.parse(script.textContent || "{}");
      for (const node of schema["@graph"] || []) {
        if (["WebPage", "Service"].includes(node["@type"])) {
          node.name = title.textContent;
          node.description = description.textContent;
        }
      }
      script.textContent = JSON.stringify(schema).replace(/</g, "\\u003c");
    });
}
