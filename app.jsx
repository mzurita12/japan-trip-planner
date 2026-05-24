const { useState, useEffect, useRef } = React;

const RTDB = "https://japan-trip-e62c6-default-rtdb.firebaseio.com/tripdata.json";

const PEOPLE = ["Mark", "Valerie", "Michelle", "Daniel"];
const PERSON_COLORS = { Mark:"#4A90D9", Valerie:"#D4643A", Michelle:"#3A9178", Daniel:"#9B72CF" };

const BLOCK_TYPES = [
  { id:"reservation", label:"🍽️ Reservation", color:"#D4643A", bg:"#FFF0E8" },
  { id:"transport",   label:"🚄 Transport",    color:"#4A90D9", bg:"#E8F2FF" },
  { id:"hotel",       label:"🏨 Hotel",        color:"#3A9178", bg:"#E8F5F0" },
  { id:"activity",    label:"🎯 Activity",     color:"#9B72CF", bg:"#F2EEFF" },
  { id:"food",        label:"☕ Food / Cafe",  color:"#E6960A", bg:"#FFF8E8" },
  { id:"free",        label:"🌸 Free Time",    color:"#888888", bg:"#F5F5F5" },
  { id:"flight",      label:"✈️ Flight",       color:"#1A1A2E", bg:"#E8E8F0" },
];

const HOURS = [
  "6:00 AM","6:30 AM","7:00 AM","7:30 AM","8:00 AM","8:30 AM","9:00 AM","9:30 AM",
  "10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM",
  "2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM",
  "6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM","9:30 PM",
  "10:00 PM","10:30 PM","11:00 PM","11:30 PM","12:00 AM",
];

const DAYS = [
  { day:1,  date:"Jul 16", dow:"Wed", city:"Tokyo",     theme:"tokyo"  },
  { day:2,  date:"Jul 17", dow:"Thu", city:"Tokyo",     theme:"tokyo"  },
  { day:3,  date:"Jul 18", dow:"Fri", city:"Tokyo",     theme:"tokyo"  },
  { day:4,  date:"Jul 19", dow:"Sat", city:"Tokyo",     theme:"tokyo"  },
  { day:5,  date:"Jul 20", dow:"Sun", city:"Osaka",     theme:"travel" },
  { day:6,  date:"Jul 21", dow:"Mon", city:"Osaka",     theme:"osaka"  },
  { day:7,  date:"Jul 22", dow:"Tue", city:"Kobe",      theme:"osaka"  },
  { day:8,  date:"Jul 23", dow:"Wed", city:"Kyoto",     theme:"osaka"  },
  { day:9,  date:"Jul 24", dow:"Thu", city:"Tokyo",     theme:"travel" },
  { day:10, date:"Jul 25", dow:"Fri", city:"Tokyo",     theme:"tokyo"  },
  { day:11, date:"Jul 26", dow:"Sat", city:"Fly Home",  theme:"flyout" },
];

const THEME_COLORS = {
  tokyo:  { accent:"#D4643A", light:"#FFF4EE", border:"#F4C4A8" },
  osaka:  { accent:"#3A9178", light:"#EEF8F4", border:"#A8D8C8" },
  travel: { accent:"#7B52A8", light:"#F4EEFF", border:"#C8A8E8" },
  flyout: { accent:"#3A72B8", light:"#EEF4FF", border:"#A8C4E8" },
};

