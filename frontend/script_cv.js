const backendIPAddress = "localhost:3000";
//----------------------Buttons------------------------
let logoutButton = document.getElementById("logout"); 
let loginButton = document.getElementById("login");
//-----------------------------------------------------
let monthHeader = document.getElementById("monthyear");
let monthLi = {"Jan": ["January",31], "Feb": ["February",28], "Mar": ["March",31], "Apr": ["April",30],  "May": ["May",31],  "Jun": ["June",30], "Jul": ["July", 31],  "Aug": ["August",31], "Sep": ["September",30],"Oct": ["October",31], "Nov": ["November",30], "Dec": ["December",31]}
let dayUl = document.getElementById("dayUl")
var userInfo = undefined;
//----------------------Date---------------------------
let d = new Date();
let initialDate = d.toString().split(" ")
var firstDayOfMonth = new Date(monthLi[initialDate[1]][0] + " 1, " + initialDate[3] + " 00:00:00")
let currentDate = firstDayOfMonth.toString().split(" ")
var firstWeekday = firstDayOfMonth.getDay()
//-----------------------------------------------------




console.log(initialDate)

function updateCal() { 

  while(dayUl.firstChild){
    dayUl.removeChild(dayUl.firstChild)
  }
  monthHeader.innerHTML = monthLi[currentDate[1]][0] + " " + currentDate[3]
  addEmptyDays()
  fetch("http://localhost:3000/api/get_calendar", {
  method: "GET",
  credentials: "include",
})
  .then((response) => response.json())
  .then((json) => { 
    console.log(json);
    for(let i = 1; i <= monthLi[currentDate[1]][1]; i++){
      var li = document.createElement("li")
      li.appendChild(document.createTextNode(i))
      if(json[i] != undefined) li.style.color = "red"
      dayUl.appendChild(li)
    }
  })
  .catch((err) => {
    console.error(err);     
  });
  
  
}
function addEmptyDays(){
  for(let i = 1; i < firstWeekday; i++ ){
    var empty = document.createElement("li")
    empty.style.borderStyle = "hidden"
    empty.style.paddingRight = "5px"
    dayUl.appendChild(empty)
  }
}

function nextMonth(){
  if (firstDayOfMonth.getMonth() == 11) {
    firstDayOfMonth = new Date(firstDayOfMonth.getFullYear() + 1, 0, 1);
} else {
    firstDayOfMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 1);            
}
currentDate = firstDayOfMonth.toString().split(" ")
firstWeekday = firstDayOfMonth.getDay()
updateCal()
}

function prevMonth(){
  if (firstDayOfMonth.getMonth() == 1) {
    firstDayOfMonth = new Date(firstDayOfMonth.getFullYear() - 1, 12, 1);
} else {
    firstDayOfMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() - 1, 1);            
}
currentDate = firstDayOfMonth.toString().split(" ")
firstWeekday = firstDayOfMonth.getDay()
updateCal()
}


function toggleButton() {
    fetch("http://localhost:3000/courseville/get_user_info", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((json) => { 
      console.log(json);
      userInfo = json.data
      console.log(userInfo)
      if(userInfo == undefined){
        loginButton.style.display = "block"
        logoutButton.style.display = "none"
      }
      else{
        loginButton.style.display = "none"
        logoutButton.style.display = "block"
      }

    })
    .catch((err) => {
      console.error(err);     
    });
  }
  
toggleButton()

function login() {
  window.location.href = `http://${backendIPAddress}/courseville/login`;
  toggleButton()

};

function logout() {
  window.location.href =  `http://${backendIPAddress}/courseville/logout`;
  toggleButton()
}

updateCal()


