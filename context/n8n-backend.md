# n8n Backend Infrastructure

## Overview

The clinic's backend runs on a self-hosted n8n instance at `https://n8n.orwa.tech`. It handles phone verification, booking confirmation, SMS/WhatsApp messaging, Telegram notifications, and AI-powered WhatsApp conversations.

**n8n version:** 2.15.1 (self-hosted). This version removed `executeCommand` and `localFileTrigger` nodes — see "Local Services" below for how we replaced them.

## n8n Workflows

| Workflow | ID | Purpose |
|----------|------|---------|
| Verify Phone Number (V1) | `dwv7rpf8uHxyum02` | Original phone verification: send code via SMS/WhatsApp, verify code, issue JWT |
| Verify Phone Number (V2) | `wpSDqlKO2iMoUZZ7` | User-initiated verification: generate code for user to send via WhatsApp |
| WhatsApp AI Assistant | `XlYzvScd6xm3xlBI` | Claude Haiku 4.5 chatbot + verification code interception |
| Send Telegram Messages | `C2F9UQOSqoWTqCg8` | Subflow: maps phone numbers to Telegram chat IDs, sends messages |
| Send Reminders | `WiqM8fag3FvWvW6t` | Appointment reminders via WhatsApp/SMS |
| Send Notifications from Cal.com Events | `n1xrgJXoX6d74bjo` | Central messaging hub: receives Cal.com events, sends WhatsApp/SMS/Telegram notifications |

### Verify Phone Number V1 (`dwv7rpf8uHxyum02`)

The original verification flow. User enters phone number, receives a 4-digit code via SMS or WhatsApp, enters code, gets a JWT token.

Key webhook endpoints:
- `POST /webhook/c6c748c4-...` — Send verification code
- `POST /webhook/9298e44c-...` — Verify code
- `POST /webhook/b1ac96a5-...` — Validate existing JWT token
- `POST /webhook/80a3c67b-...` — Auto-confirm Cal.com appointments
- `POST /webhook/4900724b-...` — Get upcoming bookings from token

After confirming a booking on Cal.com, fires `booking_completed` event to PostHog with the phone number as `distinct_id`.

### Verify Phone Number V2 (`wpSDqlKO2iMoUZZ7`)

User-initiated verification — the user sends a code TO the clinic via WhatsApp instead of receiving one. Zero cost, abuse-proof, no phone input needed.

**Endpoints:**
- `POST /webhook/verify-v2-generate` — Creates 6-char code (charset: `ABCDEFGHJKMNPQRSTUVWXYZ23456789`, no ambiguous chars) + 32-char hex session ID. Returns `{ code, session_id }`.
- `POST /webhook/verify-v2-status` — Input: `{ session_id, code }`. Returns:
  - `{ verified: false }` — waiting for WhatsApp message
  - `{ verified: false, expired: true }` — code older than 5 minutes
  - `{ verified: true, phone: "+962...", token: "eyJ..." }` — verified, JWT issued

**Data table:** `user_initiated_verification_codes` (ID: `YF3BFLASWMIxuPgu`) — columns: `code`, `session_id`, `phone` (null until claimed). Uses built-in `createdAt` for expiry. Expired rows flushed inline on each generate call.

### WhatsApp AI Assistant (`XlYzvScd6xm3xlBI`)

AI-powered WhatsApp responder with verification code interception.

**Flow:**
1. WhatsApp Trigger → Filter text messages → Extract phone, text, sender name
2. Check if message matches 6-char verification code pattern (case-insensitive, spaces ignored)
3. **If code:** Look up in V2 data table → set phone on match → reply confirmation or "unknown code"
4. **If not code:** Claude Haiku 4.5 classifies intent and generates Arabic reply

**Intent classification:**
- `info` — clinic questions → AI answers from embedded data
- `medical` — needs doctor → directs to +962799133299
- `administrative` — billing/insurance → directs to +962798872899
- `booking` — appointment changes → directs to https://abuobaydatajjarrah.com/bookings/

**System prompt** sourced from `https://abuobaydatajjarrah.com/llms-ar.txt`. AI responds in 2-3 sentences, never gives medical advice.

