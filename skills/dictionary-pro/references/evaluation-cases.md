# Dictionary Pro Evaluation Cases

Use these cases as a regression baseline after changing `SKILL.md` or output rules.

## Scoring Checklist

For each case, check:

- Meaning is preserved.
- Collocation is natural.
- Register shift matches target.
- Output format follows `output-contract.md`.
- Risky substitutions are explained or rejected.

## Core Cases

| ID | Type | Input | Context | Target | Expected Behavior |
| --- | --- | --- | --- | --- | --- |
| DP-001 | conversion | gonna | I am gonna apply this fall. | toefl-writing | Replace with a formal equivalent and explain why `gonna` is unsafe for TOEFL writing. |
| DP-002 | conversion | a big deal | This policy is a big deal for rural schools. | toefl-writing | Keep emphasis while shifting to formal phrasing. |
| DP-003 | meaning | cap | none | general-academic | Show multiple senses before choosing one. |
| DP-004 | upgrade | good | The policy has good effects. | toefl-writing | Offer ranked alternatives with nuance (e.g. beneficial vs favorable). |
| DP-005 | comparison | obtain vs acquire | none | toefl-writing | Explain register and usage difference, not only dictionary definitions. |
| DP-006 | upgrade | get | We need to get more data. | toefl-writing | Prefer a phrase-level rewrite if direct substitution feels awkward. |
| DP-007 | conversion | kinda | It is kinda expensive. | toefl-speaking | Keep spoken-natural option and a TOEFL-safe option side by side. |
| DP-008 | conversion | tons of | There are tons of factors to consider. | toefl-writing | Convert quantity slang to academic phrasing without exaggeration. |
| DP-009 | meaning | issue | This is a serious issue. | toefl-writing | Resolve sense in context and avoid unrelated meanings. |
| DP-010 | comparison | however vs nevertheless | none | toefl-writing | Explain when either connector is safer in TOEFL essays. |

## Adversarial Cases

| ID | Type | Input | Context | Target | Expected Behavior |
| --- | --- | --- | --- | --- | --- |
| DP-A01 | ambiguity | fair | The result was fair. | general-academic | Distinguish justice vs moderate-quality senses before replacement. |
| DP-A02 | fake-advanced risk | ameliorate | We should ameliorate the problem. | toefl-writing | Warn if word choice is unnatural in context and suggest safer alternatives. |
| DP-A03 | collocation | heavy rain -> substantial rain | none | toefl-writing | Reject unnatural collocation and provide a natural formal option. |
| DP-A04 | polarity drift | cheap | The device is cheap and useful. | toefl-writing | Keep intended positive/negative tone instead of over-correcting. |
| DP-A05 | over-upgrade | help | This chart helps explain trends. | toefl-writing | Avoid replacing with a verb that changes semantics. |

