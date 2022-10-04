const loginButton = document.getElementById("login-button");
const navBarContainer = document.getElementById("navContainer");

navBarContainer.style.display = "block"; //Hides the navbar on loginpage

function getDataFromForm() {
  const form = document.getElementById("login-form");
  const data = new FormData(form);

  for (let [key, value] of data) {
    console.log(key, value);
  }
  console.log([data.get("email")]);
}

loginButton.addEventListener("click", getDataFromForm);
