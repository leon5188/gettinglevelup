# Dispatch Desk Buildbook

**Done-for-you call answering for plumbing companies — build spec, v1**

Everything needed to answer a plumber's phone for them: the Voice AI script, the page that sells it, and the snapshot that runs it. Written to be executed, not read.

Positioning in one line: **every competitor sells software; we sell that you never log into anything.**

---

## Table of contents

1. [The Voice AI](#1-the-voice-ai)
2. [The landing page](#2-the-landing-page)
3. [What goes in the snapshot](#3-what-goes-in-the-snapshot)
4. [Per-client setup, in order](#4-per-client-setup-in-order)
5. [Open decisions](#5-open-decisions)

---

## 1. The Voice AI

This is the only part of the system a customer ever experiences directly. If it is bad, nothing else matters. Its job is narrow on purpose: **capture four facts and get off the phone.** It is not a salesperson, it is not an estimator, and it never promises anything.

### 1.1 What it must collect

| Field | Why | If refused |
| :--- | :--- | :--- |
| `caller_name` | Owner calls back by name | Continue — not a blocker |
| `service_address` | Decides if it is even in his area | Ask once more, then continue |
| `problem` | Decides urgency and truck stock | Ask once more, then continue |
| `callback_number` | The only mandatory one | Use caller ID, confirm aloud |

> **Design rule.** Callback number is the only hard requirement. A call with a number and nothing else is still a recoverable job. A call with three fields and no number is worthless.

### 1.2 System prompt

Paste into the Voice AI agent. Replace every `[BRACKET]` from the client intake form.

```
You are the after-hours answering service for [BUSINESS NAME], a plumbing
company serving [SERVICE AREA]. You are speaking on a live phone call with
someone who just called the business and did not get through.

YOUR ONLY GOAL
Collect four things, confirm them back, and end the call:
  1. Caller's name
  2. Service address (street + city)
  3. What is going wrong
  4. Best callback number

Keep the whole call under 90 seconds. You are not selling. You are taking
a message so a real plumber can call back.

HOW TO SPEAK
- Short sentences. One question at a time. Wait for the answer.
- Calm and unhurried, even if the caller is panicking.
- Plain words. Never say "I am an AI assistant" unless directly asked;
  if asked, say: "I'm the automated line for [BUSINESS NAME] — I'm taking
  your details so [OWNER FIRST NAME] can call you straight back."
- Never interrupt. If they are mid-sentence, let them finish.

OPENING
"[BUSINESS NAME], this line is picking up after hours. I can take your
details and get a plumber calling you back. What's your name?"

ORDER OF QUESTIONS
1. Name.
2. "And what's going on over there?"    <- let them describe it fully
3. "What's the address?"                <- street and city
4. "And the best number to reach you?"  <- read it back digit by digit

CONFIRM BEFORE ENDING
"Let me read that back — [NAME], [ADDRESS], [PROBLEM], and I'll have
someone call you at [NUMBER]. Is that right?"

CLOSING
Emergency:     "Someone's being reached right now. Keep your phone close."
Non-emergency: "You'll get a call back [NEXT BUSINESS WINDOW]. Anything
                else you want me to pass along?"

Never say a time you cannot guarantee. Never say "within 30 minutes."
```

### 1.3 Emergency classification

The AI must tag the call before it hangs up. This tag fires the wake-the-owner chain, so it has to be decided on the call, not later.

```
CLASSIFY THE CALL AS "EMERGENCY" IF ANY OF THESE ARE TRUE:
  - Water is actively running, spraying, or coming through a ceiling/wall
  - The caller says flood, burst, or "I can't shut it off"
  - Sewage is backing up into the home
  - There is no water at all in the property
  - Smell of gas          -> see GAS below
  - No hot water AND caller says there is an infant or elderly person

OTHERWISE CLASSIFY AS "STANDARD":
  - Dripping faucet, slow drain, running toilet
  - Water heater is old / wants a quote
  - Remodel, new fixture, scheduled work
  - Any call that starts with "no rush, but..."

GAS SMELL — OVERRIDE EVERYTHING:
Say exactly: "Please leave the building right now and call 911 or your
gas company from outside. We can't help with an active gas leak over
the phone." Then end the call. Tag it EMERGENCY and note GAS.

IF UNSURE, CLASSIFY AS EMERGENCY.
A false alarm costs the owner one phone call. A missed flood costs
him the customer.
```

### 1.4 The four guardrails

Every one of these will happen in the first week. Each has one correct response; the AI must never improvise around it.

```
1. THEY ASK WHAT IT COSTS
   Never quote. Never estimate. Never say "usually around."
   Say: "I can't give you a price over the phone — the plumber has to
   see it. He can give you a number when he calls back."
   If they push a second time:
   "I'd be guessing, and a wrong guess helps nobody. He'll call you
   shortly and can talk price then."

2. THE ADDRESS IS OUTSIDE [SERVICE AREA]
   Do not take the job. Do not promise a callback.
   Say: "That's outside the area we cover — I don't want to leave you
   waiting on a call that isn't coming. You'll get someone faster
   searching local to [THEIR CITY]."
   Still log the call. Tag OUT_OF_AREA.

3. YOU CANNOT UNDERSTAND THEM
   Ask them to repeat ONCE. If it is still unclear, stop trying to
   collect the details:
   "I want to make sure this gets to the right person — let me just
   take your number and have him call you directly."
   Get the number. Read it back. End the call. Tag NEEDS_HUMAN.
   A clean phone number beats a garbled address every time.

4. IT IS AN EXISTING CUSTOMER
   If the caller ID matches a known contact, open differently:
   "[BUSINESS NAME] — hi [FIRST NAME], good to hear from you. What's
   going on?"
   Skip the address question if one is already on file; confirm it
   instead: "Still over on [STREET]?"
```

### 1.5 Never — no exceptions

Quote a price. Promise an arrival time. Say "he'll be there in an hour." Diagnose the problem. Take a deposit or card number. Argue with an angry caller. Claim to be human when asked directly.

Every one of these creates a promise the owner has to break, and he will blame you for it.

### 1.6 Where the answers land

The workflows in Part 3 read these, so names must match exactly.

| Voice AI variable | Contact field | Type |
| :--- | :--- | :--- |
| `caller_name` | First / Last Name | Standard |
| `callback_number` | Phone | Standard |
| `service_address` | `job_address` | Text |
| `problem` | `job_description` | Long text |
| `urgency` | `job_urgency` | Dropdown — Emergency / Standard / Out of area |
| `call_time` | `job_called_at` | Date/time |
| `transcript` | `conversation_summary` | Long text |
| — | `job_status` | Dropdown — New / Owner notified / Acknowledged / Booked / Following up / Lost |
| — | `after_hours` | Yes / No |
| — | `owner_ack_at` | Date/time |

### 1.7 Six calls before you go live

Do not tell a client they are live until all six pass. These are the failures that produce refunds.

- [ ] **The normal one.** Leaking water heater, gives everything willingly. Everything lands in the right field.
- [ ] **The panicked one.** Talk fast, interrupt, say "there's water everywhere" three times. Still tagged Emergency, still gets the number.
- [ ] **The price shopper.** Ask "how much to replace a water heater" four times. Must never produce a number.
- [ ] **The silent one.** Say nothing for 20 seconds. Must not loop forever or hang up instantly.
- [ ] **The wrong-area one.** Address two cities outside the zone. Declines cleanly, still logs.
- [ ] **The 2am one.** Call for real at 2am. The whole wake-the-owner chain fires on your own phone.

---

## 2. The landing page

One job: get a plumber to book a call. Not a product tour. Everything on it should survive the question *"could a competitor say this exact sentence?"* — if yes, cut it.

**The positioning.** The market is snapshots at $297–997 and self-serve AI answering apps at $49–399. So the page does not say "our AI answers your phone" — a dozen cheaper products say that. It says **you will never log into anything.**

Implemented at `app/dispatch/page.tsx`.

### 2.1 Section order

| # | Section | Purpose |
| :--- | :--- | :--- |
| 01 | Hero — the anti-software line | One headline, one sub, one button. No dashboard graphics. |
| 02 | The proof he cannot argue with | His own missed call. The page's power. |
| 03 | What actually happens | Four steps, plain language, no product names. |
| 04 | The guarantee | Falsifiable and checkable by him at any time. |
| 05 | What he does | Removes "I don't have time to set this up." |
| 06 | Price, stated plainly | No "contact us." Hiding price costs trade customers. |
| 07 | Objections as FAQ | The four he is actually thinking. |

### 2.2 Copy

**01 — Hero**

> ### You don't need another app. You need someone to answer the phone.
>
> We pick up the calls you miss, get the name, the address and the problem, and text it to you. You will never log into anything. There is nothing for you to learn.
>
> **[ Book a 10-minute call ]**

**02 — Proof**

> ### We called 40 plumbing companies in Houston at 9pm on a Tuesday.
>
> 31 of them went to voicemail. Nine picked up. The nine booked the work.
>
> We'll call your shop tonight and tell you exactly what your customer hears. No charge, no pitch — you can do whatever you want with it.
>
> **[ Test my line tonight ]**

*Why 02 works: it is not a claim about your product, it is a fact about his business. He cannot dismiss it, and finding out costs him nothing. This is also your entire cold-outreach hook — the page and the email say the same thing, which is why both feel honest.*

**03 — What actually happens**

> ### Four things, and none of them are your problem.
>
> **Your phone rings and you can't get to it.** After four rings it comes to us. Your number, your caller ID, nothing changes on your end.
>
> **We answer as your company.** Name, address, what's broken, best number. Under 90 seconds. No prices quoted, no times promised.
>
> **You get a text.** "Emergency — Katy, water heater flooding, Mike, 713-555-0142." If it's urgent and you don't reply, we call your phone until you wake up.
>
> **The ones you don't reach get followed up.** We text them the next day, and again three days later, so a missed call doesn't quietly turn into a lost customer.

**04 — The guarantee**

> ### Every call answered. In 15 seconds. 24 / 7 / 365.
>
> If we ever let one go to voicemail, that month is free. Call your own line at 3am and check — we'd rather you did.

> **Say only this.** Never promise more jobs, more revenue, a return multiple, or a percentage lift. Those depend on how many calls he gets, which is not yours to control. Guaranteeing a number you don't control is how you end up refunding in month three.

**05 — What he does**

> ### Your side of this takes about fifteen minutes. Once.
>
> **Ten minutes** — one form: business name, tax ID, address, what you do, where you go, what counts as an emergency to you.
>
> **Five minutes** — one phone call where we walk you through forwarding your unanswered calls to us. It's a setting on your phone. It takes longer to explain than to do, and you can switch it off any time.
>
> **Then nothing.** No app, no login, no dashboard, no training. You just start getting texts.

**06 — Price**

> ### $497 to set it up. $597 a month after that.
>
> The setup covers carrier registration for your number — that part is paperwork with the phone companies and takes a few days. We do it, not you.
>
> No contract. Cancel any month. Full refund inside the first 30 days if you don't think it earned its keep.
>
> *Text messaging and call minutes are billed at cost — usually $20–60 a month depending on your call volume. We don't mark them up.*

**07 — Objections**

> **"I already call people back in the morning."**
> For a dripping faucet, that works. For water coming through a ceiling, they've called the next guy before you're awake. This is only about that second kind.
>
> **"An answering service quoted me less."**
> They take a message. We take the message, wake you up if it's an emergency, chase the ones who don't book, and ask for the review after. Different job.
>
> **"Is it a robot? My customers will hate that."**
> It is. Call the demo line and hear it before you decide. Most people can't tell, and the ones who can prefer it to voicemail.
>
> **"What if I want out?"**
> Turn off forwarding on your phone. Takes ten seconds and doesn't need us. Your number was never ours.

### 2.3 Keep off this page

Screenshots of a CRM. The words *platform*, *automation*, *AI-powered*, *solution*, or *seamless*. A feature grid. A free trial. Any number you cannot prove. A stock photo of a smiling person in a headset.

**A free trial in particular:** that experiment already ran — 2,400 outbound touches produced one trial that never charged. Paid setup filters for people who intend to use the thing.

---

## 3. What goes in the snapshot

Build this once, properly. After that every new client is a one-click install plus the per-client config in Part 4. Anything that differs between clients does *not* belong in the snapshot — it belongs in the intake form.

### 3.1 Custom fields

| Field | Type | Set by | Status |
| :--- | :--- | :--- | :--- |
| `job_address` | Text | Voice AI | existed already |
| `job_description` | Long text | Voice AI | existed already |
| `conversation_summary` | Long text | Voice AI | existed already |
| `job_urgency` | Dropdown | Voice AI | **created** |
| `job_called_at` | Date/time | Voice AI | **created** |
| `job_status` | Dropdown | Workflows | **created** |
| `owner_ack_at` | Date/time | WF-3 | **created** |
| `after_hours` | Yes / No | WF-1 | **created** |

### 3.2 Account-level custom values

One place to change per-client details so no workflow needs editing. Set once per sub-account.

```
Company_Name           Village Plumbing & Air
Owner_First_Name       Mike
Owner_Mobile           +17135550142
Backup_Mobile          +17135550188
Service_Area           Houston, Katy, Sugar Land, Cypress
Business_Hours         Mon-Fri 7am-6pm, Sat 8am-2pm
Emergency_Definition   burst pipe, no water, sewage backup, ceiling leak
Hold_Message           We've got your message and we're reaching the on-call plumber now - hang tight.
Opt_Out_Line           Reply STOP to opt out.
Review_Link            https://g.page/r/xxxxx/review
```

### 3.3 Pipeline

One pipeline, six stages. It exists so the monthly report can count things — the client never sees it.

| Stage | Enters when |
| :--- | :--- |
| Call captured | Voice AI finishes any call |
| Owner notified | Alert text sent |
| Owner acknowledged | Owner replies to the alert |
| Booked | Owner replies `BOOKED`, or marks it in the daily digest |
| Following up | No booking after 24h — nurture running |
| Closed / lost | Nurture finished with no response |

### 3.4 Tags

Prefixed `dd:` so they never collide with anything else.

```
dd:call-captured   dd:emergency      dd:standard        dd:out-of-area
dd:needs-human     dd:owner-acked    dd:unacknowledged  dd:booked
dd:following-up    dd:review-requested
```

### 3.5 The eight workflows

**WF-1 · Inbound call captured**
- Trigger: Voice AI call ends
- Create or update contact from the extracted fields
- Stamp `after_hours` by comparing against `Business_Hours`
- Create opportunity in *Call captured*
- Branch on `job_urgency` → WF-2 (Emergency) or WF-4 (Standard)

**WF-2 · Emergency alert**
- Trigger: `job_urgency` = Emergency
- SMS to `Owner_Mobile` immediately
- Move to *Owner notified*, start WF-3

```
EMERGENCY - {{contact.job_address}}
{{contact.first_name}} - {{contact.job_description}}
Call: {{contact.phone}}
Came in {{contact.job_called_at}}

Reply OK when you've got it.
```

**WF-3 · Escalation — the one that matters**

An alert sent to a sleeping man is not a delivered alert. This chain is the difference between your service and a $99 app.

| When | Action |
| :--- | :--- |
| T0 | SMS sent to owner. Wait 5 minutes for a reply. |
| +5 min | Outbound call to owner's mobile. A text does not wake anyone; a phone call does. |
| +10 min | SMS + call to the backup contact from the intake form. |
| +15 min | Text the caller the `Hold_Message`. Buys time instead of losing them silently. |
| Morning | Flag as unacknowledged. This number goes in the monthly report — if it is ever high, that is his problem to fix, and the report proves it. |

Any reply from the owner stamps `owner_ack_at` and cancels the rest of the chain.

**WF-4 · Standard job alert**
- Trigger: `job_urgency` = Standard
- No escalation, no wake-up. Queue it.
- One digest SMS at the next business-hours start with everything from overnight

**WF-5 · Missed-call text-back**
- Trigger: Call status = no answer / busy, and Voice AI did not pick up
- SMS within 60 seconds — the safety net for when the AI itself fails

```
Sorry we missed your call - this is {{custom_values.Company_Name}}.
What's going on and where are you? We'll call you right back.

Reply STOP to opt out.
```

**WF-6 · Unbooked follow-up**
- Trigger: Opportunity still not *Booked* 24h after capture
- Day 1, day 3, day 7 — one message each, conversational, from the business's number
- Any inbound reply stops the sequence and alerts the owner

```
Hi {{contact.first_name}} - {{custom_values.Company_Name}} here,
following up on the {{contact.job_description}} at {{contact.job_address}}.

Still need someone out? Reply STOP to opt out.
```

**WF-7 · Review request**
- Trigger: Opportunity moved to *Booked* plus 48 hours, or owner replies `DONE`
- One SMS with `Review_Link`. One follow-up after 3 days. Then stop.

> **Decide this before you sell it.** Review requests need a completion signal, and you do not have one — you know a job was captured, not that it was finished. Pick one: he replies `DONE` to the alert thread, or you read it off the daily digest reply, or you skip reviews in month one. Do not build this workflow until you have chosen.

**WF-8 · Monthly report**
- Trigger: First of the month
- Counts: total calls, after-hours calls, emergencies, booked, unacknowledged, reviews requested
- Delivered as one page, by email and text

```
{{custom_values.Company_Name}} - August

  47   calls answered
  19   of those were after you closed        <- the whole point
  12   turned into booked work
   5   left details, still following up
   2   were sales calls, we filtered them
   0   went to voicemail

Last August, those 19 after-hours calls would have
gone to voicemail.
```

*Why this page keeps the client: the value of this service is invisible by nature — nobody notices a call they didn't miss. Month two is when a client cancels because "nothing seems different." This page is the counter-argument, and the last line is the whole sales pitch restated with his own numbers in it.*

### 3.6 Templates the snapshot ships with

- Emergency alert SMS · standard digest SMS · missed-call text-back
- Follow-up day 1 / day 3 / day 7
- Customer hold message
- Review request + review reminder
- Monthly report email

Every outbound SMS template ends with `Reply STOP to opt out.` The carrier registration in Part 4 is approved on the basis that they do. Every outbound **email** template carries an unsubscribe link and a physical postal address — CAN-SPAM requires both.

---

## 4. Per-client setup, in order

The order matters for one reason: carrier registration is the only step with a queue in front of it. Start it first and do everything else while it waits.

**D0 · Intake form, before anything else**

Legal name, EIN, address, website, authorized contact, service list, service area, hours, what counts as an emergency, owner mobile, backup mobile, current phone carrier.

**D1 · Sub-account, number, registration**

Create sub-account → fill company details → buy a local number in his area code → submit 10DLC Brand → on approval submit Campaign as **Customer Care**. Never Marketing.

**D1 · Install the snapshot**

Then fill the custom values block. Nothing inside a workflow should need editing.

**D2 · Configure the Voice AI**

Paste the prompt, replace the brackets, set his emergency definition, set the out-of-area boundary.

**D2 · Run the six test calls** (Part 1.7). All six pass before he hears the word "live."

**D5 · Forwarding — on a call with him**

Never by email. Conditional forwarding on no-answer, four rings. Codes differ by carrier and VoIP systems are set in a portal, so stay on the phone until you have tested it live.

**D6 · You call his real number three times**

Daytime unanswered · 2am emergency · a question the AI cannot answer. Then, and only then, he is live.

> **Do not port his number.** Not for the first ten clients, not as a favour, not because it would capture more. Porting takes days to weeks and if it goes wrong his business line is dead and it is your fault. Conditional forwarding does 95% of the job, takes five minutes, and he can undo it himself. That last part is also your best sales answer to "what if I want out?"

### 4.1 What 10DLC registration actually is

Carriers created this to stop bulk spam from 10-digit numbers. Registration goes through The Campaign Registry.

- **Brand = who you are.** Legal entity, EIN, address. Verified against public records, produces a trust score that sets your throughput. One-time fee.
- **Campaign = what you send.** Use case, sample messages, and how people opted in. Monthly fee. The opt-in description is what gets scrutinised.

Register **per client, under the client's own EIN.** Not for tidiness — for risk isolation. Thirty clients on one Brand means one client's complaints tank the trust score and all thirty stop delivering.

The opt-in wording for this use case, which is clean because it is true:

```
End users call the business directly using the phone number published on
the business website, Google Business Profile, and service vehicles. When
a call is missed or occurs after business hours, the business replies by
SMS to the number the customer called from, to continue that same service
inquiry. All messages are conversational replies to an inbound
customer-initiated contact. Every message includes opt-out instructions
and STOP is honored immediately.
```

---

## 5. Open decisions

1. **The completion signal.** WF-7 cannot be built until you decide how you learn a job is finished. Owner replies `DONE` is the cheapest and needs nothing from his other systems.
2. **The wake-up call in WF-3.** Confirm the account can place automated outbound voice calls and what a minute costs. If it cannot, the escalation chain degrades to repeated SMS — materially weaker, and you should know that before you put the guarantee on the page.
3. **Reactivation.** Texting a client's old customer list is the fastest way to show revenue in month one, and the fastest way to repeat the carrier problem. Prior business relationship is not the same as prior express written consent for marketing messages. Start on email only; move to SMS just for people who reply.
