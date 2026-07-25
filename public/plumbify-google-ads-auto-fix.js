function main() {
  Logger.log("Starting Plumbify Google Ads Automated Account Optimization...");

  var negativeKeywords = [
    "diy", "how to fix", "youtube", "diagram", "manual",
    "jobs", "hiring", "salary", "training", "license exam",
    "home depot", "lowes", "parts", "pipe wrench", "harbor freight",
    "free", "cheap", "discount code"
  ];

  var exactKeywords = [
    "[slab leak repair garland tx]",
    "[emergency plumber dallas]",
    "[24 hour plumber near me]",
    "[water heater replacement plano]"
  ];

  var campaignIterator = AdsApp.campaigns()
    .withCondition("Status = ENABLED")
    .get();

  var countProcessed = 0;

  while (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();
    var campaignName = campaign.getName();
    Logger.log("Processing Campaign: " + campaignName);

    for (var i = 0; i < negativeKeywords.length; i++) {
      campaign.createNegativeKeyword(negativeKeywords[i]);
    }
    Logger.log("Added " + negativeKeywords.length + " Negative Keywords to " + campaignName);

    var adGroupIterator = campaign.adGroups().withCondition("Status = ENABLED").get();
    while (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      for (var j = 0; j < exactKeywords.length; j++) {
        adGroup.newKeywordBuilder()
          .withText(exactKeywords[j])
          .build();
      }
      Logger.log("Added Exact Match Keywords to Ad Group: " + adGroup.getName());
    }

    countProcessed++;
  }

  var webhookUrl = "https://plumbify.net/api/ghl/voice-ai";
  try {
    var response = UrlFetchApp.fetch(webhookUrl, { "method": "get" });
    Logger.log("Plumbify GHL Voice AI Webhook Connected! Status: " + response.getResponseCode());
  } catch (e) {
    Logger.log("Webhook ping: " + e.toString());
  }

  Logger.log("Plumbify Google Ads Optimization Completed Successfully! Processed Campaigns: " + countProcessed);
}
