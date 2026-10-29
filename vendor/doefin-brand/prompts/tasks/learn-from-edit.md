# Task: learn from one of Matteo's edits

Use this in a chat assistant when you cannot run the learner agent. Paste both versions, then send with the system prompt.

Matteo edited a draft. Where it appears: [where]. Date: [date].

What we sent him:
[paste the draft]

What he changed it to, or his comment word for word:
[paste his version]

1. Write the entry for `brand/matteo/edits.md` in this exact shape, with the next E-number ([E-number]):

   ### E[nn] · [where] · [d Mon yyyy]

   **Before**
   > [the draft]

   **After**
   > [his version]

   **What it teaches:** [one or two lines: what he changed, and what that shows about how he reasons]

2. Say which habit in "How Matteo thinks when he writes" it confirms, or that it is new.
3. If it contradicts a settled decision, quote both and say so. Do not resolve it yourself.
4. If it is a word or phrase he always replaces, propose a checker rule as `{"kind": "style", "match": "<regex>", "say": "<what to write instead>"}`.

Quote him; never put words in his mouth. Someone then adds the entry to the doefin-brand repository and runs `python3 scripts/build.py`.
