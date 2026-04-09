#!/usr/bin/env python3
"""Download full JSON session and speaker data from Microsoft Build API."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

DEFAULT_SESSIONS_URL = "https://api-v2.build.microsoft.com/api/session/all"
DEFAULT_SPEAKERS_URL = "https://api-v2.build.microsoft.com/api/speaker/all"


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
        description="Download full JSON data from the Build sessions and speakers API."
    )
    parser.add_argument(
        "--sessions-url",
        default=DEFAULT_SESSIONS_URL,
        help="Sessions API URL (default: %(default)s)",
    )
    parser.add_argument(
        "--speakers-url",
        default=DEFAULT_SPEAKERS_URL,
        help="Speakers API URL (default: %(default)s)",
    )
    parser.add_argument(
        "--sessions-output",
        default="public/sessions_all.json",
        help="Sessions output JSON file path (default: %(default)s)",
    )
    parser.add_argument(
        "--speakers-output",
        default="public/speakers_all.json",
        help="Speakers output JSON file path (default: %(default)s)",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=60,
        help="HTTP timeout in seconds (default: %(default)s)",
    )

    args = parser.parse_args()
    sessions_path = Path(args.sessions_output).resolve()
    speakers_path = Path(args.speakers_output).resolve()

    try:
        print("Downloading sessions...")
        sessions = download_json(args.sessions_url, args.timeout)
        print(f"  Got {len(sessions) if isinstance(sessions, list) else '?'} sessions")
    except (HTTPError, URLError, TimeoutError, RuntimeError) as exc:
        print(f"Sessions download failed: {exc}", file=sys.stderr)
        return 1

    try:
        print("Downloading speakers...")
        speakers = download_json(args.speakers_url, args.timeout)
        print(f"  Got {len(speakers) if isinstance(speakers, list) else '?'} speakers")
    except (HTTPError, URLError, TimeoutError, RuntimeError) as exc:
        print(f"Speakers download failed: {exc}", file=sys.stderr)
        return 1

    sessions_path.parent.mkdir(parents=True, exist_ok=True)
    sessions_path.write_text(json.dumps(sessions, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Saved sessions to: {sessions_path}")

    speakers_path.parent.mkdir(parents=True, exist_ok=True)
    speakers_path.write_text(json.dumps(speakers, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Saved speakers to: {speakers_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
