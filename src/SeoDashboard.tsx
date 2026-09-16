import {
  dashboardSectionLinks,
  defaultSeoDashboardData,
  evidenceStatusText,
  type EvidenceMetric,
  type EvidenceStatus,
  type HistoryPoint,
  type SeoDashboardData,
  type SeoDashboardSection,
} from "./seoDashboardData";

type SeoDashboardProps = {
  data?: SeoDashboardData;
  section?: SeoDashboardSection;
  canRefresh?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
};

function StatusBadge({
  status,
  label,
}: {
  status: EvidenceStatus;
  label?: string;
}) {
  return (
    <span className={`seo-status seo-status--${status}`}>
      <span className="seo-status__mark" aria-hidden="true" />
      {label ?? evidenceStatusText[status]}
    </span>
  );
}

function MetricHistory({
  points,
  label,
}: {
  points: HistoryPoint[];
  label: string;
}) {
  if (points.length < 2) {
    return <p className="seo-vital__history-empty">Insufficient history</p>;
  }

  const values = points.map((point) => point.value);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const span = maximum - minimum || 1;
  const path = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 38 - ((point.value - minimum) / span) * 34;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <figure className="seo-vital__history">
      <svg viewBox="0 0 100 42" role="img" aria-label={`${label} history`}>
        <path d={path} vectorEffect="non-scaling-stroke" />
      </svg>
      <figcaption>
        {points.length} verified observations, {points[0].recordedAt} to{" "}
        {points[points.length - 1].recordedAt}
      </figcaption>
    </figure>
  );
}

