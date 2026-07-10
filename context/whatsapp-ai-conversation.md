# WhatsApp AI Conversation (debounce + memory + procedure knowledge)

Upgrade to the WhatsApp AI assistant that adds three things: **per-number chat
memory**, **rich procedure knowledge** (prices, FAQs, recovery, alternatives),
and a **debounce** that batches fragmented incoming messages into one coherent
reply. The conversational logic lives in a dedicated **true n8n sub-workflow**;
the original WhatsApp workflow just calls it.

Status: **live and working** (fragments assemble with newlines, memory persists,
knowledge answers are accurate). Remaining polish is in the TODO at the bottom.

## Why decouple incoming from outgoing

Patients in Jordan often message in fragments — `أهلين دكتور`, then `كيفكم`,
then the actual question, each as a separate WhatsApp message. Replying to each
fragment is incoherent. WhatsApp's Cloud API does **not** deliver inbound typing
indicators, so we can't literally wait for "stopped typing." Instead we
**debounce**: buffer fragments, wait for a quiet window, then answer the whole
assembled burst once.

## Architecture

```
Main workflow (Dads Clinic-WhatsApp AI Assistant, XlYzvScd6xm3xlBI)
  WhatsApp Trigger → … → Is Verification Code? ──false──▶ Call sub-workflow (fire-and-forget)
                                                            (Execute Sub-workflow node,
                                                             waitForSubWorkflow = false)

Sub-workflow (Dads Clinic-WhatsApp AI Conversation, 0qKnkvhnaVmohne7)
  Execute Workflow Trigger (inputs: phone, text, msg_id, name, quoted_id, forwarded)
   → Normalize Input
   → Append Fragment      (upsert into pending_chat_fragments, match on msg_id)
   → Wait 15s
   → Get Fragments        (all rows for this phone, ordered createdAt ASC)
   → Claim & Assemble     (winner-check; loser returns []; also emits per-fragment {wamid,text})
        ├─▶ Load History → Build Inbound Log → Log Inbound (→ Log Messages subflow, sync)
        │     → Load Knowledge → Build Prompt (synthesise view + resolve quoted_id/forwarded)
        │     → Clinic AI Assistant (Haiku, no parser) → Prepare Reply (defensive JSON parse)
        │     → Send WhatsApp Reply → Build Outbound Log → Log Outbound (→ Log Messages subflow)
        │     → Log to Telegram
        │     └▶ (Prepare Reply also) Switch Classification → Send to Doctor / Send to Assistant
        └─▶ Split Consumed Ids → Delete Fragment   (delete consumed rows by msg_id)

Reusable logger (Dads Clinic-Log Messages to History, 1wAcR92r1dWktqzH)
  Execute Workflow Trigger (inputs: phone, messages[JSON]) → Load History → Append & Trim(40) → Save History
```

The sub-workflow is a **real n8n sub-workflow** (Execute Workflow Trigger), not a
webhook. It's invoked **fire-and-forget** (`waitForSubWorkflow: false`) so the
parent returns immediately and the 15s `Wait` runs in the sub-workflow's own
top-level execution (where `Wait` resumes reliably). This was a deliberate choice
— see the "webhook vs true subflow" reasoning: a blocking Execute-Sub-workflow
call would hang the parent for 15s/message and Wait-resume is unreliable inside a
synchronous sub-execution; `waitForSubWorkflow: false` gives both fire-and-forget
*and* a reliable Wait.

## Debounce mechanics (last-writer-wins)

Each inbound fragment spawns one sub-workflow execution:

1. **Append Fragment** — `upsert` into `pending_chat_fragments` matching on
   `msg_id`. Upsert (not insert) makes it **idempotent**: a WhatsApp webhook
   redelivery (Cloud API is at-least-once) overwrites the same row instead of
   duplicating the fragment.
