#!/usr/bin/env python3
"""Check Doefin copy against the house rules in ../rules.json.

Usage:
  python3 check_copy.py draft.md                    # check a file
  pbpaste | python3 check_copy.py -                 # check stdin
  python3 check_copy.py draft.md --channel=social   # web, app, social, email, deck or doc
  python3 check_copy.py draft.md --json             # machine-readable output

Some rules depend on the channel: emoji and exclamation marks are fine on social, for
example. Without --channel every rule applies.

Exit code 0 when nothing is marked `cut`, 1 otherwise. `check` items never fail the
run: they are for Matteo (or the compliance approver) to see, not for the writer to delete.
"""
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
# rules.json sits beside this script in the repo's tools/ folder, and one level up inside the skill folder.
RULES_PATH = next((p for p in (HERE / "rules.json", HERE.parent / "rules.json") if p.exists()), HERE / "rules.json")
SMALL_WORDS = {"a", "an", "and", "as", "at", "but", "by", "for", "in", "of", "on", "or", "the", "to", "vs", "via", "with"}


def load_rules(channel=None):
    data = json.loads(RULES_PATH.read_text())
    rules = []
    for r in data["rules"]:
        if channel and channel in r.get("except", []):
            continue
        # rules.json is shared with the brand book's browser checker, which writes
        # astral code points as \u{1F300}; Python's re wants the characters themselves.
        pattern = re.sub(r"\\u\{([0-9A-Fa-f]+)\}", lambda m: chr(int(m.group(1), 16)), r["match"])
        flags = re.MULTILINE if r.get("case_sensitive") else re.IGNORECASE | re.MULTILINE
        rules.append({**r, "re": re.compile(pattern, flags)})
    return rules, data.get("max_sentence_words", 25)


def strip_markup(text):
    """Drop code fences, inline code, link targets and HTML tags, keeping line numbers."""
    out, fenced = [], False
    for line in text.split("\n"):
        if line.strip().startswith("```"):
            fenced = not fenced
            out.append("")
            continue
        if fenced:
            out.append("")
            continue
        line = re.sub(r"`[^`]*`", "", line)
        line = re.sub(r"!\[([^\]]*)\]", r"\1", line)
        line = re.sub(r"\]\([^)]*\)", "]", line)
        line = re.sub(r"<[^>]+>", "", line)
        out.append(line)
    return out


def title_case(line):
    words = re.findall(r"[A-Za-z][A-Za-z'’-]*", line)
    if len(words) < 3 or len(words) > 12 or line.rstrip().endswith((".", "?", ":", ",")):
        return False
    big = [w for w in words[1:] if w.lower() not in SMALL_WORDS]
    return len(big) >= 2 and all(w[0].isupper() for w in big) and not all(w.isupper() for w in big)


def check(text, channel=None):
    rules, max_words = load_rules(channel)
    lines = strip_markup(text)
    findings = []
    for n, line in enumerate(lines, 1):
        if not line.strip():
            continue
        for r in rules:
            for m in r["re"].finditer(line):
                findings.append({"line": n, "kind": r["kind"], "found": m.group(0).strip() or m.group(0), "say": r["say"]})
        heading = re.match(r"^\s*#{1,6}\s+(.*)$", line)
        if heading and title_case(heading.group(1)):
            findings.append({"line": n, "kind": "style", "found": heading.group(1).strip(), "say": "sentence case for headings"})
        body = re.sub(r"^\s*([#>*-]|\d+\.|\|)\s*", "", line)
        for sentence in re.split(r"(?<=[.?!])\s+", body):
            count = len(re.findall(r"[\w’'%.,+−-]+", sentence))
            if count > max_words and "|" not in sentence:
                findings.append({"line": n, "kind": "style", "found": sentence[:60] + ("…" if len(sentence) > 60 else ""),
                                 "say": f"{count} words; split it (aim for under {max_words})"})
    return findings


def main(argv):
    if len(argv) < 2:
        print(__doc__.strip())
        return 2
    src = argv[1]
    channel = next((a.split("=", 1)[1] for a in argv if a.startswith("--channel=")), None)
    text = sys.stdin.read() if src == "-" else Path(src).read_text()
    findings = check(text, channel)
    if "--json" in argv:
        print(json.dumps(findings, ensure_ascii=False, indent=1))
    else:
        order = {"cut": 0, "check": 1, "style": 2}
        for f in sorted(findings, key=lambda f: (order[f["kind"]], f["line"])):
            print(f'{f["kind"].upper():5}  line {f["line"]:>4}  "{f["found"]}"  ->  {f["say"]}')
        counts = {k: sum(f["kind"] == k for f in findings) for k in order}
        print(f'\n{counts["cut"]} to cut, {counts["check"]} for Matteo to see, {counts["style"]} style notes.')
    return 1 if any(f["kind"] == "cut" for f in findings) else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
