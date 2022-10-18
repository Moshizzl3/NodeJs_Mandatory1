const navnBarLink = document.getElementById("logoutLink");

navnBarLink.addEventListener("click", () => sessionStorage.clear());

 fetch(`users/${sessionStorage.getItem("userId")}`)
  .then(response => response.json())
  .then(user =>{
    console.log(`rgba(${user.userColor})`)
    document.body.style.backgroundColor = user.data.userColor
  });

