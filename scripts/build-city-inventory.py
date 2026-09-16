"""Build the city directory from the U.S. Census 2026 places Gazetteer.

The 50-state site covers incorporated places, plus Hawaii's Census-designated
places because Hawaii has no incorporated places in this source. Region
assignments use the nearest existing representative city in each state and
are planning groupings, not administrative boundaries.
"""

from __future__ import annotations

import csv
import io
import json
import math
import re
import unicodedata
import zipfile
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "content/geography/2026_Gaz_place_national.zip"
DESTINATION = ROOT / "src/cityDirectory.json"
REVIEW = ROOT / "content/geography/city-inventory-review.json"


def short_name(name: str, lsad: str) -> str:
    if lsad == "00":
        return name
    return re.sub(
        r" (?:city and borough|unified government(?: \(balance\))?|"
        r"consolidated government(?: \(balance\))?|metro government(?: \(balance\))?|"
        r"metropolitan government|urban county|city(?: \(balance\))?|"
        r"town|village|borough|municipality|CDP|corporation)$",
        "",
        name,
        flags=re.I,
    )


def public_name(row: dict) -> str:
    name = short_name(row["NAME"], row["LSAD"])
    aliases = {
        ("Georgia", "Cusseta-Chattahoochee County"): "Cusseta",
        ("Georgia", "Macon-Bibb County"): "Macon",
        ("Hawaii", "Urban Honolulu"): "Honolulu",
        ("Idaho", "Boise City"): "Boise",
        ("Indiana", "Indianapolis city (balance)"): "Indianapolis",
        ("Kentucky", "Lexington-Fayette"): "Lexington",
        ("Minnesota", "St. Paul"): "Saint Paul",
        ("New York", "New York"): "New York City",
        ("Tennessee", "Nashville-Davidson metropolitan government (balance)"): "Nashville",
    }
    if row["STATE_NAME"] == "Hawaii" and name == "Kailua" and float(row["INTPTLAT"]) < 20.5:
        return "Kailua-Kona"
    return aliases.get((row["STATE_NAME"], name), name)


def normalized(name: str) -> str:
    return re.sub(r"[^a-z0-9]", "", unicodedata.normalize("NFKD", name).lower())


def slug(name: str) -> str:
    ascii_name = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    return re.sub(r"^-|-$", "", re.sub(r"[^a-z0-9]+", "-", ascii_name.lower()))


def distance(a: dict, b: dict) -> float:
    # Haversine distance between Census representative points, in kilometres.
    lat1, lon1 = math.radians(float(a["INTPTLAT"])), math.radians(float(a["INTPTLONG"]))
    lat2, lon2 = math.radians(float(b["INTPTLAT"])), math.radians(float(b["INTPTLONG"]))
    step = math.sin((lat2 - lat1) / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin((lon2 - lon1) / 2) ** 2
    return 12742 * math.asin(min(1, math.sqrt(step)))


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Download the official 2026 Census places Gazetteer to {SOURCE}")
    with zipfile.ZipFile(SOURCE) as archive:
        with archive.open(archive.namelist()[0]) as stream:
            rows = list(csv.DictReader(io.TextIOWrapper(stream, encoding="utf-8-sig"), delimiter="|"))

    states = {item["id"]: item["name"] for item in json.loads((ROOT / "src/usStates.json").read_text(encoding="utf-8"))}
    representatives = json.loads((ROOT / "src/regionCities.json").read_text(encoding="utf-8"))
    by_state = defaultdict(list)
    for row in rows:
        state = states.get(row["GEOID"][:2])
        if state:
            row["STATE_NAME"] = state
            row["SHORT_NAME"] = public_name(row)
            by_state[state].append(row)

    records = []
    unmatched = []
    region_counts = defaultdict(Counter)
    anchor_aliases = {
        ("Alabama", "Fort Rucker"): "Fort Novosel",
        ("Georgia", "Cusseta-Chattahoochee County unified government"): "Cusseta",
        ("Massachusetts", "Hyannis"): "Barnstable Town",
        ("Rhode Island", "Middletown"): "Newport",
        ("Rhode Island", "Narragansett"): "Narragansett Pier",
        ("West Virginia", "Ranson corporation"): "Ranson",
    }
    # The Puget Sound grouping includes Olympia despite Centralia having a
    # slightly nearer Census reference point than the Tacoma seed.
    manual_region_overrides = {("Washington", "Olympia"): 1}
    for state, places in by_state.items():
        lookup = defaultdict(list)
        for place in places:
            lookup[normalized(place["SHORT_NAME"])].append(place)
        anchors = []
        for region_index, names in enumerate(representatives[state]):
            matches = []
            for name in names:
                candidates = lookup.get(normalized(anchor_aliases.get((state, name), name)), [])
                if candidates:
                    matches.append(candidates[0])
                else:
                    unmatched.append({"state": state, "regionIndex": region_index, "city": name})
            if not matches:
                raise SystemExit(f"No Census reference place for {state} region {region_index}")
            anchors.append(matches[:2])

        def assigned_region(place: dict) -> int:
            estimated = min(
                range(len(anchors)),
                key=lambda index: min(
                    distance(place, anchor) * (1 + 0.2 * anchor_index)
                    for anchor_index, anchor in enumerate(anchors[index])
                ),
            )
            return manual_region_overrides.get((state, place["SHORT_NAME"]), estimated)

        assignments = {row["GEOID"]: assigned_region(row) for row in places}
        incorporated_counts = Counter(
            assignments[row["GEOID"]] for row in places if row["LSAD"] != "57"
        )
        # In regions without an incorporated Census place, list the named
        # communities rather than displaying an empty regional directory.
        selected = [
            row for row in places
            if row["LSAD"] != "57"
            or state == "Hawaii"
            or incorporated_counts[assignments[row["GEOID"]]] == 0
        ]
        used_slugs = Counter(slug(row["SHORT_NAME"]) for row in selected)
        for place in selected:
            region_index = assignments[place["GEOID"]]
            name = place["SHORT_NAME"]
            city_slug = slug(name)
            if used_slugs[city_slug] > 1:
                city_slug += "-" + place["GEOID"][-5:]
            records.append([
                place["GEOID"], name, state, region_index, city_slug,
                round(float(place["INTPTLAT"]), 5),
                round(float(place["INTPTLONG"]), 5),
                round(float(place["ALAND_SQMI"]), 2),
                "community" if place["LSAD"] == "57" else "incorporated",
                place["NAME"] if place["NAME"] != name else "",
            ])
            region_counts[state][region_index] += 1

    records.sort(key=lambda row: (row[2], row[3], row[1].casefold(), row[0]))
    result = {
        "source": "U.S. Census Bureau 2026 National Places Gazetteer",
        "sourceUrl": "https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.html",
        "assignmentMethod": "Nearest representative place among the existing travel-region seed cities, using Census coordinates",
        "records": records,
    }
    DESTINATION.write_text(json.dumps(result, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    REVIEW.write_text(json.dumps({
        "places": len(records),
        "incorporated": sum(row[8] == "incorporated" for row in records),
        "communitiesInRegionsWithoutCitiesAndHawaii": sum(row[8] == "community" for row in records),
        "regions": {state: dict(counts) for state, counts in region_counts.items()},
        "unmatchedRepresentativeCities": unmatched,
    }, indent=2), encoding="utf-8")
    print(f"Wrote {len(records)} places in {len(region_counts)} states; {len(unmatched)} unmatched representative names")


if __name__ == "__main__":
    main()
