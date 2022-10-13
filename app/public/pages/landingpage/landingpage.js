

const navBarContainer = document.getElementById("navContainer");
const sidePanelDiv = document.getElementById("sidePanel");
const contentPanelDiv = document.getElementById("contentPanel");
const modalDiv = document.getElementById("modalBody");
const myModallLabel = document.getElementById("myModallLabel");
const newEntryModal = document.getElementById("myModallLabelNewEntry");
const addEntryButton = document.getElementById("addEntryButton");

//check if a user is logged in
if (sessionStorage.getItem("userId")) {
  getEntries();
} else {
  window.location.replace("/login");
}

async function getEntries() {
  const response = await fetch(
    `/entries/user/${sessionStorage.getItem("userId")}`
  );
  const data = await response.json();

  data.data.forEach((entry) => {
    const hTag = document.createElement("p");
    hTag.classList.add("border", "entryClick", "rounded");
    hTag.id = entry.entriesId;
    hTag.textContent = entry.title;
    sidePanelDiv.appendChild(hTag);

    hTag.addEventListener("click", () => fillContentPanel(entry));
  });
}

function fillContentPanel(entry) {
  contentPanelDiv.innerHTML = "";
  entry.subEntries.forEach((subentry) => {
    //title
    const pTagTitle = document.createElement("p");
    pTagTitle.classList.add("contentTitle");
    pTagTitle.textContent = subentry.subTitle;

    //text
    const pTagText = document.createElement("text");
    pTagText.classList.add("contentText");
    pTagText.textContent = subentry.text;

    //boostrap row
    const divTagRow = document.createElement("div");
    divTagRow.classList.add(
      "row",
      "border",
      "rounded",
      "mt-4",
      "m-2",
      "contentRow"
    );

    //boststrap container
    const divTagContainer = document.createElement("div");
    divTagContainer.classList.add("container");

    divTagRow.appendChild(divTagContainer);

    divTagContainer.appendChild(pTagTitle);
    divTagContainer.appendChild(pTagText);

    //create image if there is an imageurl
    if (subentry.hasOwnProperty("imageUrl")) {
      const imageTag = document.createElement("img");
      imageTag.setAttribute("data-bs-toggle", "modal");
      imageTag.setAttribute("data-bs-target", "#myModal");
      imageTag.classList.add("img-fluid", "mx-auto", "d-block", "w-75");
      imageTag.src = subentry.imageUrl;
      divTagRow.appendChild(imageTag);

      //modal for bigger image
      imageTag.addEventListener("click", () => {
        fillModal(subentry, imageTag);
      });
    }
    contentPanelDiv.appendChild(divTagRow);
  });
}

function fillModal(data, element) {
  element.classList.remove();
  modalDiv.innerHTML = "";
  myModallLabel.textContent = data.subTitle;
  modalDiv.appendChild(element.cloneNode());
}

async function addNewEntry() {
  const newEntryName = document.getElementById("newInputTitle");

  const entry = {
    entriesId: 1,
    title: "Uge 35",
    userId: 1,
    subEntries: [
      {
        subEntriesId: 1,
        subTitle: "GitHub og git",
        text: "",
      },
    ],
  };

  const response = await fetch("/entries", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(entry)
  });

  if (response.ok){
    console.log("response ok")
  }

}

addEntryButton.addEventListener("click",  ()=>  addNewEntry().then(getEntries()));
