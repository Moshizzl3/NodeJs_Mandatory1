const loginButton = document.getElementById("login-button");
const navBarContainer = document.getElementById("navContainer");

async function getDataFromForm() {
  const form = document.getElementById("login-form");
  const formData = new FormData(form);

  const response = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });
  
  if(response.ok) {
    const data = await response.json();
    sessionStorage.setItem("userId", data.data);
    window.location.replace("/");
  } else {
    //TODO add some text to user of wrong input
  }
}

loginButton.addEventListener("click", getDataFromForm);
