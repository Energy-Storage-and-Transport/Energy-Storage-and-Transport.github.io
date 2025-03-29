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

function groupCompare(a, b){
  for(let i=0; i<Math.min(a["Groups"].length, b["Groups"].length); i++){
    if(a["Groups"][i]!=b["Groups"][i]){
      return a["Groups"][i]-b["Groups"][i];
    }
  }

  if(a["Groups"].length!=b["Groups"].length){
    return a["Groups"].length-b["Groups"].length;
  };
}

function slotCompare(a, b){

  const weekDays = {"monday":1, "tuesday":2, "wednesday":3, "thursday":4, "friday":5};
  let daya = weekDays[a["Slot"].split(' ')[0].trim().toLowerCase()];
  let dayb = weekDays[b["Slot"].split(' ')[0].trim().toLowerCase()];

  if(daya!=dayb){
    return daya-dayb;
  }

  let timea = a["Slot"].split(' ')[1].trim();
  let houra = parseInt(timea.split(':')[0].trim());
  let timeb = b["Slot"].split(' ')[1].trim();
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

async function fillScheduleTables(fname) {
  // Load the Excel schedule
  let [schedule, activities] = await readExcelSchedule(fname);

  // Loop over the tables for the different activities
  let tables = document.getElementsByTagName("table");
  for(table of tables){
    activity = table.getAttribute('id');

    if(!activities.includes(activity)){ 
      console.warn(activity + " not found in Excel file");
      continue;
    }

    // Filter the schedule for the specific activity
    activity_schedule = schedule.filter(row=>(row["Activity"]==activity))
    // activity_schedule.sort(slotCompare);
    activity_schedule.sort(groupCompare);

    // Add rows to the table
    for(session of activity_schedule){
      addSessionToTable(table, session)
    }
  }
}

function addSessionToTable(table, session){
  var row = document.createElement("tr");

  // Groups
  let lastGroupset = undefined;
  for(let i=table.rows.length-1; i>=0; i--){
      if(table.rows[i].cells.length==4){
        lastGroupset = table.rows[i].cells[0];
        break;
      }
  }

  var cell = document.createElement("td");
  let grp = groupsString(session["Groups"]);
  if(lastGroupset.innerHTML==grp){
    let rowspan = Number(lastGroupset.getAttribute("rowspan"));
    if(!rowspan){
      rowspan=2;
    }else{
      rowspan+=1;
    }
    lastGroupset.setAttribute("rowspan", rowspan);
  }else{
    var cellText = document.createTextNode(groupsString(session["Groups"]));
    cell.appendChild(cellText);
    row.appendChild(cell);
  }
  
  // Weeks
  var cell = document.createElement("td");
  if("Weeks" in session){
    var cellText = document.createTextNode(session["Weeks"]);
  } else {
    var cellText = document.createTextNode("-");
  }
  cell.appendChild(cellText);
  row.appendChild(cell);

  // Meeting time
  var cell = document.createElement("td");
  var cellText = document.createTextNode(session["Slot"]);
  cell.appendChild(cellText);
  row.appendChild(cell);
    
  // Locations
  var cell = document.createElement("td");
  var cellText = document.createTextNode(session["Rooms"]);
  cell.appendChild(cellText);
  row.appendChild(cell);

  table.appendChild(row);
}