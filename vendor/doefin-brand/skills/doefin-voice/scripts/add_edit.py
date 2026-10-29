#!/usr/bin/env python3
"""Record one of Matteo's edits in brand/matteo/edits.md.

An edit is a draft and the version Matteo wanted instead. Recording it is how the voice
model learns: `thinking.md` cites these entries, and the agents read them as examples.

Usage:
  python3 tools/add_edit.py --where "LinkedIn post on hashprice" --before draft.txt --after his.txt
  python3 tools/add_edit.py --where "Homepage FAQ" --before draft.txt --verdict Cut --note "Not needed."
  ... --teaches "One line on what it shows"   # otherwise the entry says TODO for you to fill in
  ... --date "3 Nov 2026"                     # default: today
  ... --dry-run                               # print the entry and the diff, write nothing

`--before` and `--after` take a file path, or `-` for stdin (only one of them can be stdin).
The script finds brand/matteo/edits.md in the doefin-brand repository above the current
folder (or pass --repo). Inside a vendored copy or an installed skill it prints the entry
instead: add it to the brand repository, never to the copy.
"""
import argparse
import datetime
import difflib
import re
import sys
from pathlib import Path

MARKER = "## Rules in his own words"
LATER = "## Later edits"


def read(src):
    return (sys.stdin.read() if src == "-" else Path(src).read_text()).strip()


def quote(text):
    return "\n".join("> " + line if line.strip() else ">" for line in text.splitlines())


def find_edits(repo):
    starts = [Path(repo)] if repo else [Path.cwd(), *Path.cwd().parents]
    for base in starts:
        for cand in (base / "brand" / "matteo" / "edits.md", base / "doefin-brand" / "brand" / "matteo" / "edits.md"):
            if cand.exists() and "vendor" not in cand.parts:
                return cand
    return None


def word_diff(before, after):
    a, b = before.split(), after.split()
    out = []
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(a=a, b=b, autojunk=False).get_opcodes():
        if op == "equal":
            continue
        gone, came = " ".join(a[i1:i2]), " ".join(b[j1:j2])
        out.append({"replace": f'  "{gone}"  ->  "{came}"', "delete": f'  cut: "{gone}"', "insert": f'  added: "{came}"'}[op])
    return out


def main():
    ap = argparse.ArgumentParser(description="Record one of Matteo's edits.")
    ap.add_argument("--where", required=True, help="where the copy appears, e.g. 'LinkedIn post on hashprice'")
    ap.add_argument("--before", required=True)
    ap.add_argument("--after")
    ap.add_argument("--verdict", choices=["Keep", "Cut"])
    ap.add_argument("--note", help="Matteo's own comment, quoted in the entry")
    ap.add_argument("--teaches", default="TODO: one or two lines on what this edit shows about how he thinks.")
    ap.add_argument("--date", default=datetime.date.today().strftime("%-d %b %Y"))
    ap.add_argument("--repo")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    if not args.after and not args.verdict:
        ap.error("give --after, or --verdict Keep or Cut")

    before = read(args.before)
    after = read(args.after) if args.after else ""
    path = find_edits(args.repo)
    text = path.read_text() if path else ""
    numbers = [int(n) for n in re.findall(r"^### E(\d+) ", text, flags=re.M)]
    number = (max(numbers) + 1) if numbers else 0

    title = f"### E{number:02d} · {args.where} · {args.date}" + (f" · {args.verdict}" if args.verdict else "")
    if args.verdict == "Cut":
        after_block = "> Cut." + (f' "{args.note}"' if args.note else "")
    elif args.verdict == "Keep" and not after:
        after_block = "> Kept as written."
    else:
        after_block = quote(after) + (f'\n>\n> His note: "{args.note}"' if args.note else "")
    entry = f"{title}\n\n**Before**\n{quote(before)}\n\n**After**\n{after_block}\n\n**What it teaches:** {args.teaches}\n"

    print(entry)
    if after:
        changes = word_diff(before, after)
        print("What changed, word by word:" if changes else "No wording changed.")
        print("\n".join(changes))
    if args.dry_run:
        return 0
    if not path:
        print("\nNo brand/matteo/edits.md found in a doefin-brand checkout. Add the entry above to the brand repository.",
              file=sys.stderr)
        return 1
    if LATER not in text:
        text = text.replace(MARKER, f"{LATER}\n\n{MARKER}") if MARKER in text else text.rstrip() + f"\n\n{LATER}\n"
    text = text.replace(MARKER, entry + "\n" + MARKER) if MARKER in text else text.rstrip() + "\n\n" + entry
    path.write_text(text)
    print(f"\nAdded E{number:02d} to {path}. Fill in 'What it teaches', then follow the learn steps in skills/doefin-voice/SKILL.md.",
          file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
