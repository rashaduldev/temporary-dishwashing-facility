#!/usr/bin/env python3
"""Validate release evidence completeness; does not execute security tests."""
import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

CONTROL_IDS = (
    "ARCH", "AUTH", "RULES", "AUTHZ", "TENANT", "SESSION", "CSRF",
    "CORS_HEADERS", "COOKIE_CONSENT", "RATE", "APP_CHECK", "INPUT",
    "STORAGE", "INTEGRATIONS", "SECRETS", "DEPLOY", "OBSERVE", "RECOVERY", "SUPPLY",
)
BASELINE = {"ARCH", "RULES", "RATE", "INPUT", "SECRETS", "DEPLOY", "OBSERVE", "SUPPLY"}
STATUSES = {"pass", "fail", "blocked", "not_tested", "not_applicable"}


def nonempty(value):
    return isinstance(value, str) and bool(value.strip())


def valid_time(value):
    if not nonempty(value):
        return False
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        return parsed.tzinfo is not None and parsed <= datetime.now(timezone.utc)
    except (ValueError, OverflowError):
        return False


def validate(report, root):
    errors = []
    if not isinstance(report, dict):
        return ["Report must be an object"]
    if type(report.get("schema_version")) is not int or report["schema_version"] != 1:
        errors.append("schema_version must be 1")
    for field in ("project", "source_revision", "environment"):
        if not nonempty(report.get(field)):
            errors.append(f"Missing {field}")
    if not valid_time(report.get("generated_at")):
        errors.append("generated_at must be a past/present timezone-aware ISO timestamp")

    def artifacts(items, label):
        if not isinstance(items, list) or not items:
            errors.append(f"{label}: nonempty evidence list required")
            return
        for item in items:
            if not nonempty(item) or Path(item).is_absolute():
                errors.append(f"{label}: evidence must be relative file paths")
                continue
            try:
                target = (root / item).resolve()
                target.relative_to(root.resolve())
                if not target.is_file() or target.stat().st_size == 0:
                    errors.append(f"{label}: evidence file missing or empty: {item}")
            except (ValueError, OSError, RuntimeError):
                errors.append(f"{label}: evidence must resolve inside the report directory")

    controls = report.get("controls")
    if not isinstance(controls, list):
        errors.append("controls must be a list")
        controls = []
    seen = set()
    for index, control in enumerate(controls):
        if not isinstance(control, dict):
            errors.append(f"Control {index} must be an object")
            continue
        cid = control.get("id")
        if not isinstance(cid, str) or cid not in CONTROL_IDS:
            errors.append(f"Control {index}: unknown ID")
            continue
        if cid in seen:
            errors.append(f"{cid}: duplicate control")
        seen.add(cid)
        status = control.get("status")
        if not isinstance(status, str) or status not in STATUSES:
            errors.append(f"{cid}: invalid status")
        elif status in {"fail", "blocked", "not_tested"}:
            errors.append(f"{cid}: {status}")
        elif status == "not_applicable":
            if cid in BASELINE:
                errors.append(f"{cid}: baseline control cannot be not_applicable")
            if not nonempty(control.get("reason")):
                errors.append(f"{cid}: non-applicability reason required")
            artifacts(control.get("evidence"), cid)
        elif status == "pass":
            locations = control.get("implementation")
            if not isinstance(locations, list) or not locations or not all(map(nonempty, locations)):
                errors.append(f"{cid}: implementation locations required")
            for field in ("verification", "expected", "observed"):
                if not nonempty(control.get(field)):
                    errors.append(f"{cid}: missing {field}")
            if not valid_time(control.get("executed_at")):
                errors.append(f"{cid}: valid executed_at required")
            artifacts(control.get("evidence"), cid)
    for missing in sorted(set(CONTROL_IDS) - seen):
        errors.append(f"Missing control: {missing}")

    findings = report.get("findings")
    if not isinstance(findings, list):
        errors.append("findings must be a list (empty only if none found)")
        findings = []
    finding_ids = set()
    for index, finding in enumerate(findings):
        label = f"Finding {index}"
        if not isinstance(finding, dict):
            errors.append(f"{label}: must be an object")
            continue
        fid = finding.get("id")
        if not nonempty(fid):
            errors.append(f"{label}: missing ID")
        elif fid in finding_ids:
            errors.append(f"{label}: duplicate ID")
        else:
            finding_ids.add(fid)
        severity = finding.get("severity")
        if not isinstance(severity, str) or severity not in {"critical", "high", "medium", "low", "info"}:
            errors.append(f"{label}: invalid severity")
        if type(finding.get("resolved")) is not bool:
            errors.append(f"{label}: resolved must be boolean")
        for field in ("summary", "owner", "remediation"):
            if not nonempty(finding.get(field)):
                errors.append(f"{label}: missing {field}")
        if severity in ("critical", "high") and finding.get("resolved") is not True:
            errors.append(f"{label}: unresolved {severity}")
        if finding.get("resolved") is True:
            artifacts(finding.get("retest_evidence"), label)
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("report", type=Path)
    args = parser.parse_args()
    try:
        report = json.loads(args.report.read_text(encoding="utf-8"))
        errors = validate(report, args.report.resolve().parent)
    except (OSError, ValueError) as exc:
        print(f"INVALID REPORT: {exc}")
        return 2
    if errors:
        print("EVIDENCE INCOMPLETE — release readiness rejected")
        for error in errors:
            print(f"- {error}")
        return 1
    print("Evidence structure complete. Review artifacts; this is not a security certification.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
