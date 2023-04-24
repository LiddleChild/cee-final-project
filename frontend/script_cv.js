const backendIPAddress = "localhost:3000";
var logoutButton = document.getElementById("logout"); 
var loginButton = document.getElementById("login");
var userInfo = undefined

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