**Media forwarding (images/documents):**
The Message Type Router (Switch node) routes incoming WhatsApp messages by type: `text` → AI/verification flow, `image`/`document` → media forwarding flow. Media messages bypass AI entirely and are forwarded to the doctor's Telegram (`1491333235`) as documents with a caption showing patient name and phone. A separate text notification goes to Orwa's Telegram (`211021550`). The patient receives a thank you reply: "شكرًا لكم! ستتم مشاركة المرفقات الطبية التي بعثتموها مع الطبيب قبل موعدكم."

Media download flow: Extract media ID from WhatsApp payload → GET media URL from Graph API (bearer auth) → Download binary from the URL (bearer auth, response format: file) → Send as Telegram document. Uses the "Clinic WhatsApp Access Token" (`httpBearerAuth`) credential for the Graph API calls.

**Cost:** ~$0.001/message (Haiku 4.5). ~$3/month at 100 messages/day.

**Credentials:** Anthropic API, WhatsApp Business (phone ID: `943723358817193`), Telegram (Dads Clinic Appointments Bot), HTTP Bearer Auth (Clinic WhatsApp Access Token — for Graph API media download).

**Telegram chat IDs:**
- `1491333235` — Doctor (receives forwarded media documents)
- `211021550` — Orwa (receives AI conversation logs + media forward notifications)

**WhatsApp Trigger behavior:** The node auto-registers its production webhook URL with Meta when the workflow is activated. Never configure this manually in Meta's dashboard. To switch from test back to production mode, deactivate and reactivate the workflow. SDK `update_workflow` also triggers re-registration.

### Send Notifications from Cal.com Events (`n1xrgJXoX6d74bjo`)

The central messaging hub. Receives Cal.com webhook events and dispatches notifications to patients (WhatsApp/SMS) and clinic staff (Telegram).

**Webhook:** `POST /webhook/101fbb84-79de-4896-8edf-973b3d86ee10`

**Flow:**
1. Webhook receives Cal.com event → Fetches patient's messaging preference from `messaging_preferences` data table (WhatsApp vs SMS) → Merges with event data
2. "أضف معلوماتٍ إضافية" (Set node) enriches with: recipient phone, Telegram recipients, attendees string, gender conjugation fixes, formatted date/time strings, timezone name, and `arabic_date_strings` (relative dates like "اليوم"/"يوم غد"/"يوم الأحد ٢٠ أبريل" for WhatsApp templates)
3. Routes by `triggerEvent`: BOOKING_CREATED, BOOKING_CANCELLED, BOOKING_RESCHEDULED, MEETING_STARTED
4. Each event type further routes by booking type (clinic/remote) and/or initiator (doctor/patient)
5. Sends Telegram notification to clinic staff, then routes patient message by `method` (whatsapp → template, sms → local SMS service)

**WhatsApp templates used (all Arabic, `ar`):**

| Template | Event | Params |
|----------|-------|--------|
| `booking_clinic_completed` | New clinic booking | `{{1}}` date, `{{2}}` time. Location header with clinic coordinates. Sent via HTTP Request (native node lacks location header support) |
| `booking_remote_completed` | New remote booking | `{{1}}` date, `{{2}}` time. Text header. Sent via native WhatsApp node |
| `booking_cancelled_by_doctor` | Doctor cancels | `{{1}}` date, `{{2}}` time. Apologetic tone, link to rebook |
| `booking_cancelled_by_patient` | Patient cancels | `{{1}}` date, `{{2}}` time. Confirmatory tone, link to rebook |
| `booking_rescheduled_by_doctor` | Doctor reschedules | `{{1}}` old date, `{{2}}` old time, `{{3}}` new date, `{{4}}` new time |
| `booking_rescheduled_by_patient` | Patient reschedules | `{{1}}` old date, `{{2}}` old time, `{{3}}` new date, `{{4}}` new time |
| `meeting_started_patient` | Remote meeting starts | No params. Video link button |

