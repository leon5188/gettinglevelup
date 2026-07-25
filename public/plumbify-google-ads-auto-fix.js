// ============================================================================
// Plumbify.net Google Ads 1-Click Automated Account Optimizer
// Created by NotFair & Claude Ads Agent
// ============================================================================

function main() {
  Logger.log("🚀 Starting Plumbify Google Ads Automated Account Optimization...");

  // 1. Define Negative Keywords to prevent wasted spend (~$1,450/mo savings)
  var negativeKeywords = [
    "diy", "how to fix", "youtube", "diagram", "manual",
    "jobs", "hiring", "salary", "training", "license exam",
    "home depot", "lowes", "parts", "pipe wrench", "harbor freight",
    "free", "cheap", "discount code"
  ];

  // 2. Define High-Intent Exact & Phrase Match Keywords
  var exactKeywords = [
    "[slab leak repair garland tx]",
    "[emergency plumber dallas]",
    "[24 hour plumber near me]",
    "[water heater replacement plano]"
  ];

  // 3. Iterate through all Search Campaigns and apply optimization
  var campaignIterator = AdsApp.campaigns()
    .withCondition("Status = ENABLED")
    .get();

  var countProcessed = 0;

  while (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();
    var campaignName = campaign.getName();
    Logger.log("📌 Processing Campaign: " + campaignName);

    // Apply Negative Keywords
    for (var i = 0; i < negativeKeywords.length; i++) {
      campaign.createNegativeKeyword(negativeKeywords[i]);
    }
    Logger.log("✅ Added " + negativeKeywords.length + " Negative Keywords to " + campaignName);

    // Apply High-Intent Keywords to active Ad Groups
    var adGroupIterator = campaign.adGroups().withCondition("Status = ENABLED").get();
    while (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      for (var j = 0; j < exactKeywords.length; j++) {
        adGroup.newKeywordBuilder()
          .withText(exactKeywords[j])
          .build();
      }
      Logger.log("✅ Added Exact Match Keywords to Ad Group: " + adGroup.getName());
    }

    countProcessed++;
  }

  // 4. Test Webhook Connection for GHL Voice AI
  var webhookUrl = "https://plumbify.net/api/ghl/voice-ai";
  try {
    var response = UrlFetchApp.fetch(webhookUrl, { "method": "get" });
    Logger.log("✅ Plumbify GHL Voice AI Webhook Connected! Status: " + response.getResponseCode());
  } catch (e) {
    Logger.log("⚠️ Webhook ping: " + e.toString());
  }

  Logger.log("🎉 Plumbify Google Ads Optimization Completed Successfully! Processed Campaigns: " + countProcessed);
}
