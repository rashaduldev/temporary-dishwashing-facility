import { load } from "cheerio";

type Options = {
  origin: string;
  routes: Set<string>;
  redirects: Map<string, string>;
  media: Record<string, { local?: string }>;
  unresolved: Set<string>;
  dimensions?: Record<string, { width: number; height: number }>;
};

export function renderSourceContent(html: string, options: Options) {
  const $ = load(html, undefined, false);
  // These headings introduce repeated global navigation, not page-specific copy.
  // Preserve subsequent peer sections and keep the original archive untouched.
  $("h2,h3,h4,h5,h6").each((_, el) => {
    if (
      !/^(complete list of states and cities of united states|other states we served|top 100 big cities that we served)$/i.test(
        $(el).text().trim(),
      )
    )
      return;
    const level = Number(el.tagName.slice(1));
    let next = el.nextSibling;
    while (next) {
      if (
        next.type === "tag" &&
        /^h[2-6]$/.test(next.tagName) &&
        Number(next.tagName.slice(1)) <= level
      ) break;
      const following = next.nextSibling;
      $(next).remove();
      next = following;
    }
    $(el).replaceWith(
      '<p><a href="/service-areas/">Explore our service areas</a></p>',
    );
  });

  $("img").each((_, el) => {
    const image = $(el);
    const original = image.attr("src") || "";
    const mapped = options.media[original]?.local;
    if (mapped) image.attr("src", mapped);
    else if (/^https?:/.test(original)) {
      options.unresolved.add(original);
      // Retain the source reference in the archive and migration ledger. The
      // existing CSP cannot display remote images; do not emit broken images.
      image.remove();
      return;
    }
    const src = image.attr("src") || "";
    const size = options.dimensions?.[src];
    if (size)
      image.attr({ width: String(size.width), height: String(size.height) });
    image.attr({ loading: "lazy", decoding: "async" });
  });

  $("a[href]").each((_, el) => {
    const a = $(el),
      href = a.attr("href") || "";
    if (/^(tel:|mailto:|#)/i.test(href)) return;
    let url: URL;
    try {
      url = new URL(href, options.origin);
    } catch {
      return;
    }
    if (
      ![new URL(options.origin).hostname, "www.temporary123.com"].includes(
        url.hostname,
      )
    )
      return;
    const firstTextNode = a
      .contents()
      .toArray()
      .find(
        (node) =>
          node.type === "text" &&
          "data" in node &&
          typeof node.data === "string" &&
          node.data.trim().length > 0,
      );
    if (
      firstTextNode &&
      "data" in firstTextNode &&
      typeof firstTextNode.data === "string"
    )
      firstTextNode.data = firstTextNode.data.replace(
        /^(\s*)([a-z])/,
        (_match: string, space: string, letter: string) =>
          `${space}${letter.toUpperCase()}`,
      );
    const path = url.pathname;
    const suffix = url.search + url.hash;
    const mapped = options.media[new URL(path, options.origin).href]?.local;
    if (mapped) {
      a.attr("href", mapped + suffix);
      return;
    }
    if (options.routes.has(path)) {
      a.attr("href", path + suffix);
      return;
    }
    const redirect = options.redirects.get(path);
    if (redirect) {
      a.attr("href", redirect + suffix);
      return;
    }
    options.unresolved.add(path);
    // An image's enlargement link may be unavailable while its displayed
    // source image is recovered. Link to that actual image, never fake an asset.
    if (/\.(png|jpe?g|webp|gif)$/i.test(path)) {
      const image = a.find("img").first();
      const recovered = image.attr("src");
      if (recovered?.startsWith("/")) {
        a.attr("href", recovered);
        if (!image.attr("alt")) a.attr("aria-label", "View image");
        return;
      }
    }
    // Keep unresolved valuable links visible and explicitly tracked. Never
    // silently turn them into a homepage redirect or claim migration success.
    a.attr("href", new URL(path + suffix, options.origin).href);
  });
  $("a").each((_, el) => {
    if (!$(el).text().trim() && !$(el).find("img").length) $(el).remove();
  });
  $("h2,h3,h4,h5,h6").each((_, el) => {
    const previous = $(el).prevAll("h2,h3,h4,h5,h6").first();
    const max = previous.length ? Number(previous[0].tagName.slice(1)) + 1 : 2;
    if (Number(el.tagName.slice(1)) > max) el.tagName = `h${max}`;
  });
  return $.html();
}
