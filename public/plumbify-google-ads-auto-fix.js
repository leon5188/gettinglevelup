// B2B Plumbing Software & AI Dispatch - Clean Script

var b2cNegatives = [
  "diy", "how to fix", "youtube", "diagram", "manual",
  "home", "residential", "cheap plumber", "my pipe is leaking",
  "clogged toilet", "sink unclog", "leak repair near me", "parts",
  "home depot", "lowes", "pipe wrench", "harbor freight", "free"
];

var b2bExacts = [
  "plumbing business software",
  "ai answering service for plumbers",
  "plumbing dispatching software",
  "plumbing contractor crm",
  "gohighlevel plumbing snapshot"
];

var b2bHeadlines = [
  "Plumbing Business Software", "AI Answering For Plumbers", "Stop Missing Plumbing Calls",
  "Live Technician GPS Map", "Capture 10k In Missed Calls", "GHL Voice AI Integration",
  "24/7 Automated Dispatching", "Built For Plumbing Owners", "Free 2-Min Interactive Demo",
  "Plumbing Dispatch Software", "Automate Call Answering", "Increase Service Ticket Size",
  "See Live Plumbify Demo", "2-Min Video Walkthrough", "Try Interactive Console"
];

var b2bDescriptions = [
  "Never miss another $1,000 plumbing lead. AI answers 24/7 & dispatches plumbers on live GPS.",
  "Built specifically for plumbing contractors. Seamless GoHighLevel Voice AI integration.",
  "Automate 24/7 call handling and track technician GPS trajectory in real time. Try Demo!",
  "Increase plumbing company revenue with AI dispatching and automated customer follow-ups."
];

var camps = AdsApp.campaigns().withCondition("Status = ENABLED").get();
while (camps.hasNext()) {
  var c = camps.next();
  for (var i = 0; i < b2cNegatives.length; i++) {
    c.createNegativeKeyword(b2cNegatives[i]);
  }
  var ags = c.adGroups().withCondition("Status = ENABLED").get();
  while (ags.hasNext()) {
    var ag = ags.next();
    for (var j = 0; j < b2bExacts.length; j++) {
      ag.newKeywordBuilder()
        .withText(b2bExacts[j])
        .withMatchType("EXACT")
        .build();
    }

    try {
      var rsaBuilder = ag.newAd().responsiveSearchAdBuilder();
      for (var h = 0; h < b2bHeadlines.length; h++) {
        rsaBuilder.addHeadline(b2bHeadlines[h]);
      }
      for (var d = 0; d < b2bDescriptions.length; d++) {
        rsaBuilder.addDescription(b2bDescriptions[d]);
      }
      rsaBuilder.withFinalUrl("https://dashboard.plumbify.net/demo");
      rsaBuilder.build();
    } catch(e) {
      Logger.log("B2B Ad Note: " + e.toString());
    }
  }
}
Logger.log("Plumbify B2B SaaS Google Ads Optimization Completed Successfully!");