**Date/time formatting for templates:**
- `arabic_date_strings[0]` = current/new date: "اليوم" (today), "يوم غد" (tomorrow), or "يوم [weekday] [day] [month]"
- `arabic_date_strings[1]` = old date (reschedules only, empty string for non-reschedule events)
- `time_strings[0]` + `timezone_string` = time like "١٠:٠٠ ص بتوقيت عمان"
- `date_strings[0]` = raw locale date (used for SMS messages, NOT for templates)

**Key design decisions:**
- The clinic confirmation template requires a LOCATION header (map pin). The native n8n WhatsApp sendTemplate node doesn't support location headers — only text/currency/date_time/image. So it uses an HTTP Request node to call the WhatsApp Cloud API directly (`POST https://graph.facebook.com/v21.0/{phone_id}/messages`) with `httpBearerAuth` credential ("Clinic WhatsApp Access Token").
- All other templates use the native WhatsApp sendTemplate node since they only need text headers and body parameters.
- The `messaging_preferences` data table determines WhatsApp vs SMS routing. **V2 verification should write to this table** when a patient verifies (since they've proven they have WhatsApp), but this is not yet implemented — see "Known Gaps" below.

**Known Gaps:**
- V2 verification does not write to the `messaging_preferences` data table. Patients who verify via V2 (WhatsApp) may default to SMS for notifications because the preference lookup finds nothing. The fix: the WhatsApp AI Assistant workflow (or the V2 verification workflow) should upsert a `whatsapp` preference when verification succeeds.
- MEETING_STARTED for remote bookings: the `meeting_started_patient` template is approved but not yet wired in the workflow.

**Messaging preferences data table:** `messaging_preferences` (ID: `RIIlnxVKYHiGeNgz`)
- Lookup key: `phone_number` (without leading `+`)
- Determines routing: `method` field → `whatsapp` or `sms`

### Send Telegram Messages (`C2F9UQOSqoWTqCg8`)

Subflow called by V1 verification workflow for booking rejection and abuse alert notifications.
- Input: `telegram_recepients` (array of phone numbers), `notification_message` (string)
- Maps phone numbers to Telegram chat IDs via a hardcoded lookup table in a Code node
- Created via n8n MCP SDK (small enough to safely replace via SDK)

## Local Services (systemd)

A standalone Node.js HTTP service runs alongside n8n to handle operations removed from n8n 2.15.1.

**Local Location:** `./n8n/service` in this repository where n8n is a submodule repo
**Remote Location:** `/root/dads-clinic-backup/service/` on the n8n server
**systemd unit:** `clinic-service.service`
**Listens on:** `127.0.0.1:3847` (localhost only)

### n8n workflow backup system (prior to MCP)

The n8n submodule repository inside of the website repository contains a backup script that used
to be used to backup n8n workflows tagged with the `dads-clinic` and `production` labels.

The remote machine also has `/opt/n8n.env` which contains the environmnt for the n8n systemd service
(e.g. this is the place where one might need to add `NODE_FUNCTION_ALLOW_BUILTIN=crypto`, for example,
to enable the builtin function `crypto`). Sometimes this environment will need to be changed. It is
not currently admitted to version control.

As a good practice, the user has to run `ssh root@n8n ./backup.sh 'commit message'` periodically 
(while connected to VPN) to backup the workflows and commit them to version control under the n8n 
submodule repo. This has to be followed by pulling from the n8n folder locally to pull the changes
pushed from the remote.

The `backup.sh` home-directory script referenced from the SSH command above contains the following:

```
cd dads-clinic-backup && ./backup.sh && git add . && git commit -m "${*:-Synced workflows}" && git push
```

The backup.sh file referenced above can hence be found at `./n8n/backup.sh` in this repository, which
is different from the home-directory `backup.sh` script.

### Endpoints

**POST `/validate`** — Phone number validation via `google-libphonenumber`
- Input: `{ "phone": "962791234567" }` (no leading `+`)
- Output: `{ "success": true, "phone": "+962791234567", "isValid": true, "isMobile": true, "message": 1 }`
- Why standalone: `google-libphonenumber` has dependency conflicts with n8n, gets removed on updates

**POST `/send-sms`** — Async SMS sending via SSH to Termux phones
- Input: `{ "phone": "+962791234567", "message": "..." }`
- Output: `{ "success": true, "queued": true }` (returns immediately)
- Background: tries all 3 phones in parallel with 10s timeouts
- Logs to `/root/dads-clinic-queues/sms.log`

### Setup

```bash
cd /root/dads-clinic-backup/service
bash setup.sh    # npm install, install/restart systemd service
systemctl status clinic-service
journalctl -u clinic-service -f
```

## SMS Gateway

Android phones running Termux act as SMS gateways via reverse SSH tunnels through a VPS.

| SSH Name | Phone Number | Tunnel Port |
|----------|-------------|-------------|
| `doctor.termux` | +962799133299 | 8024 |
| `assistant.termux` | +962798872899 | 8023 |
| `doctor2.termux` | +962799486661 | — |

Setup: `sms-gateway/setup.sh` in the parent `dads-clinic` repo.
Per-phone script: `~/send_sms.sh` (handles Arabic segmentation, SIM selection, multi-part messages).

## n8n MCP Usage

- **`mcp__n8n-mcp__*`** tools for inspecting and modifying workflows
- `update_workflow` replaces the **entire** workflow via SDK code — too risky for large workflows (40+ nodes). For targeted changes, guide the user through the n8n UI
- For small workflows (< 15 nodes), SDK replacement via MCP works well (proven with Telegram subflow and WhatsApp AI assistant)

## n8n SDK Learnings

These are hard-won lessons from building workflows via the MCP SDK:

- **`alwaysOutputData: true`** is required on all Data Table nodes. Without it, flows terminate silently when a delete/get returns no rows — the node produces zero items and downstream nodes never execute.
- **Reference data tables via `mode: 'list'`** (dropdown selection) not `mode: 'id'`. The list mode stores the human-readable table name alongside the ID, making workflows readable when editing in the n8n UI.
- **WhatsApp Trigger** auto-registers its webhook URL with Meta on activation. Using the "test" URL in the editor overrides this. To return to production, deactivate and reactivate the workflow.
- **`executeCommand` and `localFileTrigger`** were removed in n8n 2.15.1. No replacements exist — use HTTP Request nodes calling external services or Code nodes with `child_process`.
- **Switch/If node condition `options`** must include `{ caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 3 }` inside each rule's `conditions` block. Using `typeValidation: 'strict'` causes runtime errors (`Cannot read properties of undefined (reading 'caseSensitive')`). Also set `looseTypeValidation: true` at the top-level parameters. The SDK doesn't add these `options` by default — they must be included explicitly.
- **SDK `update_workflow` re-registers WhatsApp Trigger webhooks** with Meta, generating a new webhook ID. This is expected behavior (same as deactivating/reactivating in the UI).

## WhatsApp Template Management

Templates can be created and retrieved via the WhatsApp Business Management API using the direnv-provided `WA_ACCESS_TOKEN` and `WA_ACCOUNT_ID`:

```bash
# List templates
curl -s "https://graph.facebook.com/v21.0/$WA_ACCOUNT_ID/message_templates" \
  -H "Authorization: Bearer $WA_ACCESS_TOKEN"

# Create template
curl -s -X POST "https://graph.facebook.com/v21.0/$WA_ACCOUNT_ID/message_templates" \
  -H "Authorization: Bearer $WA_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "name": "...", "language": "ar", "category": "UTILITY", "components": [...] }'
```

**Approval:** New templates get `PENDING` status and require Meta approval before they can be sent. Utility templates are typically approved within minutes to hours.

**Location header limitation:** The n8n WhatsApp sendTemplate node's `headerParameters` only support types `text`, `currency`, `date_time`, and `image`. It does NOT support `location` type headers. For templates with LOCATION headers (like `booking_clinic_completed`), use an HTTP Request node to call the WhatsApp Cloud API directly.

## Planned Enhancements

- **Conversation history** for WhatsApp AI: `chat_history` data table, load/save per phone number, keep last 10-20 exchanges
- **Booking via WhatsApp bot:** Cal.com API integration for checking slots and rescheduling in conversation
- **Media messages:** Forward patient images to doctor's Telegram with context
- **SMS-based V2 verification:** Same user-initiated code pattern but via SMS instead of WhatsApp
