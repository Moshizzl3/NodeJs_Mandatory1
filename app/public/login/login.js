const loginButton = document.getElementById("login-button")


function getDataFromForm() {
  const form = document.getElementById("login-form");
  const data = new FormData(form);
  
  for (let [key, value] of data) {
    console.log(key, value);
  }
  console.log("sup")
}

loginButton.addEventListener('click', getDataFromForm)