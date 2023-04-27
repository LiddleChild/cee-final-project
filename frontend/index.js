/** @format */

const backendIPAddress = "localhost:3000";
//----------------------Buttons------------------------
let loginPanel = document.getElementsByClassName("login-panel")[0];
let logoutPanel = document.getElementsByClassName("logout-panel")[0];
//-----------------------------------------------------
let monthHeader = document.getElementById("monthyear");
let monthList = {
  Jan: { name: "January", day: 31 },
  Feb: { name: "February", day: 28 },
  Mar: { name: "March", day: 31 },
  Apr: { name: "April", day: 30 },
  May: { name: "May", day: 31 },
  Jun: { name: "June", day: 30 },
  Jul: { name: "July", day: 31 },
  Aug: { name: "August", day: 31 },
  Sep: { name: "September", day: 30 },
  Oct: { name: "October", day: 31 },
  Nov: { name: "November", day: 30 },
  Dec: { name: "December", day: 31 },
};
let dayUl = document.getElementById("dayUl");
var userInfo = undefined;
//----------------------Date---------------------------
let d = new Date();
let chosenDate = d.toString().split(" ");
console.log(chosenDate);
var firstDayOfMonth = new Date(
  monthList[chosenDate[1]].name + " 1, " + chosenDate[3] + " 00:00:00"
);
let currentDate = firstDayOfMonth.toString().split(" ");
var firstWeekday = firstDayOfMonth.getDay();
//-----------------------------------------------------
// SideBar class (init, update side bar)
let sideBar = new SideBar(
  document.getElementsByClassName("date-items")[0],
  document.getElementsByClassName("date")[0]
);

var calendar;
initiateCal();
getCalendar();

function initiateSidebar() {
  document.getElementsByClassName("date")[0].innerHTML =
    chosenDate[2] + " " + chosenDate[1] + " " + chosenDate[3];

  var itemList = document.getElementsByClassName("date-items")[0];

  // Clear all children
  while (itemList.firstChild) itemList.removeChild(itemList.firstChild);

  var none = document.createElement("div");
  none.innerHTML = "Nothing to do today!";
  itemList.appendChild(none);
  var addButton = createAddButton();
  itemList.appendChild(addButton);
}

async function initiateCal() {
  while (dayUl.firstChild) {
    dayUl.removeChild(dayUl.firstChild);
  }

  monthHeader.innerHTML = monthList[currentDate[1]].name + " " + currentDate[3];

  addEmptyDays();

  for (let i = 1; i <= monthList[currentDate[1]].day; i++) {
    var li = document.createElement("div");
    let text = document.createElement("span");
    text.innerText = i;
    li.appendChild(text);
    li.onclick = function (e) {
      chosenDate[2] = i;
      if (document.querySelector(".chosen"))
        document.querySelector(".chosen").classList.remove("chosen");
      if (e.target.tagName === "SPAN") {
        e.target.closest("div").classList.add("chosen");
      } else {
        e.target.classList.add("chosen");
      }
      updateSidebar();
    };
    dayUl.appendChild(li);
  }
  addNextMonthDays();
}

function getCalendar() {
  fetch(
    `http://localhost:3000/api/get_calendar?month=${
      firstDayOfMonth.getMonth() + 1
    }&year=${firstDayOfMonth.getFullYear()}`,
    {
      method: "GET",
      credentials: "include",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      calendar = data;
    });
}

function updateSidebar() {
  if (chosenDate[2] in calendar) {
    sideBar.update(calendar[chosenDate[2]], new Date(chosenDate.join(" ")));
  }
}

function createAddButton() {
  var addButton = document.createElement("button");
  addButton.appendChild(document.createTextNode("+"));
  addButton.setAttribute("class", "addButton");
  return addButton;
}
async function updateCal() {
  getCalendar();
  const res = await fetch(
    `http://localhost:3000/api/get_calendar?month=${
      firstDayOfMonth.getMonth() + 1
    }&year=${firstDayOfMonth.getFullYear()}`
  );
  while (dayUl.firstChild) {
    dayUl.removeChild(dayUl.firstChild);
  }

  monthHeader.innerHTML = monthList[currentDate[1]].name + " " + currentDate[3];

  addEmptyDays();

  for (let i = 1; i <= monthList[currentDate[1]].day; i++) {
    var li = document.createElement("div");
    let text = document.createElement("span");
    text.innerText = i;
    li.appendChild(text);
    // if (calendar[i] != undefined) li.setAttribute("class", "active"); //highlight day with assignments
    li.setAttribute("class", `active ${calendar[i] ? "pinned" : ""}`);
    li.onclick = function (e) {
      chosenDate[2] = i;
      if (document.querySelector(".chosen"))
        document.querySelector(".chosen").classList.remove("chosen");
      if (e.target.tagName === "SPAN") {
        e.target.closest("div").classList.add("chosen");
      } else {
        e.target.classList.add("chosen");
      }
      updateSidebar();
    };
    dayUl.appendChild(li);
  }
  addNextMonthDays();
  updateSidebar();
}

function addEmptyDays() {
  previousMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() - 1, 1);
  previousMonth = monthList[previousMonth.toString().split(" ")[1]].day;
  for (let i = previousMonth - firstWeekday + 1; i <= previousMonth; i++) {
    var empty = document.createElement("div");
    empty.appendChild(document.createTextNode(i));
    empty.style.color = "#ccc";
    dayUl.appendChild(empty);
  }
}
function addNextMonthDays() {
  var lastDay = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 0);
  lastDay = lastDay.getDay() + 1;

  for (let i = 1; i <= 7 - lastDay; i++) {
    var day = document.createElement("div");
    day.appendChild(document.createTextNode(i));
    day.style.color = "#ccc";
    dayUl.appendChild(day);
  }
}

function nextMonth() {
  if (firstDayOfMonth.getMonth() == 11) {
    firstDayOfMonth = new Date(firstDayOfMonth.getFullYear() + 1, 0, 1);
  } else {
    firstDayOfMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 1);
  }
  currentDate = firstDayOfMonth.toString().split(" ");
  firstWeekday = firstDayOfMonth.getDay();
  chosenDate = currentDate;
  updateCal();
}

function prevMonth() {
  if (firstDayOfMonth.getMonth() == 1) {
    firstDayOfMonth = new Date(firstDayOfMonth.getFullYear() - 1, 12, 1);
  } else {
    firstDayOfMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() - 1, 1);
  }
  currentDate = firstDayOfMonth.toString().split(" ");
  firstWeekday = firstDayOfMonth.getDay();
  chosenDate = currentDate;
  updateCal();
}

function toggleButton() {
  fetch("http://localhost:3000/courseville/get_user_info", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((json) => {
      userInfo = json.data;

      loginPanel.style.display = !userInfo ? "block" : "none";
      logoutPanel.style.display = !!userInfo ? "block" : "none";

      if (userInfo) {
        document.querySelector(
          "#username-field"
        ).innerText = `${userInfo.student.firstname_en} ${userInfo.student.lastname_en}`;
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

toggleButton();

function login() {
  window.location.href = `http://${backendIPAddress}/courseville/login`;
  toggleButton();
}

function logout() {
  window.location.href = `http://${backendIPAddress}/courseville/logout`;
  toggleButton();
}

updateCal();