const DEFAULT_BLOCKS = [
  {id:"b1",  day:1,  startTime:"4:00 PM",  endTime:"6:00 PM",  type:"flight",      title:"Michelle & Daniel Arrive",            notes:"Collect luggage, airport transfer",    assigned:"Michelle", lastEditedBy:"", lastEditedAt:""},
  {id:"b2",  day:1,  startTime:"6:00 PM",  endTime:"7:00 PM",  type:"hotel",       title:"Check-in: The Blossom Hibiya",        notes:"",                                    assigned:"Michelle", lastEditedBy:"", lastEditedAt:""},
  {id:"b3",  day:1,  startTime:"8:00 PM",  endTime:"10:00 PM", type:"reservation", title:"Welcome Dinner",                      notes:"Restaurant TBD",                      assigned:"Michelle", lastEditedBy:"", lastEditedAt:""},
  {id:"b4",  day:2,  startTime:"8:00 AM",  endTime:"9:00 AM",  type:"food",        title:"Breakfast at hotel",                  notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b5",  day:2,  startTime:"10:00 AM", endTime:"12:00 PM", type:"activity",    title:"Senso-ji Temple – Asakusa",           notes:"Nakamise Shopping Street",             assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b6",  day:2,  startTime:"12:00 PM", endTime:"1:30 PM",  type:"food",        title:"Lunch in Asakusa",                    notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b7",  day:2,  startTime:"2:00 PM",  endTime:"4:00 PM",  type:"activity",    title:"Ueno Park & Museums",                 notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b8",  day:2,  startTime:"4:00 PM",  endTime:"6:00 PM",  type:"activity",    title:"Ameyoko Market",                      notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b9",  day:2,  startTime:"8:00 PM",  endTime:"10:00 PM", type:"flight",      title:"Mark & Valerie Arrive",               notes:"Check-in: The Blossom Hibiya",        assigned:"Mark",     lastEditedBy:"", lastEditedAt:""},
  {id:"b10", day:2,  startTime:"10:00 PM", endTime:"12:00 AM", type:"reservation", title:"Arrival Dinner",                      notes:"Restaurant TBD",                      assigned:"Daniel",   lastEditedBy:"", lastEditedAt:""},
  {id:"b11", day:3,  startTime:"8:00 AM",  endTime:"9:00 AM",  type:"food",        title:"Breakfast & get ready",               notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b12", day:3,  startTime:"9:00 AM",  endTime:"10:00 AM", type:"transport",   title:"Depart for Sanrio Puroland",          notes:"~45 min from central Tokyo",           assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b13", day:3,  startTime:"10:00 AM", endTime:"5:00 PM",  type:"activity",    title:"Sanrio Puroland 🎀",                  notes:"Parade, shows, character meet & greet",assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b14", day:3,  startTime:"12:00 PM", endTime:"1:00 PM",  type:"food",        title:"Lunch inside Puroland",               notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b15", day:3,  startTime:"5:00 PM",  endTime:"6:30 PM",  type:"transport",   title:"Head back to Tokyo",                  notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b16", day:3,  startTime:"7:00 PM",  endTime:"9:00 PM",  type:"reservation", title:"Dinner – Shinjuku / Shibuya",         notes:"Restaurant TBD",                      assigned:"Mark",     lastEditedBy:"", lastEditedAt:""},
  {id:"b17", day:4,  startTime:"9:00 AM",  endTime:"10:30 AM", type:"food",        title:"Lazy brunch",                         notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b18", day:4,  startTime:"11:00 AM", endTime:"6:00 PM",  type:"free",        title:"Free Time – explore Tokyo",           notes:"Harajuku / Shibuya / Akihabara",       assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b19", day:4,  startTime:"7:00 PM",  endTime:"9:30 PM",  type:"reservation", title:"Group Dinner – Farewell Tokyo",       notes:"Restaurant TBD",                      assigned:"Valerie",  lastEditedBy:"", lastEditedAt:""},
  {id:"b20", day:5,  startTime:"9:00 AM",  endTime:"10:00 AM", type:"food",        title:"Breakfast & check-out",               notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b21", day:5,  startTime:"10:00 AM", endTime:"12:30 PM", type:"transport",   title:"🚄 Shinkansen: Tokyo → Osaka",        notes:"~2h 30min",                           assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b22", day:5,  startTime:"1:00 PM",  endTime:"2:00 PM",  type:"hotel",       title:"Check-in: Hotel Hankyu GRAN RESPIRE", notes:"Osaka",                               assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b23", day:5,  startTime:"6:00 PM",  endTime:"8:00 PM",  type:"activity",    title:"Dotonbori – street food crawl 🦞",    notes:"Glico Man sign, evening stroll",       assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b24", day:5,  startTime:"8:00 PM",  endTime:"10:00 PM", type:"reservation", title:"Dotonbori Dinner – Osaka",            notes:"Restaurant TBD",                      assigned:"Michelle", lastEditedBy:"", lastEditedAt:""},
  {id:"b25", day:6,  startTime:"7:30 AM",  endTime:"8:30 AM",  type:"food",        title:"Early breakfast",                     notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b26", day:6,  startTime:"8:30 AM",  endTime:"9:00 AM",  type:"transport",   title:"Depart for Universal Studios Japan",  notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b27", day:6,  startTime:"9:00 AM",  endTime:"7:00 PM",  type:"activity",    title:"USJ 🎢 – Mario World / Harry Potter", notes:"Express Pass recommended",             assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b28", day:6,  startTime:"12:00 PM", endTime:"1:00 PM",  type:"food",        title:"Lunch in-park",                       notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b29", day:6,  startTime:"7:30 PM",  endTime:"8:30 PM",  type:"transport",   title:"USJ – head back to hotel",            notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b30", day:6,  startTime:"8:30 PM",  endTime:"10:30 PM", type:"reservation", title:"Post-USJ Dinner",                     notes:"Restaurant TBD",                      assigned:"Daniel",   lastEditedBy:"", lastEditedAt:""},
  {id:"b31", day:7,  startTime:"8:00 AM",  endTime:"9:00 AM",  type:"food",        title:"Breakfast",                           notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b32", day:7,  startTime:"9:00 AM",  endTime:"9:30 AM",  type:"transport",   title:"Train to Kobe",                       notes:"~30 min from Osaka",                  assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b33", day:7,  startTime:"10:00 AM", endTime:"12:00 PM", type:"activity",    title:"Kitano-cho – foreign settlement",     notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b34", day:7,  startTime:"12:00 PM", endTime:"2:00 PM",  type:"reservation", title:"⭐ Kobe Beef Lunch – PRIORITY",       notes:"Book ASAP – very popular",            assigned:"Mark",     lastEditedBy:"", lastEditedAt:""},
  {id:"b35", day:7,  startTime:"2:00 PM",  endTime:"3:30 PM",  type:"activity",    title:"Meriken Park & Port Tower",           notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b36", day:7,  startTime:"4:00 PM",  endTime:"5:30 PM",  type:"activity",    title:"Nankinmachi – Kobe Chinatown",        notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b37", day:7,  startTime:"6:00 PM",  endTime:"6:30 PM",  type:"transport",   title:"Train back to Osaka",                 notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b38", day:8,  startTime:"8:00 AM",  endTime:"9:00 AM",  type:"food",        title:"Breakfast",                           notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b39", day:8,  startTime:"9:00 AM",  endTime:"9:15 AM",  type:"transport",   title:"Train to Kyoto",                      notes:"~15 min from Osaka",                  assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b40", day:8,  startTime:"10:00 AM", endTime:"12:00 PM", type:"activity",    title:"Fushimi Inari – torii gates",         notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b41", day:8,  startTime:"12:00 PM", endTime:"1:30 PM",  type:"food",        title:"Lunch in Gion district",              notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b42", day:8,  startTime:"1:30 PM",  endTime:"2:30 PM",  type:"activity",    title:"Kinkaku-ji (Golden Pavilion)",        notes:"Entry fee required",                  assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b43", day:8,  startTime:"3:00 PM",  endTime:"4:00 PM",  type:"activity",    title:"Arashiyama Bamboo Grove",             notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b44", day:8,  startTime:"4:00 PM",  endTime:"5:30 PM",  type:"food",        title:"Nishiki Market – snacks & souvenirs", notes:"",                                   assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b45", day:8,  startTime:"6:00 PM",  endTime:"6:15 PM",  type:"transport",   title:"Train back to Osaka",                 notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b46", day:8,  startTime:"7:30 PM",  endTime:"9:30 PM",  type:"reservation", title:"Final Osaka Dinner",                  notes:"Restaurant TBD",                      assigned:"Valerie",  lastEditedBy:"", lastEditedAt:""},
  {id:"b47", day:9,  startTime:"9:00 AM",  endTime:"10:00 AM", type:"food",        title:"Breakfast & check-out: Hotel Hankyu", notes:"",                                   assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b48", day:9,  startTime:"10:30 AM", endTime:"1:00 PM",  type:"transport",   title:"🚄 Shinkansen: Osaka → Tokyo",        notes:"~2h 30min",                           assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b49", day:9,  startTime:"1:00 PM",  endTime:"2:00 PM",  type:"hotel",       title:"Arrive Tokyo – check-in hotel",       notes:"TBD – book soon",                     assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b50", day:9,  startTime:"6:00 PM",  endTime:"8:30 PM",  type:"reservation", title:"Back in Tokyo Dinner",                notes:"Restaurant TBD",                      assigned:"Michelle", lastEditedBy:"", lastEditedAt:""},
  {id:"b51", day:10, startTime:"9:00 AM",  endTime:"10:00 AM", type:"food",        title:"Breakfast",                           notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b52", day:10, startTime:"10:00 AM", endTime:"2:00 PM",  type:"activity",    title:"Last-minute shopping",                notes:"Shinjuku / Ginza",                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b53", day:10, startTime:"2:00 PM",  endTime:"4:00 PM",  type:"free",        title:"Pack & prepare luggage",              notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b54", day:10, startTime:"4:00 PM",  endTime:"6:30 PM",  type:"activity",    title:"Optional: Tokyo Skytree / Odaiba",    notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b55", day:10, startTime:"7:00 PM",  endTime:"10:00 PM", type:"reservation", title:"⭐ FAREWELL Dinner – PRIORITY",       notes:"Special restaurant – book early!",    assigned:"Daniel",   lastEditedBy:"", lastEditedAt:""},
  {id:"b56", day:11, startTime:"6:00 AM",  endTime:"7:00 AM",  type:"free",        title:"Wake up – Michelle & Daniel prep",    notes:"",                                    assigned:"",         lastEditedBy:"", lastEditedAt:""},
  {id:"b57", day:11, startTime:"7:00 AM",  endTime:"9:00 AM",  type:"transport",   title:"Michelle & Daniel → Airport",         notes:"",                                    assigned:"Michelle", lastEditedBy:"", lastEditedAt:""},
  {id:"b58", day:11, startTime:"9:45 AM",  endTime:"11:00 AM", type:"flight",      title:"Michelle & Daniel depart ✈️",         notes:"",                                    assigned:"Michelle", lastEditedBy:"", lastEditedAt:""},
  {id:"b59", day:11, startTime:"12:00 PM", endTime:"1:00 PM",  type:"free",        title:"Mark & Valerie checkout / prep",      notes:"",                                    assigned:"Mark",     lastEditedBy:"", lastEditedAt:""},
  {id:"b60", day:11, startTime:"1:00 PM",  endTime:"3:00 PM",  type:"transport",   title:"Mark & Valerie → NRT",                notes:"",                                    assigned:"Mark",     lastEditedBy:"", lastEditedAt:""},
  {id:"b61", day:11, startTime:"3:15 PM",  endTime:"4:30 PM",  type:"flight",      title:"Mark & Valerie depart ✈️",            notes:"NRT 3:15 PM",                         assigned:"Mark",     lastEditedBy:"", lastEditedAt:""},
];

const DEFAULT_CHECKLIST = [
  {id:"c1",  category:"flights",      title:"Mark & Valerie – Inbound",              detail:"Arrive Jul 17 @ 8:00 PM (HND/NRT)",     date:"Jul 17", startTime:"8:00 PM",  endTime:"",        status:"not-started", assigned:"Mark",     confirmNum:"", cost:"", notes:""},
  {id:"c2",  category:"flights",      title:"Mark & Valerie – Outbound",             detail:"Depart NRT Jul 26 @ 3:15 PM",           date:"Jul 26", startTime:"3:15 PM",  endTime:"",        status:"not-started", assigned:"Mark",     confirmNum:"", cost:"", notes:""},
  {id:"c3",  category:"flights",      title:"Michelle & Daniel – Inbound",           detail:"Arrive Jul 16 @ 4:00 PM",               date:"Jul 16", startTime:"4:00 PM",  endTime:"",        status:"not-started", assigned:"Michelle", confirmNum:"", cost:"", notes:""},
  {id:"c4",  category:"flights",      title:"Michelle & Daniel – Outbound",          detail:"Depart Jul 26 @ 9:45 AM",               date:"Jul 26", startTime:"9:45 AM",  endTime:"",        status:"not-started", assigned:"Michelle", confirmNum:"", cost:"", notes:""},
  {id:"c5",  category:"hotels",       title:"The Blossom Hibiya – Michelle & Daniel",detail:"Jul 16–20 (4 nights)",                  date:"Jul 16", startTime:"",         endTime:"",        status:"not-started", assigned:"Daniel",   confirmNum:"", cost:"", notes:""},
  {id:"c6",  category:"hotels",       title:"The Blossom Hibiya – Mark & Valerie",   detail:"Jul 17–20 (3 nights)",                  date:"Jul 17", startTime:"",         endTime:"",        status:"not-started", assigned:"Mark",     confirmNum:"", cost:"", notes:""},
  {id:"c7",  category:"hotels",       title:"Hotel Hankyu GRAN RESPIRE – Mark & Valerie", detail:"Jul 20–24 (4 nights)",             date:"Jul 20", startTime:"",         endTime:"",        status:"not-started", assigned:"Mark",     confirmNum:"", cost:"", notes:""},
  {id:"c8",  category:"hotels",       title:"Hotel Hankyu GRAN RESPIRE – Michelle & Daniel", detail:"Jul 20–24 (4 nights)",          date:"Jul 20", startTime:"",         endTime:"",        status:"not-started", assigned:"Daniel",   confirmNum:"", cost:"", notes:""},
  {id:"c9",  category:"hotels",       title:"Tokyo hotel Jul 24–26",                 detail:"After return from Osaka – TBD",         date:"Jul 24", startTime:"",         endTime:"",        status:"not-started", assigned:"Mark",     confirmNum:"", cost:"", notes:""},
  {id:"c10", category:"trains",       title:"Shinkansen: Tokyo → Osaka",             detail:"Jul 20 – JR Pass or individual",        date:"Jul 20", startTime:"10:00 AM", endTime:"12:30 PM",status:"not-started", assigned:"Mark",     confirmNum:"", cost:"", notes:""},
  {id:"c11", category:"trains",       title:"Shinkansen: Osaka → Tokyo",             detail:"Jul 24 – JR Pass or individual",        date:"Jul 24", startTime:"10:30 AM", endTime:"1:00 PM", status:"not-started", assigned:"Mark",     confirmNum:"", cost:"", notes:""},
  {id:"c12", category:"trains",       title:"Kobe day trip: Osaka ↔ Kobe",           detail:"Jul 22 – ~30 min each way",             date:"Jul 22", startTime:"9:00 AM",  endTime:"9:30 AM", status:"not-started", assigned:"Daniel",   confirmNum:"", cost:"", notes:""},
  {id:"c13", category:"trains",       title:"Kyoto day trip: Osaka ↔ Kyoto",         detail:"Jul 23 – ~15 min each way",             date:"Jul 23", startTime:"9:00 AM",  endTime:"9:15 AM", status:"not-started", assigned:"Daniel",   confirmNum:"", cost:"", notes:""},
  {id:"c14", category:"trains",       title:"Airport transfers – all groups",         detail:"Narita Express or Limousine Bus",        date:"",       startTime:"",         endTime:"",        status:"not-started", assigned:"",         confirmNum:"", cost:"", notes:""},
  {id:"c15", category:"trains",       title:"Japan Rail Pass (if using)",             detail:"Must purchase BEFORE arriving in Japan", date:"",       startTime:"",         endTime:"",        status:"not-started", assigned:"Mark",     confirmNum:"", cost:"", notes:""},
  {id:"c16", category:"experiences",  title:"Sanrio Puroland – ALL 6",               detail:"Jul 18 – Book online, sells out fast!", date:"Jul 18", startTime:"10:00 AM", endTime:"5:00 PM", status:"not-started", assigned:"Valerie",  confirmNum:"", cost:"", notes:""},
  {id:"c17", category:"experiences",  title:"Universal Studios Japan – ALL 6",        detail:"Jul 21 – Tickets + Express Pass",       date:"Jul 21", startTime:"9:00 AM",  endTime:"7:00 PM", status:"not-started", assigned:"Valerie",  confirmNum:"", cost:"", notes:""},
  {id:"c18", category:"experiences",  title:"TeamLab (optional)",                    detail:"Jul 19 or 25 – Borderless or Planets",  date:"",       startTime:"",         endTime:"",        status:"not-started", assigned:"",         confirmNum:"", cost:"", notes:""},
  {id:"c19", category:"experiences",  title:"Kinkaku-ji entry (Kyoto)",              detail:"Jul 23 – entry fee required",           date:"Jul 23", startTime:"1:30 PM",  endTime:"2:30 PM", status:"not-started", assigned:"",         confirmNum:"", cost:"", notes:""},
  {id:"c20", category:"reservations", title:"Jul 16 – Welcome Dinner",               detail:"Tokyo – 6 people",                      date:"Jul 16", startTime:"8:00 PM",  endTime:"10:00 PM",status:"not-started", assigned:"Michelle", confirmNum:"", cost:"", notes:""},
  {id:"c21", category:"reservations", title:"Jul 17 – Arrival Dinner",               detail:"Tokyo – 6 people",                      date:"Jul 17", startTime:"10:00 PM", endTime:"12:00 AM",status:"not-started", assigned:"Daniel",   confirmNum:"", cost:"", notes:""},
  {id:"c22", category:"reservations", title:"Jul 18 – Post-Puroland Dinner",         detail:"Tokyo – 6 people",                      date:"Jul 18", startTime:"7:00 PM",  endTime:"9:00 PM", status:"not-started", assigned:"Mark",     confirmNum:"", cost:"", notes:""},
  {id:"c23", category:"reservations", title:"Jul 19 – Free Day Dinner",              detail:"Tokyo – 6 people",                      date:"Jul 19", startTime:"7:00 PM",  endTime:"9:30 PM", status:"not-started", assigned:"Valerie",  confirmNum:"", cost:"", notes:""},
  {id:"c24", category:"reservations", title:"Jul 20 – Dotonbori Osaka",              detail:"Osaka – 6 people",                      date:"Jul 20", startTime:"8:00 PM",  endTime:"10:00 PM",status:"not-started", assigned:"Michelle", confirmNum:"", cost:"", notes:""},
  {id:"c25", category:"reservations", title:"Jul 21 – Post-USJ Dinner",              detail:"Osaka – 6 people",                      date:"Jul 21", startTime:"8:30 PM",  endTime:"10:30 PM",status:"not-started", assigned:"Daniel",   confirmNum:"", cost:"", notes:""},
  {id:"c26", category:"reservations", title:"⭐ Jul 22 – Kobe Beef – PRIORITY",      detail:"Kobe – 6 people – book ASAP",           date:"Jul 22", startTime:"12:00 PM", endTime:"2:00 PM", status:"not-started", assigned:"Mark",     confirmNum:"", cost:"", notes:""},
  {id:"c27", category:"reservations", title:"Jul 23 – Kyoto Dinner",                 detail:"Kyoto/Osaka – 6 people",                date:"Jul 23", startTime:"7:30 PM",  endTime:"9:30 PM", status:"not-started", assigned:"Valerie",  confirmNum:"", cost:"", notes:""},
  {id:"c28", category:"reservations", title:"Jul 24 – Back in Tokyo Dinner",         detail:"Tokyo – 6 people",                      date:"Jul 24", startTime:"6:00 PM",  endTime:"8:30 PM", status:"not-started", assigned:"Michelle", confirmNum:"", cost:"", notes:""},
  {id:"c29", category:"reservations", title:"⭐ Jul 25 – FAREWELL Dinner – PRIORITY",detail:"Tokyo – 6 people – special restaurant", date:"Jul 25", startTime:"7:00 PM",  endTime:"10:00 PM",status:"not-started", assigned:"Daniel",   confirmNum:"", cost:"", notes:""},
  {id:"c30", category:"misc",         title:"IC Card / Suica – all adults",           detail:"Load at airport or buy in advance",     date:"",       startTime:"",         endTime:"",        status:"not-started", assigned:"",         confirmNum:"", cost:"", notes:""},
  {id:"c31", category:"misc",         title:"Pocket WiFi or SIM cards",              detail:"Book online before travel",             date:"",       startTime:"",         endTime:"",        status:"not-started", assigned:"Mark",     confirmNum:"", cost:"", notes:""},
  {id:"c32", category:"misc",         title:"Travel insurance – all travelers",       detail:"Check credit card coverage first",       date:"",       startTime:"",         endTime:"",        status:"not-started", assigned:"",         confirmNum:"", cost:"", notes:""},
  {id:"c33", category:"misc",         title:"Yen currency",                          detail:"Japan is cash-heavy – exchange early",  date:"",       startTime:"",         endTime:"",        status:"not-started", assigned:"",         confirmNum:"", cost:"", notes:""},
  {id:"c34", category:"misc",         title:"Kids: strollers, carriers, snacks",      detail:"Confirm stroller policy at USJ & Puroland",date:"",    startTime:"",         endTime:"",        status:"not-started", assigned:"Michelle", confirmNum:"", cost:"", notes:""},
];

const CHECKLIST_CATEGORIES = [
  {id:"flights",      label:"✈️ Flights",       color:"#E6960A"},
  {id:"hotels",       label:"🏨 Hotels",        color:"#3A9178"},
  {id:"trains",       label:"🚄 Trains",        color:"#4A90D9"},
  {id:"experiences",  label:"🎟️ Experiences",   color:"#9B72CF"},
  {id:"reservations", label:"🍽️ Reservations",  color:"#D4643A"},
  {id:"misc",         label:"🧳 Misc / Prep",   color:"#777777"},
];

const STATUS_CYCLE  = ["not-started","in-progress","booked"];
const STATUS_LABELS = {"not-started":"❌ Not Started","in-progress":"🔄 In Progress","booked":"✅ Booked"};
const STATUS_COLORS = {"not-started":"#e74c3c","in-progress":"#e6960a","booked":"#27ae60"};

function timeAgo(ts){
  if(!ts) return "";
  const diff=Date.now()-new Date(ts).getTime(), mins=Math.floor(diff/60000);
  if(mins<1) return "just now";
  if(mins<60) return `${mins}m ago`;
  const hrs=Math.floor(mins/60);
  if(hrs<24) return `${hrs}h ago`;
  return `${Math.floor(hrs/24)}d ago`;
}
function genId(){ return "x"+Date.now()+Math.random().toString(36).slice(2,6); }

// Convert "7:30 PM" to minutes-from-midnight for sorting
function timeToMins(t){
  if(!t) return 0;
  const m=t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if(!m) return 0;
  let h=parseInt(m[1]), mn=parseInt(m[2]), ampm=m[3].toUpperCase();
  if(ampm==="PM"&&h!==12) h+=12;
  if(ampm==="AM"&&h===12) h=0;
  if(h===0&&ampm==="AM"&&t.includes("12:")) h=24; // midnight = end of day
  return h*60+mn;
}

export default function App(){
  const [currentUser,setCurrentUser]=useState(null);
  const [tab,setTab]=useState("calendar");
  const [blocks,setBlocks]=useState(DEFAULT_BLOCKS);
  const [checklist,setChecklist]=useState(DEFAULT_CHECKLIST);
  const [modal,setModal]=useState(null);
  const [calDay,setCalDay]=useState(1);
  const loaded=useRef(false);

  useEffect(()=>{
    async function load(){
      try{
        const r = await fetch(RTDB);
        if(r.ok){
          const d = await r.json();
          if(d && d.blocks && d.blocks.length > 0) setBlocks(d.blocks);
          if(d && d.checklist && d.checklist.length > 0) setChecklist(d.checklist);
        }
      }catch(e){ console.error("load error", e); }
      loaded.current = true;
    }
    load();
    const iv = setInterval(async()=>{
      try{
        const r = await fetch(RTDB);
        if(r.ok){
          const d = await r.json();
          if(d && d.blocks && d.blocks.length > 0) setBlocks(d.blocks);
          if(d && d.checklist && d.checklist.length > 0) setChecklist(d.checklist);
        }
      }catch(e){}
    }, 12000);
    return ()=>clearInterval(iv);
  },[]);

  async function save(b, c){
    try{
      await fetch(RTDB, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks: b, checklist: c })
      });
    }catch(e){ console.error("save error", e); }
  }
  function updateBlocks(fn){ setBlocks(prev=>{ const next=fn(prev); save(next,checklist); return next; }); }
  function updateChecklist(fn){ setChecklist(prev=>{ const next=fn(prev); save(blocks,next); return next; }); }

  const booked=checklist.filter(c=>c.status==="booked").length;

  if(!currentUser) return <UserPicker onPick={setCurrentUser}/>;

  return(
    <div style={{fontFamily:"'DM Sans',sans-serif",minHeight:"100vh",background:"#F7F4EF",color:"#1A1A2E"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet"/>

      {/* Header */}
      <div style={{background:"#1A1A2E",padding:"0 16px",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 20px rgba(0,0,0,0.35)"}}>
        <div style={{maxWidth:1400,margin:"0 auto",display:"flex",alignItems:"center",gap:12,height:54}}>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:"#fff",fontWeight:700,lineHeight:1}}>🇯🇵 Japan 2025</div>
            <div style={{fontSize:10,color:"#777",marginTop:2}}>Jul 16–26 · 6 travelers</div>
          </div>
          <div style={{background:"rgba(255,255,255,0.07)",borderRadius:20,padding:"5px 12px",display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:52,height:4,background:"rgba(255,255,255,0.12)",borderRadius:2,overflow:"hidden"}}>
              <div style={{width:`${(booked/checklist.length)*100}%`,height:"100%",background:"#27ae60",borderRadius:2,transition:"width 0.4s"}}/>
            </div>
            <span style={{fontSize:11,color:"#bbb",whiteSpace:"nowrap"}}>✅ {booked}/{checklist.length}</span>
          </div>
          <div onClick={()=>setCurrentUser(null)} style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",background:"rgba(255,255,255,0.07)",borderRadius:20,padding:"4px 10px 4px 6px"}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:PERSON_COLORS[currentUser]||"#666",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",fontWeight:700}}>{currentUser[0]}</div>
            <span style={{fontSize:12,color:"#ddd"}}>{currentUser}</span>
          </div>
        </div>
        <div style={{maxWidth:1400,margin:"0 auto",display:"flex",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
          {[["calendar","📅 Calendar"],["checklist","✅ Checklist"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{background:"none",border:"none",padding:"9px 18px",color:tab===id?"#fff":"#777",fontFamily:"inherit",fontSize:13,fontWeight:tab===id?600:400,cursor:"pointer",borderBottom:tab===id?"2px solid #D4643A":"2px solid transparent",transition:"all 0.2s"}}>{label}</button>
          ))}
        </div>
      </div>

      {tab==="calendar"
        ? <CalendarView blocks={blocks} calDay={calDay} setCalDay={setCalDay}
            onAdd={(day,startTime)=>setModal({type:"block",mode:"add",data:{day,startTime,endTime:"",type:"activity",title:"",notes:"",assigned:currentUser,id:null}})}
            onEdit={(block)=>setModal({type:"block",mode:"edit",data:{...block}})}/>
        : <ChecklistView checklist={checklist} currentUser={currentUser}
            onStatusChange={(id)=>{
              updateChecklist(prev=>prev.map(c=>{
                if(c.id!==id) return c;
                const idx=STATUS_CYCLE.indexOf(c.status);
                return{...c,status:STATUS_CYCLE[(idx+1)%STATUS_CYCLE.length],lastEditedBy:currentUser,lastEditedAt:new Date().toISOString()};
              }));
            }}
            onEdit={(item)=>setModal({type:"checklist",mode:"edit",data:{...item}})}
            onAdd={(category)=>setModal({type:"checklist",mode:"add",data:{id:null,category,title:"",detail:"",date:"",startTime:"",endTime:"",status:"not-started",assigned:currentUser,confirmNum:"",cost:"",notes:""}})}
          />
      }

      {modal&&<Modal modal={modal} currentUser={currentUser} onClose={()=>setModal(null)}
        onSaveBlock={(data)=>{
          const ts=new Date().toISOString();
          if(data.id) updateBlocks(prev=>prev.map(b=>b.id===data.id?{...data,lastEditedBy:currentUser,lastEditedAt:ts}:b));
          else updateBlocks(prev=>[...prev,{...data,id:genId(),lastEditedBy:currentUser,lastEditedAt:ts}]);
          setModal(null);
        }}
        onDeleteBlock={(id)=>{updateBlocks(prev=>prev.filter(b=>b.id!==id));setModal(null);}}
        onSaveChecklist={(data)=>{
          const ts=new Date().toISOString();
          if(data.id) updateChecklist(prev=>prev.map(c=>c.id===data.id?{...data,lastEditedBy:currentUser,lastEditedAt:ts}:c));
          else updateChecklist(prev=>[...prev,{...data,id:genId(),lastEditedBy:currentUser,lastEditedAt:ts}]);
          setModal(null);
        }}
        onDeleteChecklist={(id)=>{updateChecklist(prev=>prev.filter(c=>c.id!==id));setModal(null);}}
      />}
    </div>
  );
}

function UserPicker({onPick}){
  return(
    <div style={{minHeight:"100vh",background:"#1A1A2E",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24,padding:24}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet"/>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:52,marginBottom:12}}>🇯🇵</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,color:"#fff",fontWeight:700}}>Japan Trip 2025</div>
        <div style={{color:"#777",fontSize:13,marginTop:8,maxWidth:280,lineHeight:1.5}}>Who are you? Your name will be stamped on every edit you make.</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,width:"100%",maxWidth:300}}>
        {PEOPLE.map(p=>(
          <button key={p} onClick={()=>onPick(p)} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:16,padding:"18px 12px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:10,transition:"all 0.2s",fontFamily:"'DM Sans',sans-serif"}}
            onMouseOver={e=>e.currentTarget.style.background="rgba(255,255,255,0.1)"}
            onMouseOut={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
            <div style={{width:46,height:46,borderRadius:"50%",background:PERSON_COLORS[p],display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#fff",fontWeight:700}}>{p[0]}</div>
            <span style={{color:"#fff",fontWeight:600,fontSize:15}}>{p}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CalendarView({blocks,calDay,setCalDay,onAdd,onEdit}){
  const typeInfo=t=>BLOCK_TYPES.find(x=>x.id===t)||BLOCK_TYPES[3];
  const dayBlocks=d=>blocks.filter(b=>b.day===d).sort((a,b)=>timeToMins(a.startTime)-timeToMins(b.startTime));

  return(
    <div style={{maxWidth:1400,margin:"0 auto",paddingBottom:60}}>
      {/* Day tabs */}
      <div style={{overflowX:"auto",display:"flex",background:"#fff",borderBottom:"1px solid #E8E0D8",scrollbarWidth:"none"}}>
        {DAYS.map(d=>{
          const tc=THEME_COLORS[d.theme], active=calDay===d.day, cnt=dayBlocks(d.day).length;
          return(
            <button key={d.day} onClick={()=>setCalDay(d.day)} style={{flexShrink:0,background:"none",border:"none",padding:"10px 14px 8px",cursor:"pointer",borderBottom:active?`3px solid ${tc.accent}`:"3px solid transparent",fontFamily:"inherit",minWidth:82}}>
              <div style={{fontSize:9,color:active?tc.accent:"#aaa",fontWeight:700,textTransform:"uppercase",letterSpacing:0.8}}>Day {d.day}</div>
              <div style={{fontSize:13,color:active?"#1A1A2E":"#666",fontWeight:active?700:400,marginTop:1}}>{d.date}</div>
              <div style={{fontSize:10,color:active?tc.accent:"#bbb",marginTop:1}}>{d.city}</div>
              <div style={{width:6,height:6,borderRadius:"50%",background:cnt>0?(active?tc.accent:"#ccc"):"transparent",margin:"4px auto 0"}}/>
            </button>
          );
        })}
      </div>

      {DAYS.filter(d=>d.day===calDay).map(d=>{
        const tc=THEME_COLORS[d.theme];
        const sorted=dayBlocks(d.day);
        return(
          <div key={d.day}>
            {/* Day header */}
            <div style={{background:`linear-gradient(120deg,${tc.light},#fff)`,borderBottom:`2px solid ${tc.border}`,padding:"18px 20px 14px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
                <div>
                  <div style={{fontSize:11,color:tc.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,marginBottom:3}}>Day {d.day} · {d.dow}</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700}}>{d.date} – {d.city}</div>
                </div>
                <button onClick={()=>onAdd(d.day,"9:00 AM")} style={{background:tc.accent,border:"none",color:"#fff",borderRadius:20,padding:"8px 18px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 2px 8px ${tc.accent}44`}}>+ Add Block</button>
              </div>
            </div>

            {/* Timeline */}
            <div style={{padding:"0 20px"}}>
              {HOURS.map((hour,hi)=>{
                const hBlocks=sorted.filter(b=>b.startTime===hour);
                const isEven=hi%2===0;
                return(
                  <div key={hour} style={{display:"flex",gap:12,borderBottom:`1px solid ${isEven?"#EDE8E0":"#F0EBE4"}`,minHeight:48,background:isEven?"#FAFAF8":"#fff"}}>
                    <div style={{width:68,flexShrink:0,display:"flex",alignItems:"center",paddingLeft:4,color:"#bbb",fontSize:10,fontWeight:600,letterSpacing:0.3}}>{hour}</div>
                    <div style={{flex:1,display:"flex",gap:8,alignItems:"center",padding:"5px 0",flexWrap:"wrap"}}>
                      {hBlocks.map(block=>{
                        const bt=typeInfo(block.type);
                        return(
                          <div key={block.id} onClick={()=>onEdit(block)} style={{background:bt.bg,border:`1.5px solid ${bt.color}33`,borderLeft:`3px solid ${bt.color}`,borderRadius:8,padding:"7px 10px",cursor:"pointer",flex:"1 1 180px",maxWidth:360,transition:"transform 0.15s",position:"relative"}}
                            onMouseOver={e=>e.currentTarget.style.transform="translateY(-1px)"}
                            onMouseOut={e=>e.currentTarget.style.transform="none"}>
                            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:6}}>
                              <div style={{fontSize:12,fontWeight:700,color:"#1A1A2E",lineHeight:1.3}}>{block.title}</div>
                              <span style={{fontSize:9,background:`${bt.color}18`,color:bt.color,borderRadius:8,padding:"2px 6px",whiteSpace:"nowrap",flexShrink:0,fontWeight:600}}>{bt.label}</span>
                            </div>
                            {/* Time span */}
                            <div style={{fontSize:10,color:bt.color,fontWeight:600,marginTop:3}}>
                              {block.startTime}{block.endTime?` → ${block.endTime}`:""}
                            </div>
                            {block.notes&&<div style={{fontSize:11,color:"#888",marginTop:3,lineHeight:1.3}}>{block.notes}</div>}
                            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:5,flexWrap:"wrap"}}>
                              {block.assigned&&<span style={{fontSize:10,color:PERSON_COLORS[block.assigned]||"#888",fontWeight:600}}>👤 {block.assigned}</span>}
                              {block.lastEditedBy&&<span style={{fontSize:9,color:"#ccc"}}>edited by {block.lastEditedBy} {timeAgo(block.lastEditedAt)}</span>}
                            </div>
                          </div>
                        );
                      })}
                      {hBlocks.length===0&&(
                        <div onClick={()=>onAdd(d.day,hour)} style={{height:34,flex:1,borderRadius:6,border:"1.5px dashed #E0DAD4",display:"flex",alignItems:"center",paddingLeft:12,color:"#D0C8C0",fontSize:11,cursor:"pointer",transition:"all 0.15s"}}
                          onMouseOver={e=>{e.currentTarget.style.borderColor=tc.accent;e.currentTarget.style.color=tc.accent;}}
                          onMouseOut={e=>{e.currentTarget.style.borderColor="#E0DAD4";e.currentTarget.style.color="#D0C8C0";}}>
                          + add block
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChecklistView({checklist,currentUser,onStatusChange,onEdit,onAdd}){
  const [filter,setFilter]=useState("mine"); // "mine" | "all"
  const booked=checklist.filter(c=>c.status==="booked").length;
  const inProg=checklist.filter(c=>c.status==="in-progress").length;

  return(
    <div style={{maxWidth:880,margin:"0 auto",padding:"20px 16px 60px"}}>
      {/* Summary bar */}
      <div style={{background:"#fff",borderRadius:14,padding:"16px 18px",marginBottom:20,border:"1px solid #E8E0D8"}}>
        <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:140}}>
            <div style={{fontSize:11,color:"#aaa",fontWeight:600,textTransform:"uppercase",letterSpacing:0.8,marginBottom:6}}>Trip Progress</div>
            <div style={{height:6,background:"#F0EBE4",borderRadius:3,overflow:"hidden",marginBottom:6}}>
              <div style={{width:`${(booked/checklist.length)*100}%`,height:"100%",background:"#27ae60",borderRadius:3,transition:"width 0.5s"}}/>
            </div>
            <div style={{fontSize:12,color:"#888"}}>
              <span style={{color:"#27ae60",fontWeight:700}}>{booked}</span> booked · <span style={{color:"#e6960a",fontWeight:700}}>{inProg}</span> in progress · <span style={{color:"#e74c3c",fontWeight:700}}>{checklist.length-booked-inProg}</span> not started
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            {PEOPLE.map(p=>{
              const mine=checklist.filter(c=>c.assigned===p);
              const done=mine.filter(c=>c.status==="booked").length;
              return(
                <div key={p} style={{textAlign:"center"}}>
                  <div style={{width:34,height:34,borderRadius:"50%",background:PERSON_COLORS[p],display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:13,margin:"0 auto 3px",position:"relative"}}>
                    {p[0]}
                    {done===mine.length&&mine.length>0&&<span style={{position:"absolute",bottom:-2,right:-2,fontSize:9}}>✅</span>}
                  </div>
                  <div style={{fontSize:9,color:"#aaa"}}>{done}/{mine.length}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter toggle */}
      <div style={{display:"flex",gap:0,background:"#fff",borderRadius:10,padding:3,border:"1px solid #E8E0D8",width:"fit-content",marginBottom:18}}>
        {[["mine",`My Items (${currentUser})`],["all","All Items"]].map(([id,label])=>(
          <button key={id} onClick={()=>setFilter(id)} style={{background:filter===id?"#1A1A2E":"none",border:"none",color:filter===id?"#fff":"#888",borderRadius:8,padding:"6px 16px",fontSize:12,fontWeight:filter===id?600:400,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s"}}>{label}</button>
        ))}
      </div>

      {CHECKLIST_CATEGORIES.map(cat=>{
        const allItems=checklist.filter(c=>c.category===cat.id);
        const items=filter==="mine"?allItems.filter(c=>c.assigned===currentUser||c.assigned===""):allItems;
        if(items.length===0&&filter==="mine") return null;
        const catBooked=items.filter(c=>c.status==="booked").length;
        return(
          <div key={cat.id} style={{marginBottom:18}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:3,height:18,borderRadius:2,background:cat.color}}/>
                <span style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600}}>{cat.label}</span>
                <span style={{fontSize:11,color:"#bbb"}}>{catBooked}/{items.length} booked</span>
              </div>
              <button onClick={()=>onAdd(cat.id)} style={{background:"none",border:`1px solid ${cat.color}`,color:cat.color,borderRadius:10,padding:"3px 10px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ Add</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {items.map(item=>(
                <div key={item.id} style={{background:"#fff",border:"1px solid #E8E0D8",borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,transition:"border-color 0.15s",cursor:"pointer"}}
                  onMouseOver={e=>e.currentTarget.style.borderColor=cat.color}
                  onMouseOut={e=>e.currentTarget.style.borderColor="#E8E0D8"}>
                  <button onClick={e=>{e.stopPropagation();onStatusChange(item.id);}} style={{flexShrink:0,background:STATUS_COLORS[item.status]+"15",border:`1.5px solid ${STATUS_COLORS[item.status]}`,color:STATUS_COLORS[item.status],borderRadius:8,padding:"3px 7px",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
                    {STATUS_LABELS[item.status]}
                  </button>
                  <div style={{flex:1,minWidth:0}} onClick={()=>onEdit(item)}>
                    <div style={{fontSize:13,fontWeight:600,color:item.status==="booked"?"#aaa":"#1A1A2E",textDecoration:item.status==="booked"?"line-through":"none"}}>{item.title}</div>
                    <div style={{display:"flex",gap:10,marginTop:2,flexWrap:"wrap"}}>
                      {item.detail&&<span style={{fontSize:11,color:"#999"}}>{item.detail}</span>}
                      {item.date&&<span style={{fontSize:11,color:cat.color,fontWeight:600}}>📅 {item.date}</span>}
                      {item.startTime&&<span style={{fontSize:11,color:"#888"}}>🕐 {item.startTime}{item.endTime?` – ${item.endTime}`:""}</span>}
                    </div>
                    {(item.confirmNum||item.cost)&&(
                      <div style={{display:"flex",gap:10,marginTop:3}}>
                        {item.confirmNum&&<span style={{fontSize:11,color:"#27ae60",fontWeight:600}}>🔖 {item.confirmNum}</span>}
                        {item.cost&&<span style={{fontSize:11,color:"#666"}}>💴 {item.cost}</span>}
                      </div>
                    )}
                    {item.lastEditedBy&&<div style={{fontSize:9,color:"#ddd",marginTop:2}}>edited by {item.lastEditedBy} {timeAgo(item.lastEditedAt)}</div>}
                  </div>
                  {item.assigned&&(
                    <div title={item.assigned} style={{width:28,height:28,borderRadius:"50%",background:PERSON_COLORS[item.assigned]||"#ccc",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:12,flexShrink:0}}>{item.assigned[0]}</div>
                  )}
                  <span style={{color:"#DDD",fontSize:14,flexShrink:0}}>›</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Modal({modal,currentUser,onClose,onSaveBlock,onDeleteBlock,onSaveChecklist,onDeleteChecklist}){
  const [data,setData]=useState(modal.data);
  const isBlock=modal.type==="block", isEdit=modal.mode==="edit";
  const set=(k,v)=>setData(p=>({...p,[k]:v}));

  const inp={width:"100%",padding:"8px 11px",border:"1.5px solid #E0DAD4",borderRadius:8,fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#1A1A2E",background:"#FAFAF8",boxSizing:"border-box",outline:"none"};
  const lbl={display:"block",fontSize:10,fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:0.8,marginBottom:4};

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:"#fff",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:540,maxHeight:"92vh",overflowY:"auto",padding:"20px 20px 40px",boxShadow:"0 -8px 40px rgba(0,0,0,0.2)"}}>
        <div style={{width:38,height:4,background:"#E0DAD4",borderRadius:2,margin:"0 auto 18px"}}/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700}}>{isEdit?"Edit":"Add"} {isBlock?"Calendar Block":"Checklist Item"}</div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#bbb"}}>✕</button>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          {isBlock?(
            <>
              <div>
                <label style={lbl}>Type</label>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {BLOCK_TYPES.map(bt=>(
                    <button key={bt.id} onClick={()=>set("type",bt.id)} style={{background:data.type===bt.id?bt.color:bt.bg,color:data.type===bt.id?"#fff":bt.color,border:`1.5px solid ${bt.color}33`,borderRadius:16,padding:"4px 10px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>{bt.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={lbl}>Title</label>
                <input style={inp} value={data.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. Nobu Osaka, Senso-ji Temple..."/>
              </div>
              <div>
                <label style={lbl}>Day</label>
                <select style={inp} value={data.day} onChange={e=>set("day",parseInt(e.target.value))}>
                  {DAYS.map(d=><option key={d.day} value={d.day}>Day {d.day} – {d.date} ({d.city})</option>)}
                </select>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div>
                  <label style={lbl}>Start Time</label>
                  <select style={inp} value={data.startTime} onChange={e=>set("startTime",e.target.value)}>
                    <option value="">– pick time –</option>
                    {HOURS.map(h=><option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>End Time</label>
                  <select style={inp} value={data.endTime} onChange={e=>set("endTime",e.target.value)}>
                    <option value="">– pick time –</option>
                    {HOURS.map(h=><option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={lbl}>Notes</label>
                <textarea style={{...inp,resize:"vertical",minHeight:65}} value={data.notes} onChange={e=>set("notes",e.target.value)} placeholder="Details, links, reminders..."/>
              </div>
              <div>
                <label style={lbl}>Assigned To</label>
                <div style={{display:"flex",gap:8}}>
                  {["", ...PEOPLE].map(p=>(
                    <button key={p} onClick={()=>set("assigned",p)} style={{width:34,height:34,borderRadius:"50%",border:data.assigned===p?"2.5px solid #1A1A2E":"2px solid transparent",background:p?PERSON_COLORS[p]:"#EEE",color:p?"#fff":"#aaa",fontWeight:700,fontSize:12,cursor:"pointer",transition:"all 0.15s"}}>{p?p[0]:"–"}</button>
                  ))}
                </div>
              </div>
            </>
          ):(
            <>
              <div>
                <label style={lbl}>Title</label>
                <input style={inp} value={data.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. Kobe Beef restaurant – Jul 22"/>
              </div>
              <div>
                <label style={lbl}>Details</label>
                <input style={inp} value={data.detail} onChange={e=>set("detail",e.target.value)} placeholder="e.g. Jul 22 – 6 people – book ASAP"/>
              </div>
              <div>
                <label style={lbl}>Date</label>
                <input style={inp} value={data.date} onChange={e=>set("date",e.target.value)} placeholder="e.g. Jul 22"/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div>
                  <label style={lbl}>Start Time</label>
                  <select style={inp} value={data.startTime} onChange={e=>set("startTime",e.target.value)}>
                    <option value="">– none –</option>
                    {HOURS.map(h=><option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>End Time</label>
                  <select style={inp} value={data.endTime} onChange={e=>set("endTime",e.target.value)}>
                    <option value="">– none –</option>
                    {HOURS.map(h=><option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div>
                  <label style={lbl}>Status</label>
                  <select style={inp} value={data.status} onChange={e=>set("status",e.target.value)}>
                    {STATUS_CYCLE.map(s=><option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Assigned To</label>
                  <select style={inp} value={data.assigned} onChange={e=>set("assigned",e.target.value)}>
                    <option value="">– Unassigned –</option>
                    {PEOPLE.map(p=><option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div>
                  <label style={lbl}>Confirmation #</label>
                  <input style={inp} value={data.confirmNum} onChange={e=>set("confirmNum",e.target.value)} placeholder="e.g. RES-12345"/>
                </div>
                <div>
                  <label style={lbl}>Cost (Est.)</label>
                  <input style={inp} value={data.cost} onChange={e=>set("cost",e.target.value)} placeholder="e.g. ¥15,000"/>
                </div>
              </div>
              <div>
                <label style={lbl}>Notes</label>
                <textarea style={{...inp,resize:"vertical",minHeight:55}} value={data.notes} onChange={e=>set("notes",e.target.value)} placeholder="Links, reminders, special requests..."/>
              </div>
            </>
          )}
        </div>

        <div style={{display:"flex",gap:8,marginTop:20}}>
          {isEdit&&<button onClick={()=>isBlock?onDeleteBlock(data.id):onDeleteChecklist(data.id)} style={{background:"#fff",border:"1.5px solid #e74c3c",color:"#e74c3c",borderRadius:9,padding:"10px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Delete</button>}
          <button onClick={onClose} style={{background:"#F0EBE4",border:"none",color:"#888",borderRadius:9,padding:"10px 16px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
          <button onClick={()=>isBlock?onSaveBlock(data):onSaveChecklist(data)} style={{flex:1,background:"#1A1A2E",border:"none",color:"#fff",borderRadius:9,padding:"10px 16px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
            {isEdit?"Save Changes":"Add to "+(isBlock?"Calendar":"Checklist")}
          </button>
        </div>
      </div>
    </div>
  );
}
