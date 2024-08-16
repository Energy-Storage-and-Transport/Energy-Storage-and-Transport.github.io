// Load the teams data
var request = new XMLHttpRequest();
request.open("GET", "data/Teams.json", false);
request.send(null);
const groupInfo = JSON.parse(request.responseText);
const groupKeys = Object.keys(groupInfo);

// Load the schedule
var request = new XMLHttpRequest();
request.open("GET", "data/Schedule.json", false);
request.send(null);
const scheduleInfo = JSON.parse(request.responseText);
const scheduleKeys = Object.keys(scheduleInfo);

// Cookie to store group ID
function setCookie(cname,cvalue,exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
  
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return -1;
}

// Change the group (called when selector is changed)
function changeGroup() {
  let oldgroup = getCookie("group");
  let newgroup = -1;

  const selects = document.querySelectorAll('select');
  selects.forEach((select) => {
    if (select.value > -1 && select.value != oldgroup){
      newgroup = select.value;
    }
  });
  setCookie("group", newgroup, 100);
  setTeamData(newgroup);
}

function setTeamData(team){

  // Set selectors
  const selects = document.querySelectorAll('select');
  selects.forEach((select) => { select.value = team; });

  // Only proceed if a team as been selected (i.e., team >= 0)
  if (team < 0){ return; }

  setTeamFiles(team);
  setTeamSchedule(team);
}

function setTeamFiles(team){
  
  supplyObject = document.querySelector('#supplydescription');
  if (supplyObject === null){ return; }

  demandObject = document.querySelector('#demanddescription');
  if (demandObject === null){ return; }

  // Supply and demand table
  supplyObject.innerHTML = groupInfo[groupKeys[team]]["supplyInfo"];
  demandObject.innerHTML = groupInfo[groupKeys[team]]["demandInfo"];

  var supplyLink = document.createElement('a');
  supplyLink.setAttribute('href', 'data/' + groupInfo[groupKeys[team]]["supplyFile"]);
  supplyLink.setAttribute('download', groupInfo[groupKeys[team]]["supplyFile"]);
  supplyLink.innerHTML = groupInfo[groupKeys[team]]["supplyFile"];

  let supplyFile = document.querySelector('#supplyfile');
  supplyFile.replaceChild(supplyLink, supplyFile.childNodes[0]);

  var demandLink = document.createElement('a');
  demandLink.setAttribute('href', 'data/' + groupInfo[groupKeys[team]]["demandFile"]);
  demandLink.setAttribute('download', groupInfo[groupKeys[team]]["demandFile"]);
  demandLink.innerHTML = groupInfo[groupKeys[team]]["demandFile"];

  let demandFile = document.querySelector('#demandfile');
  demandFile.replaceChild(demandLink, demandFile.childNodes[0]);
}

function setTeamSchedule(team){

  // Schedule
  for (let i=0; i<scheduleKeys.length; i++){
    let key = scheduleKeys[i];
    let info;
    for (let j=0; j<scheduleInfo[key].length; j++){
      info = scheduleInfo[key][j]
      if(info["groups"].includes(parseInt(groupKeys[team]))){
        break;
      }
    }

    slotObject = document.querySelector("#" + key + "-slot");
    if (slotObject !== null){
      slotObject.innerHTML = info["slot"];  
    }

    let room = info["rooms"];
    if(Array.isArray(info["rooms"])){
      room = room[info["groups"].indexOf(parseInt(groupKeys[team]))];
    };

    roomObject = document.querySelector("#" + key + "-room");
    if (roomObject !== null){
      roomObject.innerHTML = room;
    }
    
    if ("weeks" in info){
      weekObject = document.querySelector("#" + key + "-weeks");
      if (weekObject !== null){
        weekObject.innerHTML = info["weeks"];
      }
    }
  }
}

function initGroups() {
  const selects = document.querySelectorAll('select');
  selects.forEach((select) => {
    for (let i = 0; i < groupKeys.length; i++) {
      let newOption = new Option('Team ' + groupKeys[i].padStart(2, '0'), i);
      select.add(newOption,undefined);
    }
  });
  setTeamData(getCookie("group"));
}

function slotCompare(a, b){
  const weekDays = {"monday":1, "tuesday":2, "wednesday":3, "thursday":4, "friday":5};
  let daya = weekDays[a["slot"].split(' ')[0].trim().toLowerCase()];
  let dayb = weekDays[b["slot"].split(' ')[0].trim().toLowerCase()];

  if(daya!=dayb){
    return daya-dayb;
  }

  let timea = a["slot"].split(' ')[1].trim();
  let houra = parseInt(timea.split(':')[0].trim());
  let timeb = b["slot"].split(' ')[1].trim();
  let hourb = parseInt(timeb.split(':')[0].trim());

  if(houra!=hourb){
    return houra-hourb;
  }
  
  let mina  = parseInt(timea.split(':')[1].trim());
  let minb  = parseInt(timeb.split(':')[1].trim());

  return mina-minb;
}

function groupsString(groups){
  let groupsets = [];
  let groupset = [];
  for(group of groups){
    if(groupset.length==0 || groupset[groupset.length-1]==group-1)
    {
      groupset.push(group)
    }
    else
    {
      groupsets.push(groupset);
      groupset = [group];
    }
  }
  groupsets.push(groupset);

  let strings = [];
  for( groupset of groupsets)
  {
    let first = groupset[0];
    let last  = groupset[groupset.length-1];

    if(last-first==0)
    {
      strings.push(first.toString());
    }
    else if(last-first==1)
    {
      strings.push(first.toString());
      strings.push(last.toString());
    }
    else
    {
      strings.push(first.toString() + '-' + last.toString());
    }
  }
  return strings.join(',');
}

function fillScheduleTables() {
  let tables = document.getElementsByTagName("table");
  for(table of tables){
    keys = table.getAttribute('id').split(",");
    let sessions = [];
    for(key of keys){
      sessions = sessions.concat(scheduleInfo[key]);
    }

    sessions.sort(slotCompare);
    for(session of sessions){
      var row = document.createElement("tr");

      // Meeting time
      var cell = document.createElement("td");
      var cellText = document.createTextNode(session["slot"]);
      cell.appendChild(cellText);
      row.appendChild(cell);

      // Weeks
      var cell = document.createElement("td");
      if("weeks" in session){
        var cellText = document.createTextNode(session["weeks"]);
      } else {
        var cellText = document.createTextNode("-");
      }
      cell.appendChild(cellText);
      row.appendChild(cell);
      
      // Groups
      var cell = document.createElement("td");
      var cellText = document.createTextNode(groupsString(session["groups"]));
      cell.appendChild(cellText);
      row.appendChild(cell);

      // Locations
      var cell = document.createElement("td");
      var cellText = document.createTextNode(session["rooms"]);
      cell.appendChild(cellText);
      row.appendChild(cell);

      table.appendChild(row);
    }
  }
}