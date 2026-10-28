#!/usr/bin/env python3
"""按 jobs.json 批量调用 Seedream 生图。job: {out, prompt, ref[], size, model}"""

from __future__ import annotations

import json
import pathlib
import sys
import time

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from seedream_image import HERE, download, generate, read_key  # noqa: E402

PRO_MODEL = "doubao-seedream-5-0-pro-260628"


def main() -> None:
    jobs_path = pathlib.Path(sys.argv[1])
    only = sys.argv[2] if len(sys.argv) > 2 else None
    jobs = json.loads(jobs_path.read_text(encoding="utf-8"))
    key = read_key()
    ok = fail = 0
    for i, job in enumerate(jobs, 1):
        name = job.get("name", pathlib.Path(job["out"]).stem)
        if only and only not in name:
            continue
        out = pathlib.Path(job["out"])
        if not out.is_absolute():
            out = HERE / out
        if out.exists() and out.stat().st_size > 10_000:
            print(f"[{i}] skip (exists) {name}")
            ok += 1
            continue
        for attempt in range(1, 4):
            t0 = time.time()
            try:
                url = generate(job["prompt"], job.get("model", PRO_MODEL),
                               job.get("size", "1024x1536"), key, job.get("ref") or None)
                download(url, out)
                print(f"[{i}] OK  {name:16} {out.stat().st_size // 1024:4d} KB  {time.time() - t0:.0f}s")
                ok += 1
                break
            except SystemExit:
                raise
            except Exception as exc:  # noqa: BLE001
                print(f"[{i}] retry{attempt} {name}: {type(exc).__name__} {exc}")
                time.sleep(3 * attempt)
        else:
            print(f"[{i}] FAIL {name}")
            fail += 1
        time.sleep(1.5)
    print(f"\ndone: ok={ok} fail={fail}")
    if fail:
        sys.exit(1)


if __name__ == "__main__":
    main()
