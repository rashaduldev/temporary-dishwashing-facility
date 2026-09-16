import { hydrateRoot } from "react-dom/client";
import { Site } from "./Site";
import "@fontsource-variable/manrope";
import "@fontsource/barlow-condensed/400.css";
import "@fontsource/barlow-condensed/700.css";
import "./style.css";
import "./calculator.css";
import "./seo-dashboard.css";

function normalizedPath(pathname: string) {
  if (pathname === "/") return pathname;
  return `${pathname.replace(/\/+$/, "")}/`;
}

const root = document.getElementById("root");
if (root) {
  hydrateRoot(root, <Site path={normalizedPath(window.location.pathname)} />);
}
