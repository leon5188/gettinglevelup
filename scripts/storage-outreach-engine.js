const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');

const envPath = path.join(__dirname, '../ghl-mcp/.env');
const env = dotenv.parse(fs.readFileSync(envPath));
const apiKey = env.GHL_API_KEY;
const locationId = env.GHL_LOCATION_ID;

const client = axios.create({
  baseURL: 'https://services.leadconnectorhq.com',
  headers: {
    'Authorization': 'Bearer ' + apiKey,
    'Version': '2023-02-21',
    'Content-Type': 'application/json'
  }
});

function generateStorageEmail(name, company, step = 1, city = 'your area') {
  if (step === 1) {
    const subject = `Quick question regarding ${company}`;
    const body = `Hi ${name},

Quick question regarding ${company} — when a prospective tenant drives by at 6:30 PM on a Saturday asking about a 10x10 unit or a current tenant forgets their gate code, does it roll to voicemail or get an instant 5-second text response?

We built StoreGuard AI specifically for independent self-storage operators to capture after-hours move-ins and handle gate code lookups 100% on autopilot.

Open to a 20-second video demo showing how it works, or are your units completely 100% occupied?

Best,
Alex
StoreGuard AI Team`;
    return { subject, body };
  }

  if (step === 2) {
    const subject = `Unattended facility revenue audit for ${company}`;
    const body = `Hi ${name},

Following up on my last note regarding ${company}'s after-hours inquiries.

Most 50-200 unit storage facilities in ${city} lose 3-5 high-paying move-ins every month simply because no one answers weekend and evening calls.

We put together a quick interactive breakdown showing how an unattended AI dispatcher captures those move-ins and handles gate code requests without hiring an on-site manager ($3,500/mo savings):

https://dashboard.plumbify.net/storage-demo

Worth a quick look?

Best,
Alex
StoreGuard AI Team`;
    return { subject, body };
  }
}

console.log('=== STOREGUARD AI OUTREACH ENGINE INITIALIZED ===');
const sample = generateStorageEmail('John', 'Sunset Self Storage', 1, 'Bakersfield');
console.log('Sample Step 1 Subject:', sample.subject);
console.log('Sample Step 1 Body:\n', sample.body);
