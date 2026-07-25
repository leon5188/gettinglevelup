var negs = ["diy", "how to fix", "youtube", "diagram", "manual", "jobs", "hiring", "salary", "training", "license exam", "home depot", "lowes", "parts", "pipe wrench", "harbor freight", "free", "cheap", "discount code"];
var exacts = ["[slab leak repair garland tx]", "[emergency plumber dallas]", "[24 hour plumber near me]", "[water heater replacement plano]"];

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
      ag.newKeywordBuilder().withText(exacts[j]).build();
    }
  }
}
Logger.log("Plumbify Google Ads Optimization Completed Successfully!");
