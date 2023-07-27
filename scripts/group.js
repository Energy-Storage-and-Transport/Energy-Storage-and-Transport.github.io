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

  // Supply and demand table
  document.querySelector('#supplydescription').innerHTML = groupInfo[groupKeys[team]]["supplyInfo"];
  document.querySelector('#demanddescription').innerHTML = groupInfo[groupKeys[team]]["demandInfo"];

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

    document.querySelector("#" + key + "-slot").innerHTML = info["slot"];

    let room = info["rooms"];
    if(Array.isArray(info["rooms"])){
      room = room[info["groups"].indexOf(parseInt(groupKeys[team]))];
    };

    document.querySelector("#" + key + "-room").innerHTML = room;

    if ("weeks" in info){
      document.querySelector("#" + key + "-weeks").innerHTML = info["weeks"];
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