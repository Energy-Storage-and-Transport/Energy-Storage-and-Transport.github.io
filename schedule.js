// course information
const STARTDATE = moment("6 Sep 2021", "D MMM YYYY", true);

// group information
let GROUPS = {"AI"  :{"groups":[ 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12], "CBLroom":"Matrix 1.340", "CBLslot":1, "TMroom":"Traverse 1.25, 1.26, 1.27, 1.28, 1.29, 1.31", "BCroom":"Gemini South, 3A10", "BCslot":0},
              "AII" :{"groups":[13,14,15,16,17,18,19,20,21,22,23,24], "CBLroom":"Matrix 1.340", "CBLslot":0, "TMroom":"Traverse 1.25, 1.26, 1.27, 1.28, 1.29, 1.31", "BCroom":"Gemini South, 3A12", "BCslot":0},
              "BI"  :{"groups":[25,26,27,28,29,30,31,32,33,34,35,36], "CBLroom":"Matrix 1.340", "CBLslot":1, "TMroom":"Traverse 1.25, 1.26, 1.27, 1.28, 1.29, 1.31", "BCroom":"Gemini South, 3A10", "BCslot":0},
              "BII" :{"groups":[37,38,39,40,41,42,43,44,45,46,47,48], "CBLroom":"Matrix 1.340", "CBLslot":0, "TMroom":"Traverse 1.25, 1.26, 1.27, 1.28, 1.29, 1.31", "BCroom":"Gemini South, 3A12", "BCslot":0},
              "BIII":{"groups":[], "CBLroom":"Matrix 1.345", "CBLslot":1, "TMroom":"t.b.a.", "BCroom":"t.b.a.", "BCslot":0}};
for (let group in GROUPS) { GROUPS[group]["TMslot"] = 1-GROUPS[group]["CBLslot"]; }

// constants
let BLOCKS = {"A":[{"day":"Mon", "CBLstarttime": "8:45", "CBLendtime":"12:30", "TMstarttime":["10:45","11:45"], "TMendtime":["11:45","12:45"], "BCstarttime": "8:45", "BCendtime":"12:30"},
                   {"day":"Thu", "CBLstarttime":"13:30", "CBLendtime":"17:15", "TMstarttime":["13:30","14:30"], "TMendtime":["14:30","15:30"]}],
              "B":[{"day":"Mon", "CBLstarttime":"13:30", "CBLendtime":"17:15", "TMstarttime":["15:30","16:30"], "TMendtime":["16:30","17:30"], "BCstarttime": "13:30", "BCendtime":"17:15"},
                   {"day":"Wed", "CBLstarttime": "8:45", "CBLendtime":"12:30", "TMstarttime":["10:45","11:45"], "TMendtime":["11:45","12:45"]}]};

// get the date and time
function getMoment(week, day, time) {
  let [hour,minute] = time.split(":").map(Number);
  let days = moment(day,"ddd",true).isoWeekday(); // Mon=1, Sun=7
  let date = STARTDATE.clone().add({weeks:week-1, days:days-1});
  date.set({hour:hour,minute:minute});
  return date;
}

// get a property from a block
function getBlockProperty(elem, key) {
  let property;
  if (elem.hasAttribute(key)) {
    property = elem.getAttribute(key);
  } else {
    if (!elem.parentNode.hasAttribute("group")  ||
        !elem.parentNode.hasAttribute("meeting")  ) {
      return null;
    }
    let group   = elem.parentNode.getAttribute("group");
    let meeting = elem.parentNode.getAttribute("meeting");
    let slot    = GROUPS[group][meeting.concat("slot")];

    if (key == "day") {
      property = BLOCKS[group[0]][slot][key];
    } else {
      property = BLOCKS[group[0]][slot][meeting.concat(key)];
    }

    if (Array.isArray(property)) {
      console.assert(elem.parentNode.hasAttribute("select"), "missing select attribute");
      property = property[Number(elem.parentNode.getAttribute("select")=="even")]
    }
  }
  return property;
}

// get the time information
function getTimeslot(elem) {

  // get the week (e.g, 1)
  let week = elem.getAttribute("week");

  // get the day (e.g., "Mon")
  let day = getBlockProperty(elem, "day");

  // get the start time (e.g., "8:45")
  let starttime = getBlockProperty(elem, "starttime");

  // get the end time (e.g., "12:30")
  let endtime = getBlockProperty(elem, "endtime");

  // if there is only a starttime
  if (endtime==null) {
    return getMoment(week,day,starttime).format("ddd D-M, k:mm");
  } else {
    return [getMoment(week,day,starttime).format("ddd D-M, k:mm"),
            getMoment(week,day,endtime).format("k:mm")            ].join("-");
  }
}

function setDate(elem) {
  let weeks = JSON.parse(elem.getAttribute("week"));
  if (!Array.isArray(weeks)) { weeks = [weeks]; }

  let strings = [];
  for (week of weeks) {
    elem.setAttribute("week", week);
    strings.push(getTimeslot(elem));
  }

  return strings.join("<br>");
}

function setLocation(elem) {
  return GROUPS[elem.parentNode.getAttribute("group")][elem.parentNode.getAttribute("meeting").concat("room")];
}

function setGroups(elem) {
  let groups = [];
  let match  = elem.parentNode.getAttribute("group");
  if (match.length==1) {
    for (let key in GROUPS) {
      if (key.startsWith(match)) {
        groups = groups.concat(GROUPS[key]["groups"]);
      }
    }
  } else {
    groups = GROUPS[match]["groups"];
  }

  groups = groups.sort((a,b)=>a-b);

  if (elem.parentNode.hasAttribute("select")) {
    let modulo = {"odd":1, "even":0};
    groups = groups.filter(g => g%2==modulo[elem.parentNode.getAttribute("select")]);
  }

  //check whether the list is contiguous
  for (let i=0; i< groups.length-1; i++) {
    if (groups[i+1] !== groups[i]+1) { return groups.join(", "); }
  }
  return [groups[0],groups[groups.length-1]].join("-");
}

//===================================//
// Loop over the tables              //
//===================================//

// Time information in tables
var elems = document.getElementsByClassName("date");
for (let elem of elems) {
  elem.innerHTML = setDate(elem);
}

// Group information in tables
var elems = document.getElementsByClassName("groups");
for (let elem of elems) {
  elem.innerHTML = setGroups(elem);
}

// Location information in tables
var elems = document.getElementsByClassName("location");
for (let elem of elems) {
  elem.innerHTML = setLocation(elem);
}
