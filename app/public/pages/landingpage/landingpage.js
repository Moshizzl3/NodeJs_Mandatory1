const navBarContainer = document.getElementById("navContainer");

const rootDiv = document.getElementById("sidePanel");

async function getEntries() {
  const response = await fetch("/entries");
  const data = await response.json();

  data.data.forEach((entry) => {
    console.log(entry);
    const pTag = document.createElement("p");
    pTag.textContent = entry.title;
    rootDiv.appendChild(pTag);
  });
}

console.log(getEntries());
