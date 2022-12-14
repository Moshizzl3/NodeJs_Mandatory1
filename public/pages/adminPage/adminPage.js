const colorPicker = document.getElementById("ColorInput")
const colorButton = document.getElementById("colorButton")


if (!sessionStorage.getItem("userId")) {
  window.location.replace("/login");
}



colorButton.addEventListener('click', ()=> {
  document.body.style.backgroundColor = colorPicker.value;

  fetch(`users/${Number(sessionStorage.getItem("userId"))}`,{
    method: "PATCH",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({userColor: colorPicker.value}),
  })

})