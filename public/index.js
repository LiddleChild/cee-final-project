//----------------------Buttons------------------------
let loginPanel = document.getElementsByClassName("login-panel")[0];
let logoutPanel = document.getElementsByClassName("logout-panel")[0];
let loadingScreen = document.getElementsByClassName("loading-screen")[0];
//----------------------Variables------------------------
let isLoggedIn = false;
let userInfo;

let calendarData;
let date = new Date();
let selectedDate = date;

//----------------------SideBar------------------------
// initialize SideBar class
let sideBar = new SideBar(
  document.getElementsByClassName("date-items")[0],
  document.getElementsByClassName("date")[0]
);

//----------------------Calendar------------------------
// initialize Calendar class
let calendar = new Calendar(
  document.getElementsByClassName("days")[0],
  document.getElementById("monthyear")
);

// calendar callback on selecting day
calendar.setOnSelectingDay((e, day) => {
  if (document.querySelector(".chosen"))
    document.querySelector(".chosen").classList.remove("chosen");

  if (e.target.tagName === "SPAN") e.target.closest("div").classList.add("chosen");
  else e.target.classList.add("chosen");

  selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), parseInt(day));
  updateSidebar();
});

//----------------------On JS Loaded------------------------
// check for login session
fetch(`http://${BACKEND_ADDRESS}/courseville/get_user_info`, {
  method: "GET",
  credentials: "include",
})
  .then((data) => data.json())
  .then((response) => {
    userInfo = response.data;
    isLoggedIn = !!userInfo;

    showLoadingScreen(false);
    updateLoginPanel();
    fetchData();
  })
  .catch((err) => console.error(err));

//----------------------Data fetching & Components updating------------------------
function fetchData() {
  if (isLoggedIn) {
    showLoadingScreen(true);

    calendarData = [];
    updateCalendar();

    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    const fetchOption = { method: "GET", credentials: "include" };
    fetch(`http://${BACKEND_ADDRESS}/api/get_calendar?month=${month}&year=${year}`, fetchOption)
      .then((data) => data.json())
      .then((response) => {
        showLoadingScreen(false);

        calendarData = response;

        updateCalendar();
        if (date === selectedDate) updateSidebar();
      });
  }
}

function updateCalendar() {
  calendar.update(calendarData, date);
}

function updateSidebar() {
  sideBar.update(calendarData[selectedDate.getDate()] || [], selectedDate);
}

function updateLoginPanel() {
  loginPanel.style.display = !isLoggedIn ? "flex" : "none";
  logoutPanel.style.display = isLoggedIn ? "flex" : "none";

  if (isLoggedIn) {
    let fullEnName = `${userInfo.student.firstname_en} ${userInfo.student.lastname_en}`;
    document.getElementById("username-field").innerText = fullEnName;
    document.getElementById("user-img").setAttribute("src", userInfo.account.profile_pict);
  }
}

function showLoadingScreen(show) {
  loadingScreen.style.visibility = show ? "visible" : "hidden";
}

//----------------------Button Handler------------------------
function nextMonth() {
  date = new Date(date.getFullYear(), date.getMonth() + 1);
  fetchData();
}

function previousMonth() {
  date = new Date(date.getFullYear(), date.getMonth() - 1);
  fetchData();
}

function login() {
  showLoadingScreen(true);
  window.location.href = `http://${BACKEND_ADDRESS}/courseville/login`;
}

function logout() {
  showLoadingScreen(true);
  window.location.href = `http://${BACKEND_ADDRESS}/courseville/logout`;
}
