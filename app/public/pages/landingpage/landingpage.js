const navBarContainer = document.getElementById("navContainer");
const sidePanelDiv = document.getElementById("sidePanel");
const contentPanelDiv = document.getElementById("contentPanel");

async function getEntries() {

  const response = await fetch(`/entries/user/${sessionStorage.getItem("userId")}`);
  const data = await response.json();

  data.data.forEach((entry) => {
    console.log(entry);
    const hTag = document.createElement("h4");
    hTag.classList.add("border");
    hTag.id = entry.entriesId;
    hTag.textContent = entry.title;
    sidePanelDiv.appendChild(hTag);

    hTag.addEventListener("click", () => fillContent(entry));
  });
}

 function fillContent(entry) {
  contentPanelDiv.innerHTML = ""
  entry.subEntries.forEach( subentry => {
    const hTag = document.createElement("p");
    hTag.classList.add("border");
    hTag.id = entry.entriesId;
    hTag.textContent = subentry.text;
    contentPanelDiv.appendChild(hTag);
  })
}

getEntries();
