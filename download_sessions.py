#!/usr/bin/env python3
"""Download full JSON session data from Microsoft Build API."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

DEFAULT_URL = "https://api-v2.build.microsoft.com/api/session/all"


def download_json(url: str, timeout: int) -> object:
    """Fetch and parse JSON from the given URL."""
    req = Request(
        url,
        headers={
            "Accept": "application/json",
            "User-Agent": "build-session-downloader/1.0",
        },
    )

    with urlopen(req, timeout=timeout) as response:
        status_code = response.getcode()
        if status_code and status_code >= 400:
            raise RuntimeError(f"Server returned HTTP {status_code}")

        body = response.read()

    try:
        return json.loads(body)
    except json.JSONDecodeError as exc:
        raise RuntimeError("Response was not valid JSON") from exc


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Download full JSON data from the Build sessions API."
    )
    parser.add_argument(
        "--url",
        default=DEFAULT_URL,
        help="Source URL (default: %(default)s)",
    )
    parser.add_argument(
        "--output",
        default="sessions_all.json",
        help="Output JSON file path (default: %(default)s)",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=60,
        help="HTTP timeout in seconds (default: %(default)s)",
    )

    args = parser.parse_args()
    output_path = Path(args.output).resolve()

    try:
        data = download_json(args.url, args.timeout)
    except (HTTPError, URLError, TimeoutError, RuntimeError) as exc:
        print(f"Download failed: {exc}", file=sys.stderr)
        return 1

    output_path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Saved JSON to: {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
