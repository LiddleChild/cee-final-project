/** @format */

const backendIPAddress = "localhost:3000";
//----------------------Buttons------------------------
let logoutButton = document.getElementById("logout");
let loginButton = document.getElementById("login");
//-----------------------------------------------------
let monthHeader = document.getElementById("monthyear");
let monthLi = {
  Jan: ["January", 31],
  Feb: ["February", 28],
  Mar: ["March", 31],
  Apr: ["April", 30],
  May: ["May", 31],
  Jun: ["June", 30],
  Jul: ["July", 31],
  Aug: ["August", 31],
  Sep: ["September", 30],
  Oct: ["October", 31],
  Nov: ["November", 30],
  Dec: ["December", 31],
};
let dayUl = document.getElementById("dayUl");
var userInfo = undefined;
//----------------------Date---------------------------
let d = new Date();
let chosenDate = d.toString().split(" ");
var firstDayOfMonth = new Date(
  monthLi[chosenDate[1]][0] + " 1, " + chosenDate[3] + " 00:00:00"
);
let currentDate = firstDayOfMonth.toString().split(" ");
var firstWeekday = firstDayOfMonth.getDay();
//-----------------------------------------------------
var calendar;

getCalendar();
console.log(firstWeekday);

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
    })
    .then(() => {
      console.log(calendar);
    });
}

function updateSidebar() {
  console.log(chosenDate[2]);
  document.getElementsByClassName("date")[0].innerHTML =
    chosenDate[2] + " " + chosenDate[1] + " " + chosenDate[3];
  var itemList = document.getElementsByClassName("items")[0];
  while (itemList.firstChild) itemList.removeChild(itemList.firstChild);
  var chosenAssignmentList = [];

  if (chosenDate[2] in calendar) {
    chosenAssignmentList = calendar[chosenDate[2]];
    for (let i = 0; i < chosenAssignmentList.length; i++) {
      var item = document.createElement("li");
      if (
        (i > 0 &&
          chosenAssignmentList[i]["course_no"] !=
            chosenAssignmentList[i - 1]["course_no"]) ||
        i == 0
      ) {
        var subject = document.createElement("h2");
        subject.innerHTML = chosenAssignmentList[i]["course_title"];
        console.log(subject);
        itemList.appendChild(subject);
      }
      var dueDate = new Date(
        chosenAssignmentList[i]["assignment_duetime"] * 1000
      );
      item.innerHTML =
        dueDate.toTimeString().split(" ")[0] +
        ": " +
        chosenAssignmentList[i]["assignment_title"];
      itemList.appendChild(item);
    }
  } else {
    var none = document.createElement("li");
    none.innerHTML = "Nothing to do today!";
    itemList.appendChild(none);
  }
  var addButton = createAddButton();
  itemList.appendChild(addButton);
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
  monthHeader.innerHTML = monthLi[currentDate[1]][0] + " " + currentDate[3];

  addEmptyDays();

  for (let i = 1; i <= monthLi[currentDate[1]][1]; i++) {
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(i));
    if (calendar[i] != undefined) li.setAttribute("class", "active"); //highlight day with assignments
    li.onclick = function () {
      chosenDate[2] = i;
      updateSidebar();
    };
    dayUl.appendChild(li);
  }
  addNextMonthDays();
  updateSidebar();
}

function addEmptyDays() {
  previousMonth = new Date(
    firstDayOfMonth.getFullYear(),
    firstDayOfMonth.getMonth() - 1,
    1
  );
  previousMonth = monthLi[previousMonth.toString().split(" ")[1]][1];
  console.log(previousMonth);
  for (let i = previousMonth - firstWeekday + 1; i <= previousMonth; i++) {
    var empty = document.createElement("li");
    empty.appendChild(document.createTextNode(i));
    empty.style.color = "gray";
    dayUl.appendChild(empty);
  }
}
function addNextMonthDays() {
  var lastDay = new Date(
    firstDayOfMonth.getFullYear(),
    firstDayOfMonth.getMonth() + 1,
    0
  );
  lastDay = lastDay.getDay() + 1;
  console.log(lastDay);

  for (let i = 1; i <= 7 - lastDay; i++) {
    var day = document.createElement("li");
    day.appendChild(document.createTextNode(i));
    day.style.color = "gray";
    dayUl.appendChild(day);
  }
}

function nextMonth() {
  if (firstDayOfMonth.getMonth() == 11) {
    firstDayOfMonth = new Date(firstDayOfMonth.getFullYear() + 1, 0, 1);
  } else {
    firstDayOfMonth = new Date(
      firstDayOfMonth.getFullYear(),
      firstDayOfMonth.getMonth() + 1,
      1
    );
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
    firstDayOfMonth = new Date(
      firstDayOfMonth.getFullYear(),
      firstDayOfMonth.getMonth() - 1,
      1
    );
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
      console.log(json);
      userInfo = json.data;
      console.log(userInfo);
      if (userInfo == undefined) {
        loginButton.style.display = "block";
        logoutButton.style.display = "none";
      } else {
        loginButton.style.display = "none";
        logoutButton.style.display = "block";
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