2. **Wait 15s.**
3. **Get Fragments** — read all rows for this phone (ordered by `createdAt`).
4. **Claim & Assemble** — the winner is the execution whose fragment is the
   **newest** row (`newest.msg_id === myMsgId`). The winner joins all fragment
   texts with `\n` and lists their `msg_id`s as `consumedMsgIds`. A **loser**
   (a newer fragment arrived during its wait) returns `[]` and does nothing — its
   text stays in the buffer and is folded into the eventual winner's reply.
5. **Delete on consume** — winner deletes exactly the rows it read
   (Split Consumed Ids → Delete Fragment by `msg_id`), so the buffer stays tiny.
   Losers delete nothing. Only the newest deletes → no lost fragments.

Net: a burst of fragments → one assembled reply. The buffer never grows (rows are
deleted on consume), so no scaling/retention concern for `pending_chat_fragments`.

### ⚠️ The `msg_id` gotcha (root cause of an early bug)

`msg_id` **must** be the real WhatsApp message id (`messages[0].id`), which is
unique per message. If it's ever wired to something constant-per-sender (e.g. the
contact **profile name**), every fragment collides on the same upsert row and the
winner-check (`newest.msg_id === myMsgId`) is always true — fragments overwrite
each other and get dropped. The parent's Execute-Sub-workflow field mapping had
`msg_id` and `name` swapped once; the correct mapping is:

- `phone`  = `{{ $('Extract Message').item.json.phone }}`
- `text`   = `{{ $('Extract Message').item.json.text }}`
- `msg_id` = `{{ $('WhatsApp Trigger').item.json.messages[0].id }}`  ← the message id
- `name`   = `{{ $('Extract Message').item.json.name }}`

## Memory (per phone) — granular canonical record

`chat_history` is the **canonical conversation record**: one row per phone, `history` =
a JSON array of **individual messages** (not assembled bursts), each
`{wamid, role, text, ts}`, trimmed to the **last 40** messages. This is the source of
truth that also powers reply-resolution (below).

- **Reading for the LLM:** `Build Prompt` loads the row and **synthesises** a clean view
  — it merges consecutive same-voice messages into `المريض:` / `المساعد:` turns and
  **strips wamids**. The model never sees wamids or the raw per-message granularity.
