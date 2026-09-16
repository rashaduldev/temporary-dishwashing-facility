import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent.parent
MEDIA = ROOT / "public" / "location-media"
MANIFEST = ROOT / "src" / "locationPhotos.json"
AUDIT = ROOT / "audit" / "location-photo-sources.json"


def optimize(photo: dict) -> None:
    source = ROOT / "public" / photo["image"].lstrip("/")
    destination = source.with_suffix(".webp")
    with Image.open(source) as image:
        image = image.convert("RGB")
        image.thumbnail((1280, 1280), Image.Resampling.LANCZOS)
        image.save(destination, "WEBP", quality=84, method=6)
        photo["width"], photo["height"] = image.size
    if source != destination:
        source.unlink()
    photo["image"] = f"/location-media/{destination.name}"


manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
for collection in (manifest["states"], manifest["regions"]):
    for item in collection.values():
        optimize(item)

MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
audit = json.loads(AUDIT.read_text(encoding="utf-8"))
audit["states"] = manifest["states"]
audit["regions"] = manifest["regions"]
AUDIT.write_text(json.dumps(audit, indent=2) + "\n", encoding="utf-8")

referenced = {
    Path(item["image"]).name
    for collection in (manifest["states"], manifest["regions"])
    for item in collection.values()
}
for candidate in MEDIA.iterdir():
    if candidate.name not in referenced:
        candidate.unlink()

print(f"Optimized {len(referenced)} uncropped location photos.")
