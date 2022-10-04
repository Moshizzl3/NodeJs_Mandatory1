const navBarContainer = document.getElementById("navContainer");

const rootDiv = document.getElementById("sidePanel");

function getEntries() {
  fetch("/entries")
    .then((response) => response.json())
    .then((data) => {
      data.data.forEach((entry) => {
        console.log(entry);
        const pTag = document.createElement("p");
        pTag.textContent = entry.title;
        rootDiv.appendChild(pTag);
      });
    });
}

console.log(getEntries());
