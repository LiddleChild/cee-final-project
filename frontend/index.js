function loginHandler() {
  window.location.href = `http://localhost:3000/courseville/login`;
}

function logoutHandler() {
  window.location.href = `http://localhost:3000/courseville/logout`;
}

function getCourseHandler() {
  fetch("http://localhost:3000/api/getCalendar", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
    });
}

const not_logged_in = document.getElementById("not_logged_in");
const logged_in = document.getElementById("logged_in");
const nameField = document.getElementById("name");

function setLogin(isLoggedIn) {
  not_logged_in.style.display = !isLoggedIn ? "block" : "none";
  logged_in.style.display = isLoggedIn ? "block" : "none";
}

fetch("http://localhost:3000/courseville/get_user_info", {
  method: "GET",
  credentials: "include",
})
  .then((response) => response.json())
  .then((json) => {
    console.log(json);

    setLogin(!!json.data);
    if (!!json.data) {
      nameField.innerText = json.data.student.firstname_en + " " + json.data.student.lastname_en;
    }
  })
  .catch((err) => {
    console.error(err);
  });