- **Writing:** all writes go through the reusable **`Log Messages to History`** subflow
  (`1wAcR92r1dWktqzH`) — load blob → append a batch → trim 40 → upsert. The AI subflow
  calls it twice per turn: **Log Inbound** (the user's fragments, role=user) right after
  `Load History` — so it's logged even if the reply later fails — and **Log Outbound**
  (the bot reply + its real send-response wamid, role=assistant) **after** a successful
  `Send`. The old inline `Prepare Reply`→`Save History` path is gone.
- `updatedAt` (system column) auto-bumps and drives the 90-day prune. Backward-compatible:
  old `{role,content}` entries without wamids still render (they just can't be reply-targets).

**Patient-initiated reset.** A `reset` intent lets patients clear their own history: messages
like `إلى اللقاء` / `أريد بدء محادثة جديدة` / `امسح المحادثة` classify as `reset`; `Prepare Reply`
overrides the reply with a fixed confirmation, and a `Log to Telegram → Is Reset? → Clear History`
tail deletes the whole `chat_history` row (placed after inbound+outbound logging so there's no
race; it wipes the goodbye turn too). Next message starts fresh (re-intro). Disclosed on the
**`/data`** page (`src/pages/data.md`, "حفظ البيانات وحذفها") as a data-control option — that's
the data-retention/deletion page, not the general `/privacy` policy. Also injected: current Amman
time (`nowAmman`) into the system prompt for "بعد كم دقيقة" answers.

## Replies & forwards (WhatsApp quote handling)

The WhatsApp webhook gives only `messages[0].context.id` (the **wamid** of the quoted
message) — **never the quoted text** — and there is no "fetch message by id" API. Because
a reply always targets a message *in this same conversation*, we resolve it from our own
canonical record instead of rebuilding a client:

- **Parent** extracts `quoted_id = messages[0].context?.id` and `forwarded =
  messages[0].context?.forwarded` and passes both to the AI subflow (via the
  `Call …AI Conversation` node's input mapping).
- **Build Prompt** looks up `quoted_id` among the loaded messages' wamids. On a hit it
  prepends a lead-in to the current user text — `[ردًّا على رسالة المساعد: «…»]` — so the
  model answers the quoted message in context (resolves both patient- and bot-authored
  quotes, since both voices are logged with wamids). Miss (older than the 40-msg window) →
  `[ردًّا على رسالة سابقة]`.
- **Forwards** are self-contained (the body is inline in the webhook); `forwarded=true`
  just prepends a `(رسالة محوّلة)` tag so the model knows it isn't the patient's own words.

**Canonical-record wiring — other senders.** Each outbound WhatsApp message from any workflow
should be logged so patients can reply to it. Pattern for a **template** sender: the body lives
in Meta, so the calling workflow reconstructs a human-readable text (template body with its
params substituted; non-text messages get a short Arabic description) and calls
`Log Messages to History` after a successful send, guarded on a returned wamid, keyed on the
send response's `contacts[0].wa_id`.
- ✅ **Send Reminders (`WiqM8fag3FvWvW6t`)** — done. Three `Build … Log` + `Log …` node pairs
  hang off `Send Notifications` (the `booking_reminder` template, real body rendered),
  `Send Location Message` (logged as "أرسلنا لكم موقع العيادة على خرائط جوجل."), and
  `Send Conferencing Link` (logged as "أرسلنا لكم رابط الدخول إلى موعد الاستشارة عن بُعد.").
  The 0.5-min `Wait` before the location/link branch naturally serialises the two log writes.
- ✅ **Cal.com Notifications (`n1xrgJXoX6d74bjo`)** — done. All 8 outbound messages logged via
  `Build … Log`→`Log …` pairs: clinic confirmation (`booking_clinic_completed`, sent via an
  **httpRequest** node for its location header), remote confirmation, cancellation by
  doctor/patient, reschedule by doctor/patient (from→to, `dts[1]/tss[1]`→`dts[0]/tss[0]`),
  meeting-started, and the standalone location pin (logged as a description). Date/time pulled
  from the `أضف معلوماتٍ إضافية` set node (`arabic_date_strings`, `time_strings`,
  `' timezone_string'` — **leading space** in that key).

**Template bodies:** fetch the real Arabic bodies from the Meta Graph API rather than guessing —
`GET /{WA_ACCOUNT_ID}/message_templates?fields=name,language,components` with a
`Bearer $WA_ACCESS_TOKEN` (both in the repo's `.envrc`; never print the token). The rendered
log text substitutes `{{1}}`/`{{2}}`/… and strips the `*bold*` markers. Only messages sent
**after** this wiring are logged, so replying to a confirmation received earlier still won't
resolve.

**Blob concurrency** (multiple workflows appending to one phone's blob can race and lose a
message) is **accepted for v1** given clinic volume.

## Output parsing (no structured parser)

The agent runs with `hasOutputParser: false`; it's instructed to emit
`{"intent","reply"}` JSON, and `Prepare Reply` parses **defensively** (first-`{` to
last-`}` slice → `JSON.parse`, falling back to `intent:'info'` + raw text). This replaced
the langchain structured output parser, whose "Model output doesn't fit required format"
throw would leave the patient with **no reply at all**.

## Procedure knowledge (auto-synced digest)

- **Endpoint:** `src/pages/whatsapp-context.md.ts` → `/whatsapp-context.md` — a
  condensed, metadata-focused digest of **all** procedures (facts, candidate,
  contraindications, emergency signs, alternatives, hand-authored FAQ), grouped by
  category, reusing `src/utils/procedure.ts` helpers. Deployed to production.
- **Refresh:** the `Dads Clinic-Refresh Knowledge` workflow pulls the endpoint
  daily and upserts it into the `clinic_knowledge` table (one row, `key=procedures`).
  `Build Prompt` injects that row's `content` into the system prompt. So updating a
  procedure on the site propagates to the bot within a day, no workflow edits.
- Verified accurate live: the bot quoted exact `cost`/recovery values from the
  procedure data (600 / 1000–1200 / 1200 JD for the fistula procedures, etc.).

## Inspecting live data (chat_history etc.) — SSH path

The n8n instance runs on **SQLite** at `/root/.n8n/database.sqlite` on the `n8n` LXC.
When the Jordan VPN is down, reach it by jumping through proxmox (SSH alias `n8n.proxmox`,
which `ProxyJump`s via `proxmox` → 92.65.183.123). DataTables are stored as
`data_table_user_<tableId>` tables:

- `chat_history` → `data_table_user_gsAdL9PoCUSCk2aG`
- `pending_chat_fragments` → `data_table_user_5S97YF2YvHeXqlfX`
- `clinic_knowledge` → `data_table_user_k1r4PvN2Yws3AfmO`

Read a phone's memory:
```bash
ssh n8n.proxmox 'sqlite3 /root/.n8n/database.sqlite \
  "SELECT phone, updatedAt, history FROM data_table_user_gsAdL9PoCUSCk2aG;"'
```
This is how the "conversation restarted" report was diagnosed: the row held the **full**
transcript correctly saved+loaded, proving memory works and the fault was the prompt
(re-intro + no topic continuity), not storage. `sqlite3` is installed on the host.

### ⚠️ Editing the **parent** workflow (webhook-triggered) — CLI + restart, not the MCP

The MCP `update_workflow` needs full SDK code, but `get_workflow_details` **strips
credential bindings** — so reconstructing the parent that way would silently drop the
WhatsApp/Telegram/Anthropic/httpBearer creds and break verification + media. For a
**surgical** parent edit, use the host n8n CLI, which preserves everything:
```bash
ssh n8n.proxmox 'n8n export:workflow --id=XlYzvScd6xm3xlBI --output=/tmp/p.json --pretty'
# edit /tmp/p.json (only the node you need)…
ssh n8n.proxmox 'n8n import:workflow --input=/tmp/p.json'
ssh n8n.proxmox 'n8n update:workflow --id=XlYzvScd6xm3xlBI --active=true'
ssh n8n.proxmox 'systemctl restart n8n'   # REQUIRED — CLI edits don't hot-reload
```
Gotchas learned the hard way: (1) `import:workflow` **deactivates** the workflow ("Remember
to activate later") — always re-`--active=true`; (2) CLI changes only take effect after
`systemctl restart n8n` (healthy again in ~6s); (3) use a **quoted** heredoc (`<<'PY'`) for
any Python edit or bash will command-substitute the `$('Node')` expressions inside n8n
expression strings. `/tmp/parent.json` from the export doubles as your rollback.

## n8n resources

**Workflows:**

| Workflow | ID | Purpose |
|----------|------|---------|
| Dads Clinic-WhatsApp AI Conversation | `0qKnkvhnaVmohne7` | The sub-workflow (debounce + memory + knowledge + reply/forward resolution + logging + routing) |
| Dads Clinic-Log Messages to History | `1wAcR92r1dWktqzH` | Reusable canonical logger — append a batch of `{wamid,role,text}` to a phone's blob, trim 40. Call after a successful send. |
| Dads Clinic-Refresh Knowledge | `M44hFxLWCaqrfWO8` | Daily: `/whatsapp-context.md` → upsert `clinic_knowledge` |
| Dads Clinic-Prune Chat History | `sR5IMxyWTvRWyODM` | Daily: delete `chat_history` rows untouched 90+ days |
| Dads Clinic-WhatsApp AI Assistant | `XlYzvScd6xm3xlBI` | Parent — calls the sub-workflow (now also passes `quoted_id`/`forwarded`) on the non-verification text path |

**DataTables** (project `EEkAWaSS5y3K8o82`):

| Table | ID | Columns (besides system id/createdAt/updatedAt) |
|-------|------|------|
| `pending_chat_fragments` | `5S97YF2YvHeXqlfX` | `phone`, `text`, `msg_id` |
| `chat_history` | `gsAdL9PoCUSCk2aG` | `phone`, `history` (JSON, last **40 individual messages** `{wamid,role,text,ts}`) |
| `clinic_knowledge` | `k1r4PvN2Yws3AfmO` | `key`, `content` |

> **Note:** `chat_history` was originally `CMhFxcd6i059Xx8w`; it was deleted by
> mistake and recreated as `gsAdL9PoCUSCk2aG`. The table IDs are **hardcoded** in
> every workflow's DataTable nodes — when a table is recreated, repoint **all** of
> them: `Load History` / `Save History` in the conversation + logger subflows, **and
> both** DataTable nodes (`Get All History` **and** `Delete Stale Row`) in
> `Prune Chat History`. The Prune workflow was missed at first and its 4 AM job errored
> for days ("Could not find the data table") — grep the n8n submodule (or live DB) for a
> recreated id to catch every reference. (Fixed 2026-07: both Prune nodes repointed to
> `gsAdL9PoCUSCk2aG`, and its `Delete Stale Row` filter — which had a `keyValue` with no
> `keyName` — now deletes by `phone`.)

**Decisions (locked with the user):** buffer store = n8n DataTable; debounce
window = 15s; chat-history retention = 90 days inactivity; knowledge = static
auto-synced digest; sub-workflow = true Execute-Workflow-Trigger, fire-and-forget.
Reply/forward infra (locked): **enriched blob** (no row-per-message table); canonical
record = all bot messages logged too (deferred wiring for other senders); logging via one
reusable subflow; **inbound logged always, outbound only after a successful send**; blob
write-race **accepted for v1**; history trim **40 messages**; pricing **may be quoted**.

## SDK note & where each workflow's source of truth lives

Two of the workflows were authored via the n8n MCP SDK and **have a checked-in SDK source**
(the canonical, hand-editable source of truth — edit it, then `update_workflow` + `publish`):

- `Dads Clinic-WhatsApp AI Conversation` → `context/whatsapp-ai-conversation.sdk.js`
- `Dads Clinic-Log Messages to History` → `context/log-messages-to-history.sdk.js`

The other workflows I wired into the logger — **`Send Reminders` and `Cal.com Notifications`**,
and the **parent** (`WhatsApp AI Assistant`) — have **no SDK source in this repo**. They're
credentialed, and `get_workflow_details` strips credentials, so they can't be safely
reconstructed via the MCP SDK. Their **source of truth is the n8n submodule backup** (exported
JSON under `n8n/workflows/`). To change them, use the CLI export→edit→import→restart path (see
the "Editing the parent" box above); the Python edit scripts used this session were one-offs
(not kept). MCP-authored workflows hot-reload on publish; CLI-edited ones need the restart.

Two SDK gotchas hit during authoring: the validator forbids real-code `.join()` etc. in node
config (put multiline `jsCode` in **backtick literals**, not `[...].join('\n')`), and
`description` on create/update is capped at 255 chars.

---

## TODO — next Claude Code session

### 1. Apply style & tone fixes (the main remaining polish) — ✅ DONE
Root cause: the model wrote long, markdown-y, emoji-heavy text for a rich renderer
WhatsApp doesn't have. Fixed in the sub-workflow's **`Build Prompt`** system message
(new "أسلوب الرد" block) plus a belt-and-suspenders cleanup in **`Prepare Reply`**.
Live as of the published version (`activeVersionId 1f424ea8-…`). What the fix covers:

- **Brevity:** system prompt enforces 1–3 short sentences in a single connected
  paragraph, no lists.
- **No markdown / plain text only:** forbids asterisks (`*`), underscores (`_`),
  bullets, and headings. `Prepare Reply`'s `cleanReply()` also strips `*` `_`
  `` ` `` `•`/bullets, leading list dashes, and zero-width/`U+2060` chars — so
  history is stored clean too.
- **Topic-latching:** instructed to treat an already-named procedure/area as the
  subject and not re-ask "which operation?".
- **Calmer tone:** minimal/no emoji, professional register for an older patient base.
- **Bot identity (refinement, live):** the opening prompt line identifies it as the clinic's
  **automated assistant** ("أنت المساعد الآلي لعيادة الدكتور مؤمن ديرانية"). On the first
  message, or when addressed as the doctor (e.g. `كيفك يا دكتور`), it opens with one short
  self-intro ("أنا المساعد الآلي لعيادة الدكتور مؤمن ديرانية") and then answers directly.
  `Build Prompt` computes `isFirst = history.length === 0` and appends a first-message
  reminder. (Phrasing is stated positively — what we want — not as "don't say X"; earlier
  negative wording was removed as it was reactive baggage.)
- **Continuity (refinement, live):** the bot was re-introducing itself on every turn and
  answering follow-ups as if fresh (e.g. after discussing الناسور, `شو أنواع العمليات؟` got a
  whole-clinic answer instead of fistula-specific). Fixed with two prompt rules: (1) introduce
  only on the first turn / when addressed as the doctor, otherwise go straight to the answer;
  (2) an explicit "continue the prior topic" rule with a concrete الناسور example. **Root cause
  was prompt, not memory** — see the diagnostic note below.
- **Pricing brevity (refinement, live):** when asked a price, give one range (low→high)
  without enumerating each surgical option or naming techniques (LIFT/FiLaC), unless the
  patient asks for detail — the first version dumped a full 3-option breakdown.
- **Numerals (refinement, live):** replies use Arabic-Indic digits (٠١٢٣٤٥٦٧٨٩) for prices
  and counts, but **phone numbers stay Western digits in local format** (`0799133299` /
  `0798872899`) so WhatsApp keeps them tap-to-call (Arabic-Indic digits don't linkify).
  The clinic/doctor numbers in the prompt were switched to that local Western form too.

### 2. Data-retention page — ✅ DONE
`src/pages/data.md` ("حفظ البيانات وحذفها", route `/data`) has a "سجل محادثات واتساب"
entry (section ٥) disclosing per-phone retention, the 90-day inactivity auto-delete
(matches `Dads Clinic-Prune Chat History`), and the self-service reset. It's also listed
in the "how to request deletion" section. This lives on **`/data`, not `/privacy`** — the
general privacy policy was intentionally left untouched; retention/deletion specifics belong
on the data page. Date bumped to تموز ٢٠٢٦. (Ships on next site deploy.)

### 3. Price-quoting policy — ✅ decided (OK to quote)
Orwa signed off on the bot volunteering surgical price ranges over WhatsApp. Behaviour
tuned so it quotes a single concise range (not a per-option breakdown) unless the patient
asks for detail. Still worth a final confirmation from Dr. Mu'men himself when convenient.

### 4. Debounce tuning (optional)
Single-message latency is ~22s (15s wait + model). Consider shortening the window
to ~10–12s or making it adaptive (reply faster when the message ends in `؟`).

### 5. Parent `messages[]` batching (latent)
The parent reads only `messages[0]`. If WhatsApp ever delivers a burst as one
batched webhook (multiple entries in `messages[]`), the extras are dropped before
the sub-workflow. Consider looping over `messages[]` in the parent.

### 6. Housekeeping
- Ensure `Refresh Knowledge` and `Prune Chat History` are **active** (scheduled);
  run `Refresh Knowledge` once to (re)seed `clinic_knowledge` after any reset.
- Delete the disabled old AI tail nodes in the parent (Build Prompt Context →
  Clinic AI Assistant → … → Send to Assistant) once the sub-workflow is trusted.
