var negs = ["diy", "how to fix", "youtube", "diagram", "manual", "jobs", "hiring", "salary", "training", "license exam", "home depot", "lowes", "parts", "pipe wrench", "harbor freight", "free", "cheap", "discount code"];
var exacts = ["slab leak repair garland tx", "emergency plumber dallas", "24 hour plumber near me", "water heater replacement plano"];

var headlines = [
  "Emergency Plumber Garland", "Dallas Slab Leak Experts", "24/7 Water Heater Repair",
  "On-Scene in 30 Minutes", "Live Plumber GPS Tracking", "GHL Voice AI Fast Dispatch",
  "Upfront Flat-Rate Pricing", "No Hidden Overtime Fees", "Licensed & Insured Master",
  "4.9 Star Rated Local Plumbers", "Same-Day Drain Jetting", "Main Line Sewer Jetting",
  "Call For 30-Min Arrival", "Book 24/7 Service Online", "Get A Free On-Site Quote"
];

var descriptions = [
  "Need emergency plumbing in Garland or Dallas? Licensed experts ready 24/7. Call now!",
  "Live GPS tracking for plumber arrival. Instant Voice AI dispatch & upfront flat pricing.",
  "Stop floor leak damage now. Master plumbers for slab leaks & water heaters in DFW.",
  "Top-rated 24/7 plumbers with 4.9 Star reviews. No overtime fees & same-day drain jetting."
];

var camps = AdsApp.campaigns().withCondition("Status = ENABLED").get();
while (camps.hasNext()) {
  var c = camps.next();
  for (var i = 0; i < negs.length; i++) {
    c.createNegativeKeyword(negs[i]);
  }
  var ags = c.adGroups().withCondition("Status = ENABLED").get();
  while (ags.hasNext()) {
    var ag = ags.next();
    for (var j = 0; j < exacts.length; j++) {
      ag.newKeywordBuilder().withText(exacts[j]).withMatchType("EXACT").build();
    }

    try {
      var rsaBuilder = ag.newAd().responsiveSearchAdBuilder();
      for (var h = 0; h < headlines.length; h++) {
        rsaBuilder.addHeadline(headlines[h]);
      }
      for (var d = 0; d < descriptions.length; d++) {
        rsaBuilder.addDescription(descriptions[d]);
      }
      rsaBuilder.withFinalUrl("https://dashboard.plumbify.net/demo");
      rsaBuilder.build();
    } catch(e) {
      Logger.log("Ad note: " + e.toString());
    }
  }
}
Logger.log("Plumbify Google Ads RSA Ad Copy & Keywords Auto-Import Completed Successfully!");
