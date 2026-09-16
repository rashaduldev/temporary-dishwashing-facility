export type EvidenceStatus =
  "healthy" | "attention" | "critical" | "unknown" | "not-connected";

export type HistoryPoint = {
  recordedAt: string;
  value: number;
};

export type EvidenceMetric = {
  id:
    | "site-health"
    | "live-pages"
    | "broken-pages"
    | "google-indexed"
    | "protected-urls"
    | "data-health"
    | "mobile-performance";
  label: string;
  value: string;
  status: EvidenceStatus;
  statusLabel: string;
  detail: string;
  source: string;
  freshness: string;
  checkedAt: string;
  drilldownHref: string;
  drilldownLabel: string;
  history: HistoryPoint[];
};

export type DiagnosticItem = {
  label: string;
  value: string;
  status: EvidenceStatus;
  source: string;
  checkedAt: string;
  detail: string;
};

export type ProtectedUrl = {
  historicalUrl: string;
  topic: string;
  sourceMetrics: string;
  rebuiltUrl: string;
  liveStatus: string;
  canonicalStatus: string;
  sitemapStatus: string;
  internalLinkStatus: string;
  restorationStatus: string;
  owner: string;
  googleStatus: string;
  checkedAt: string;
};

export type SeoDashboardData = {
  siteLabel: string;
  canonicalOrigin: string;
  lastRunAt: string;
  runStatus: EvidenceStatus;
  runStatusLabel: string;
  nextScheduledRun: string;
  metrics: EvidenceMetric[];
  diagnostics: DiagnosticItem[];
  protectedUrls: ProtectedUrl[];
};

export const dashboardSectionLinks = [
  { id: "overview", label: "Overview", href: "/seo/dashboard/", pageTitle: "SEO migration overview", description: "The seven evidence signals that need owner attention." },
  { id: "diagnostics", label: "12-hour diagnostics", href: "/seo/dashboard/diagnostics/", pageTitle: "Serving and data diagnostics", description: "Production crawl, application-data and performance checks with explicit provenance." },
  { id: "google-status", label: "Google status", href: "/seo/dashboard/google-status/", pageTitle: "Google indexing status", description: "Verified Search Console evidence kept separate from rankings and crawl estimates." },
  { id: "authority-metrics", label: "Authority metrics", href: "/seo/dashboard/authority/", pageTitle: "Authority integrations", description: "Dated third-party authority measurements without substituting one metric for another." },
  { id: "portfolio-readiness", label: "Portfolio readiness", href: "/seo/dashboard/portfolio/", pageTitle: "Portfolio migration readiness", description: "A site-by-site view of migration state, evidence and unresolved work." },
  { id: "protected-urls", label: "Protected URLs", href: "/seo/dashboard/protected-urls/", pageTitle: "Protected URL registry", description: "Historical URLs and their rebuild, discovery, canonical and restoration evidence." },
  { id: "next-checks", label: "Next checks", href: "/seo/dashboard/next-checks/", pageTitle: "Next integration checks", description: "The controlled order for connecting diagnostics and owner evidence." },
] as const;

export type SeoDashboardSection = (typeof dashboardSectionLinks)[number]["id"];

const unavailableMetric = (
  metric: Omit<
    EvidenceMetric,
    "value" | "status" | "statusLabel" | "freshness" | "checkedAt" | "history"
  > & { status?: Extract<EvidenceStatus, "unknown" | "not-connected"> },
): EvidenceMetric => ({
  ...metric,
  value: metric.status === "unknown" ? "Unknown" : "Not connected",
  status: metric.status ?? "not-connected",
  statusLabel: metric.status === "unknown" ? "Unknown" : "Not connected",
  freshness: "No verified measurement available",
  checkedAt: "Never",
  history: [],
});

export const defaultSeoDashboardData: SeoDashboardData = {
  siteLabel: "Temporary Dishwashing Facility for Lease",
  canonicalOrigin: "https://temporary-dishwashing-facility-for-lease.com",
  lastRunAt: "Never",
  runStatus: "not-connected",
  runStatusLabel: "Diagnostics not connected",
  nextScheduledRun: "Not scheduled",
  metrics: [
    unavailableMetric({
      id: "site-health",
      label: "Websites healthy / migrated",
      detail: "No verified portfolio inventory or migration run is connected.",
      source: "Portfolio registry + migration audit",
      drilldownHref: "/seo/dashboard/portfolio/",
      drilldownLabel: "Review portfolio readiness",
    }),
    unavailableMetric({
      id: "live-pages",
      label: "Live 200 pages",
      detail:
        "A production-origin crawl has not supplied a verified page count.",
      source: "Independent production crawl",
      drilldownHref: "/seo/dashboard/diagnostics/",
      drilldownLabel: "Review crawl diagnostics",
    }),
    unavailableMetric({
      id: "broken-pages",
      label: "Broken 404 / 5xx location URLs",
      detail: "No crawl or actual serving-platform evidence is connected.",
      source: "Independent crawl or Vercel-compatible logs",
      drilldownHref: "/seo/dashboard/diagnostics/",
      drilldownLabel: "Review broken URL evidence",
    }),
    unavailableMetric({
      id: "google-indexed",
      label: "Google verified indexed URLs",
      detail: "Google Search Console authorization is not connected.",
      source: "Google Search Console URL Inspection",
      drilldownHref: "/seo/dashboard/google-status/",
      drilldownLabel: "Review Google status",
    }),
    unavailableMetric({
      id: "protected-urls",
      label: "Valuable URLs preserved / missing",
      detail:
        "No dated backlink export or approved protected URL register is loaded.",
      source: "Owner-uploaded Ahrefs export + live verification",
      drilldownHref: "/seo/dashboard/protected-urls/",
      drilldownLabel: "Review protected URLs",
    }),
    unavailableMetric({
      id: "data-health",
      label: "Critical data-health failures",
      detail: "The production data-health diagnostic has not run.",
      source: "Application data integrity diagnostic",
      drilldownHref: "/seo/dashboard/diagnostics/",
      drilldownLabel: "Review data checks",
    }),
    unavailableMetric({
      id: "mobile-performance",
      label: "Mobile performance",
      detail:
        "No current mobile PageSpeed or field Core Web Vitals result is connected.",
      source: "PageSpeed Insights + Chrome UX Report",
      drilldownHref: "/seo/dashboard/diagnostics/",
      drilldownLabel: "Review performance evidence",
    }),
  ],
  diagnostics: [
    {
      label: "Production URL crawl",
      value: "Not connected",
      status: "not-connected",
      source: "Independent crawler",
      checkedAt: "Never",
      detail: "Required for exact 200, 404, 410, and 5xx URL lists.",
    },
    {
      label: "Application data integrity",
      value: "Not connected",
      status: "not-connected",
      source: "Production datastore diagnostic",
      checkedAt: "Never",
      detail: "Parent references and required content have not been verified.",
    },
    {
      label: "Datastore connectivity and latency",
      value: "Unknown",
      status: "unknown",
      source: "Timed production fetch",
      checkedAt: "Never",
      detail: "No production fetch measurement is available.",
    },
    {
      label: "Mobile PageSpeed and CWV",
      value: "Not connected",
      status: "not-connected",
      source: "PageSpeed Insights + Chrome UX Report",
      checkedAt: "Never",
      detail: "Lab and field performance must remain separately identified.",
    },
  ],
  protectedUrls: [],
};

export const evidenceStatusText: Record<EvidenceStatus, string> = {
  healthy: "Healthy",
  attention: "Needs attention",
  critical: "Critical",
  unknown: "Unknown",
  "not-connected": "Not connected",
};
