/* FRAIMOUS TV: edit collections, titles and order here. The first piece of the first collection opens first. */
window.FRAIMOUS_DATA = {
  intervalSeconds: 90,
  // Membership backend (local dev server in ../backend). Change to the deployed URL once approved.
  backendUrl: (location.protocol.indexOf("http") === 0) ? "" : "https://frmtv.vercel.app", /* same-origin on the web; absolute for the packaged .wgt */
  kenBurns: true,
  collections: [
    { name: "Sporting Life", slug: "sporting-life", pieces: [
      { file: "chukker-in-white.jpg", free: true,       title: "Chukker in White",          note: "Winter Polo on Fresh\u00a0Snow" },
      { file: "the-gentleman-in-plaid.jpg", title: "The Gentleman in Plaid",    note: "Portrait of a Good\u00a0Boy" } ]},
    { name: "Après-Ski Season", slug: "apres-ski-season", pieces: [
      { file: "alpine-pour.jpg",            title: "Alpine Pour",               note: "Celebration Above the\u00a0Clouds" },
      { file: "apres-apres.jpg",            title: "Après, Après",              note: "Glow in Fresh\u00a0Snow" },
      { file: "pines-under-a-turning-sky.jpg", free: true, title: "Pines Under a Turning Sky", note: "Night Over the\u00a0Ridge" } ]},
    { name: "Wild Hearts", slug: "wild-hearts", pieces: [
      { file: "daisy-iron.jpg", free: true,             title: "Daisy Iron",                note: "Flowers in the\u00a0Barrel" },
      { file: "clamor.jpg",                 title: "Clamor",                    note: "Sound and\u00a0Fire" } ]},
    { name: "High Altitude", slug: "high-altitude", pieces: [
      { file: "arrival-by-air.jpg",         title: "Arrival by Air",            note: "Touchdown at\u00a0Golden\u00a0Hour" },
      { file: "cloud-ace.jpg",              title: "Cloud Ace",                 note: "Above the\u00a0Weather" },
      { file: "orbit-hours.jpg",            title: "Orbit Hours",               note: "Reading Light in\u00a0Space" } ]}
  ]
};