function VitalCard({ metric }: { metric: EvidenceMetric }) {
  return (
    <article className="seo-vital" data-status={metric.status}>
      <div className="seo-vital__topline">
        <p className="seo-vital__label">{metric.label}</p>
        <StatusBadge status={metric.status} label={metric.statusLabel} />
      </div>
      <p className="seo-vital__value">{metric.value}</p>
      <p className="seo-vital__detail">{metric.detail}</p>
      <MetricHistory points={metric.history} label={metric.label} />
      <dl className="seo-evidence">
        <div>
          <dt>Source</dt>
          <dd>{metric.source}</dd>
        </div>
        <div>
          <dt>Freshness</dt>
          <dd>{metric.freshness}</dd>
        </div>
        <div>
          <dt>Checked</dt>
          <dd>{metric.checkedAt}</dd>
        </div>
      </dl>
      <a className="seo-text-link" href={metric.drilldownHref}>
        {metric.drilldownLabel} <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}

function SectionHeading({
  eyebrow,
  title,
  detail,
}: {
  eyebrow: string;
  title: string;
  detail: string;
}) {
  return (
    <header className="seo-section-heading">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      <span>{detail}</span>
    </header>
  );
}

export function SeoDashboard({
  data = defaultSeoDashboardData,
  section = "overview",
  canRefresh = false,
  isRefreshing = false,
  onRefresh,
}: SeoDashboardProps) {
  const activeSection =
    dashboardSectionLinks.find((link) => link.id === section) ??
    dashboardSectionLinks[0];

  return (
    <div
      className="seo-dashboard"
      data-owner-only="true"
      data-robots="noindex,nofollow"
    >
      <a className="seo-skip-link" href="#seo-dashboard-content">
        Skip to dashboard content
      </a>
      <aside className="seo-sidebar" aria-label="SEO dashboard sections">
        <div className="seo-sidebar__brand">
          <a href="/seo/dashboard/" aria-label="SEO dashboard overview">
            <img src="/dishwashing-facility-logo.png" width="1263" height="1246" alt="" />
          </a>
        </div>
        <nav aria-label="Dashboard navigation">
          {dashboardSectionLinks.map((link, index) => (
            <a href={link.href} aria-current={link.id === section ? "page" : undefined} key={link.id}>
              <span className="seo-sidebar__nav-icon" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="seo-sidebar__nav-label">{link.label}</span>
            </a>
          ))}
        </nav>
        <a className="seo-sidebar__home-link" href="/">
          <span aria-hidden="true">←</span>
          Back to website
        </a>
        <div className="seo-sidebar__privacy">
          <strong><span aria-hidden="true" /> Private preview</strong>
          <p>
            Authentication is not connected. Do not launch this route until
            access control is verified; keep it out of navigation and sitemaps.
          </p>
        </div>
      </aside>

      <main className="seo-main" id="seo-dashboard-content">
        <header className="seo-page-header">
          <div>
            <p className="seo-eyebrow">Owner dashboard preview</p>
            <h1>{activeSection.pageTitle}</h1>
            <p>
              {activeSection.description} Evidence-first status for <strong>{data.siteLabel}</strong>; a missing connection is never counted as a success.
            </p>
          </div>
          <div className="seo-run-panel" aria-label="Diagnostic run status">
            <StatusBadge status={data.runStatus} label={data.runStatusLabel} />
            <dl>
              <div>
                <dt>Last run</dt>
                <dd>{data.lastRunAt}</dd>
              </div>
              <div>
                <dt>Next run</dt>
                <dd>{data.nextScheduledRun}</dd>
              </div>
            </dl>
            <button
              type="button"
              disabled={!canRefresh || isRefreshing}
              onClick={onRefresh}
              aria-describedby={!canRefresh ? "refresh-explanation" : undefined}
            >
              {isRefreshing ? "Refreshing…" : "Run verified checks"}
            </button>
            {!canRefresh && (
              <small id="refresh-explanation">
                Refresh unavailable until an authorized diagnostics endpoint is
                connected.
              </small>
            )}
          </div>
        </header>

        {section === "overview" && (
        <section
          id="overview"
          className="seo-section"
          aria-labelledby="overview-title"
        >
          <SectionHeading
            eyebrow="Overview"
            title="The seven signals that need owner attention"
            detail="Every card identifies its evidence source, freshness, status and drill-down."
          />
          <span id="overview-title" className="seo-visually-hidden">
            Overview metrics
          </span>
          <div className="seo-vital-grid">
            {data.metrics.map((metric) => (
              <VitalCard metric={metric} key={metric.id} />
            ))}
          </div>
        </section>
        )}

        {section === "diagnostics" && (
        <section
          id="diagnostics"
          className="seo-section"
          aria-labelledby="diagnostics-title"
        >
          <SectionHeading
            eyebrow="12-hour diagnostics"
            title="Serving, data and performance checks"
            detail="Production evidence only. Firebase Hosting logs are not presented as Vercel traffic evidence."
          />
          <h3 id="diagnostics-title" className="seo-visually-hidden">
            Diagnostic checks
          </h3>
          <div className="seo-table-wrap">
            <table>
              <caption>Latest diagnostic results and provenance</caption>
              <thead>
                <tr>
                  <th scope="col">Check</th>
                  <th scope="col">Result</th>
                  <th scope="col">Status</th>
                  <th scope="col">Source</th>
                  <th scope="col">Checked</th>
                  <th scope="col">What it means</th>
                </tr>
              </thead>
              <tbody>
                {data.diagnostics.map((item) => (
                  <tr key={item.label}>
                    <th scope="row">{item.label}</th>
                    <td>{item.value}</td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td>{item.source}</td>
                    <td>{item.checkedAt}</td>
                    <td>{item.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="seo-callout">
            <strong>Top broken URLs</strong>
            <p>
              Not connected. Exact 404, 410 and 5xx rows will appear after a
              production-origin crawl or verified serving-platform diagnostic.
            </p>
          </div>
        </section>
        )}

        {section === "google-status" && (
        <section
          id="google-status"
          className="seo-section"
          aria-labelledby="google-title"
        >
          <SectionHeading
            eyebrow="Google status"
            title="Verified coverage, without inferred totals"
            detail="URL Inspection evidence remains distinct from rankings, crawl tools and site: estimates."
          />
          <h3 id="google-title" className="seo-visually-hidden">
            Google Search Console status
          </h3>
          <div className="seo-status-grid">
            {[
              "Google Verified Indexed",
              "Google Verified Not Indexed",
              "Google Status Unknown",
              "Ahrefs Crawled",
              "Ranking Detected — Likely Indexed",
            ].map((label) => (
              <article key={label}>
                <span>{label}</span>
                <strong>Not connected</strong>
                <small>Source: no authorized data · Checked: never</small>
              </article>
            ))}
          </div>
          <p className="seo-disclosure">
            Request Indexing is an action, not proof of index status.
            Quota-limited URL samples cannot establish a complete indexed total.
          </p>
        </section>
        )}

        {section === "authority-metrics" && (
        <section
          id="authority-metrics"
          className="seo-section"
          aria-labelledby="authority-title"
        >
          <SectionHeading
            eyebrow="Authority metrics"
            title="Third-party measurements stay distinct"
            detail="Only authorized APIs or dated owner uploads qualify as evidence."
          />
          <h3 id="authority-title" className="seo-visually-hidden">
            Authority integrations
          </h3>
          <div className="seo-split-cards">
            <article>
              <p>Ahrefs Domain Rating</p>
              <strong>Not connected</strong>
              <span>
                Requires an authorized Ahrefs API or dated export. A site crawl
                cannot calculate current DR.
              </span>
            </article>
            <article>
              <p>Moz Domain Authority</p>
              <strong>Not connected</strong>
              <span>
                Requires an authorized Moz API or dated export. DA is not
                interchangeable with DR.
              </span>
            </article>
          </div>
        </section>
        )}

        {section === "portfolio-readiness" && (
        <section
          id="portfolio-readiness"
          className="seo-section"
          aria-labelledby="portfolio-title"
        >
          <SectionHeading
            eyebrow="Portfolio readiness"
            title="One honest view across the portfolio"
            detail="Rollups will cover up to 107 sites only after each site has a verified inventory and status source."
          />
          <h3 id="portfolio-title" className="seo-visually-hidden">
            Portfolio readiness status
          </h3>
          <div className="seo-empty-state">
            <strong>No portfolio registry connected</strong>
            <p>
              Site-level migration state, technical issues, assignments,
              approvals and audit history are staged features—not completed
              capabilities.
            </p>
          </div>
        </section>
        )}

        {section === "protected-urls" && (
        <section
          id="protected-urls"
          className="seo-section"
          aria-labelledby="protected-title"
        >
          <SectionHeading
            eyebrow="Protected URLs"
            title="Preserve valuable page intent and evidence"
            detail="Top URLs will be verified individually for rebuild, 200 status, canonical, sitemap, links and Google status."
          />
          <h3 id="protected-title" className="seo-visually-hidden">
            Protected URL registry
          </h3>
          {data.protectedUrls.length === 0 ? (
            <div className="seo-empty-state">
              <strong>No approved registry loaded</strong>
              <p>
                Upload a dated Ahrefs export and migration mapping before any
                URL is marked preserved or missing.
              </p>
            </div>
          ) : (
            <div className="seo-table-wrap">
              <table>
                <caption>Owner-visible protected URL registry</caption>
                <thead>
                  <tr>
                    <th scope="col">Historical URL / topic</th>
                    <th scope="col">Source metrics</th>
                    <th scope="col">Rebuilt URL</th>
                    <th scope="col">Live / canonical</th>
                    <th scope="col">Discovery</th>
                    <th scope="col">Restoration / owner</th>
                    <th scope="col">Google / checked</th>
                  </tr>
                </thead>
                <tbody>
                  {data.protectedUrls.map((item) => (
                    <tr key={item.historicalUrl}>
                      <th scope="row">
                        <code>{item.historicalUrl}</code>
                        <small>{item.topic}</small>
                      </th>
                      <td>{item.sourceMetrics}</td>
                      <td>
                        <code>{item.rebuiltUrl}</code>
                      </td>
                      <td>
                        {item.liveStatus}
                        <small>{item.canonicalStatus}</small>
                      </td>
                      <td>
                        {item.sitemapStatus}
                        <small>{item.internalLinkStatus}</small>
                      </td>
                      <td>
                        {item.restorationStatus}
                        <small>{item.owner}</small>
                      </td>
                      <td>
                        {item.googleStatus}
                        <small>{item.checkedAt}</small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        )}

        {section === "next-checks" && (
        <section
          id="next-checks"
          className="seo-section"
          aria-labelledby="checks-title"
        >
          <SectionHeading
            eyebrow="Next checks"
            title="Connect evidence in a controlled order"
            detail="These are pending integration tasks, not completed diagnostics."
          />
          <h3 id="checks-title" className="seo-visually-hidden">
            Next integration checks
          </h3>
          <ol className="seo-checklist">
            <li>
              <span>01</span>
              <div>
                <strong>Authorize the production crawl</strong>
                <p>
                  Capture exact statuses, canonicals, sitemap membership and
                  internal-link evidence.
                </p>
              </div>
              <StatusBadge status="not-connected" label="Pending" />
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Connect Search Console securely</strong>
                <p>
                  Use OAuth without collecting an owner password; keep
                  inspection scope and quotas visible.
                </p>
              </div>
              <StatusBadge status="not-connected" label="Pending" />
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Load the protected URL export</strong>
                <p>
                  Prioritize the top 25 using dated backlink, traffic and
                  business evidence.
                </p>
              </div>
              <StatusBadge status="not-connected" label="Pending" />
            </li>
            <li>
              <span>04</span>
              <div>
                <strong>Verify scheduled diagnostics</strong>
                <p>
                  Record authorization, timeouts, failures and the actual next
                  run.
                </p>
              </div>
              <StatusBadge status="not-connected" label="Pending" />
            </li>
          </ol>
          <div className="seo-export-row">
            <button type="button" disabled>
              Export CSV
            </button>
            <button type="button" disabled>
              Export PDF
            </button>
            <small>
              Exports unlock only when verified source rows are available.
            </small>
          </div>
        </section>
        )}
      </main>
    </div>
  );
}

export default SeoDashboard;
