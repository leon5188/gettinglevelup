# Plumbify B2B Outreach & Sales Automation — Domain Context

## Core Concepts & Glossary

### Entities

#### Lead (线索)
A plumbing or trade business entity discovered through web crawling, directory search, or manual import. It may or may not contain valid contact credentials (owner name, direct phone, business email).

#### Contact (已验证联系人)
A verified human decision-maker (typically Owner, Founder, Master Plumber, or Dispatch Director) associated with a plumbing business in the CRM with actionable outreach channels (email or SMS).

#### Lead Magnet (引流品)
A zero-cost, high-perceived-value digital asset (e.g., Mini Notion Budget Dashboard / Free Dispatch Leak Calculator) used to capture top-of-funnel traffic without financial commitment.

#### Tripwire (信任建立品)
A low-friction, low-cost impulse purchase ($9 - $12, e.g., Zero-Based Budget Spreadsheet, Debt Payoff Tracker) designed to convert leads into paying customers by eliminating the barrier of first-time purchase.

#### Flagship Offer (核心旗舰品)
The full-featured core platform or dashboard ($29 - $49) providing complete operational or financial visibility and systems.

---

### Lifecycle & State Transitions

#### 1. Pending Qualification (`cold-email-pending` / `cold-sms-pending`)
A newly ingested lead awaiting first-touch deep personalization.

#### 2. First-Touch Completed (`outreach-step-1`)
A contact who has received an AI-researched, personalized icebreaker email or SMS referencing verified public reputation, business history, and owner identity.

#### 3. In 7-Touch Nurture (`outreach-step-2` through `outreach-step-7`)
A contact actively moving through automated multi-channel follow-ups (case studies, calculators, demo videos, and final break-up notices) separated by defined cooldown delays.

#### 4. Hot Lead / Replied (`hot_lead`)
A contact who took an affirmative action (replied to email/SMS or booked a meeting). Immediately halts all automated outreach sequences.

#### 5. Suppressed (`suppressed`)
A contact who unsubscribed, hard-bounced, or reached sequence completion without engagement. Excluded from future cold outreach.

---

### Invariants & Business Rules

1. **B2B Only Rule**: Never target or generate B2C homeowner keywords or residential emergency repair copy.
2. **Goal Precedence**: Any inbound customer reply or booking immediately and permanently suspends the active 7-touch cold sequence.
3. **Ascii Compliance**: All outreach templates and scripts strictly use pure ASCII straight quotes and standard whitespace to avoid SMS/email gateway encoding corruptions.
