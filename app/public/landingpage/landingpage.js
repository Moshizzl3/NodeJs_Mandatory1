const rootDiv = document.getElementById("root");

function getEntries() {
  fetch("/entries")
    .then((response) => response.json())
    .then((data) => {
      data.data.forEach((element) => {
        console.log(element);
        const pTag = document.createElement("p");
        pTag.textContent = element.title;
        rootDiv.appendChild(pTag);
      });
    });
}

console.log(getEntries());
