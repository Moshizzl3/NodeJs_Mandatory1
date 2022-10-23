const navBarContainer = document.getElementById("navContainer");
const sidePanelDiv = document.getElementById("sidePanel");
const contentPanelDiv = document.getElementById("contentPanel");
const modalDiv = document.getElementById("modalBody");
const myModallLabel = document.getElementById("myModallLabel");
const newEntryModal = document.getElementById("myModallLabelNewEntry");
const addEntryButton = document.getElementById("addEntryButton");
let addSubEntryButton = document.querySelector(".addSubEntryButtonModal");
const searchBarButton = document.getElementById("searchbarButton");
const addNewImageButton = document.getElementById("addNewImageButton");

//check if a user is logged in
if (sessionStorage.getItem("userId")) {
  getEntries();
} else {
  window.location.replace("/login");
}

async function getEntries() {
  sidePanelDiv.innerHTML = "";

  //boostrap row for button
  const divTagRowButton = document.createElement("div");
  divTagRowButton.classList.add("row", "m-1", "contentRowButton");

  //bootstrap button
  const buttonTag = document.createElement("button");
  buttonTag.type = "button";
  buttonTag.id = "addEntryButtonModal";
  buttonTag.classList.add("btn", "addButton", "btn-sm");
  buttonTag.setAttribute("data-bs-toggle", "modal");
  buttonTag.setAttribute("data-bs-target", "#myModalNewEntry");
  buttonTag.textContent = "Opret ny";

  //add botton to rown
  divTagRowButton.appendChild(buttonTag);
  sidePanelDiv.appendChild(divTagRowButton);

  const response = await fetch(
    `/entries/user/${sessionStorage.getItem(
      "userId"
    )}/${document.title.toLowerCase()}`
  );
  const data = await response.json();

  data.data.forEach((entry) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("container", "d-flex");

    const hTag = document.createElement("p");
    hTag.classList.add("border", "entryClick", "rounded");
    hTag.textContent = entry.title;

    hTag.addEventListener("click", () => fillContentPanel(entry));
    sidePanelDiv.append(hTag);
  });
}

function fillContentPanel(entry) {
  const panelEntryId = document.getElementById("contentPanelEntryId");
  panelEntryId.textContent = entry.entriesId;
  contentPanelDiv.innerHTML = "";

  //boostrap row for button
  const divTagRowButton = document.createElement("div");
  divTagRowButton.classList.add("row", "m-1", "contentRowButton");
  const hTagTitle = document.createElement("h3");
  hTagTitle.setAttribute("contentEditable", true);
  hTagTitle.id = "entryTitle";
  hTagTitle.classList.add("text-center");
  hTagTitle.textContent = entry.title;
  hTagTitle.addEventListener("blur", () => {
    editEntry(entry);
  });

  divTagRowButton.appendChild(hTagTitle);

  //delete entry div
  const divTagRowDelete = document.createElement("div");
  divTagRowDelete.classList.add(
    "row",
    "m-1",
    "contentRowButton",
    "justify-content-end"
  );
  const iconDeleteTag = document.createElement("i");
  iconDeleteTag.id = entry.entriesId;
  iconDeleteTag.classList.add(
    "fa",
    "fa-solid",
    "fa-trash",
    "col-1",
    "trashIcon"
  );
  divTagRowDelete.appendChild(iconDeleteTag);
  contentPanelDiv.append(divTagRowDelete);
  iconDeleteTag.addEventListener("click", () => {
    fetch(`entries/${entry.entriesId}`, {
      method: "DELETE",
      headers: {
        "Content-typee": "application/json",
      },
    }).then(getEntries());
    contentPanelDiv.innerHTML = "";
  });

  //bootstrap button
  const buttonTag = document.createElement("button");
  buttonTag.type = "button";
  buttonTag.id = `addSubEntryButton`;
  buttonTag.classList.add("btn", "btn-sm", "mt-2", "addButton");
  buttonTag.setAttribute("data-bs-toggle", "modal");
  buttonTag.setAttribute("data-bs-target", "#myModalNewSubEntry");
  buttonTag.textContent = "Opret ny";

  //add botton to rown
  divTagRowButton.appendChild(buttonTag);
  contentPanelDiv.appendChild(divTagRowButton);

  entry.subEntries.forEach((subentry) => {
    appendContentPanel(entry, subentry);
  });
  addSubEntryButton.id = entry.entriesId;
}

function appendContentPanel(entry, subentry) {
  //delete subentry button
  const iconeDeleteTag = document.createElement("i");
  const divTagRowDelete = document.createElement("div");
  divTagRowDelete.classList.add(
    "row",
    "m-1",
    "contentRowButton",
    "justify-content-end"
  );
  const divImageAdd = divTagRowDelete.cloneNode(true);
  iconeDeleteTag.id = subentry.subEntriesId;
  iconeDeleteTag.classList.add(
    "fa",
    "fa-solid",
    "fa-trash",
    "col-1",
    "trashIcon"
  );
  iconeDeleteTag.addEventListener("click", () => {
    fetch(`entries/${entry.entriesId}/${subentry.subEntriesId}`, {
      method: "DELETE",
      headers: {
        "Content-typee": "application/json",
      },
    }).then((response) =>
      response.json().then((data) => fillContentPanel(data.data))
    );
    getEntries();
  });
  divTagRowDelete.appendChild(iconeDeleteTag);
  //title
  const pTagTitle = document.createElement("p");
  pTagTitle.classList.add("contentTitle");
  pTagTitle.textContent = subentry.subTitle;
  pTagTitle.id = `entrySubTitle${subentry.subEntriesId}`;
  pTagTitle.setAttribute("contentEditable", true);
  pTagTitle.addEventListener("blur", () => {
    editSubEntry(entry.entriesId, subentry);
  });

  //text
  const pTagText = document.createElement("p");
  pTagText.classList.add("contentText", "w-100");
  pTagText.textContent = subentry.text;
  pTagText.id = `entrySubText${subentry.subEntriesId}`;
  pTagText.setAttribute("contentEditable", true);
  pTagText.addEventListener("blur", () => {
    editSubEntry(entry.entriesId, subentry);
  });

  //boostrap row
  const divTagRow = document.createElement("div");
  divTagRow.classList.add(
    "row",
    "border",
    "rounded",
    "mt-2",
    "m-2",
    "contentRow"
  );

  //boststrap container
  const divTagContainer = document.createElement("div");
  divTagContainer.classList.add("container");

  divTagRow.appendChild(divTagContainer);

  divTagContainer.appendChild(divTagRowDelete);
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

  //add image
  const iconImageTag = document.createElement("i");
  iconImageTag.id = subentry.subEntriesId;
  iconImageTag.setAttribute("data-bs-toggle", "modal");
  iconImageTag.setAttribute("data-bs-target", "#myModalAddImage");
  iconImageTag.classList.add(
    "fa",
    "fa-solid",
    "fa-image",
    "col-1",
    "imageIcon"
  );
  iconImageTag.addEventListener("click", () => {
    const subEntryId = document.getElementById("contentPanelSubentryId");
    subEntryId.textContent = subentry.subEntriesId;
  });
  divImageAdd.appendChild(iconImageTag);
  divTagContainer.appendChild(divImageAdd);

  contentPanelDiv.appendChild(divTagRow);
}

function fillModal(data, element) {
  element.classList.remove();
  modalDiv.innerHTML = "";
  myModallLabel.textContent = data.subTitle;
  modalDiv.appendChild(element.cloneNode());
}

function addNewEntry() {
  const entry = {
    entriesId: null,
    title: document.getElementById("newEntryTitle").value,
    elective: document.title.toLowerCase(),
    userId: Number(sessionStorage.getItem("userId")),
    subEntries: [],
  };

  const hTag = document.createElement("p");
  hTag.classList.add("border", "entryClick", "rounded");
  hTag.textContent = entry.title;
  sidePanelDiv.appendChild(hTag);
  hTag.addEventListener("click", () => fillContentPanel(entry));

  const response = fetch("/entries", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(entry),
  })
    .then((response) => response.json())
    .then((data) => {
      entry.entriesId = data.newEntry.entriesId;
    })
    .catch((err) => console.error(err));
  document.getElementById("newEntryTitle").value = "";
}
function addNewSubEntry(entry) {
  const newSubEntry = {
    subEntriesId: 0,
    subTitle: document.getElementById("newSubEntryTitle").value,
    text: "",
  };

  const response = fetch(`/entries/${entry.entriesId}`, {
    method: "PATCH",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(newSubEntry),
  })
    .then((response) => response.json())
    .then((data) => appendContentPanel(entry, data.data))
    .catch((err) => console.error(err));

  getEntries();
  document.getElementById("newSubEntryTitle").value = "";
}

function editEntry(entry) {
  const newTitle = document.getElementById("entryTitle");
  entry.title = newTitle.textContent;

  const response = fetch(`/entries/${entry.entriesId}`, {
    method: "PATCH",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(entry),
  }).catch((err) => console.error(err));

  getEntries();
}

function editSubEntry(id, subentry) {
  const newSubEntry = {
    subEntriesId: subentry.subEntriesId,
    subTitle: document.getElementById(`entrySubTitle${subentry.subEntriesId}`)
      .textContent,
    text: document.getElementById(`entrySubText${subentry.subEntriesId}`)
      .textContent,
    imageUrl: subentry.imageUrl,
  };

  fetch(`/entries/subentry/${id}/${subentry.subEntriesId}`, {
    method: "PATCH",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(newSubEntry),
  });

  getEntries();
}

function searchForEntries() {
  const searchString = document.getElementById("searchInput");
  fetch(`entries/search/${searchString.value}`)
  .then((response) => response.json()
  .then((data) => {
      contentPanelDiv.innerHTML = "";   
      data.data.forEach((subentry) => {
        appendContentPanel({}, subentry);
      });
    })
  );
}

addEntryButton.addEventListener("click", () => addNewEntry());

addSubEntryButton.addEventListener("click", (e) => {
  fetch(`entries/${e.target.id}`)
    .then((response) => response.json())
    .then((data) => addNewSubEntry(data.data));
});

searchBarButton.addEventListener("click", () => {
  searchForEntries();
});

addNewImageButton.addEventListener("click", async () => {
  const form = document.getElementById("imageForm");
  const formData = new FormData(form);
  await fetch(`entries/image/`, {
    method: "POST",
    body: formData,
  });
  updatePostWithImage(formData.get("image").name);
});

async function updatePostWithImage(filename) {
  const entryId = document.getElementById("contentPanelEntryId");
  const subEntryId = document.getElementById("contentPanelSubentryId");

  fetch(`entries/subentry/${entryId.textContent}/${subEntryId.textContent}`)
    .then((response) => response.json())
    .then((data) => {
      const newSubEntry = { ...data.data };
      newSubEntry.imageUrl = `ressources/images/${filename}`;

      fetch(
        `/entries/subentry/${entryId.textContent}/${subEntryId.textContent}`,
        {
          method: "PATCH",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(newSubEntry),
        }
      )
        .then((response) => response.json())
        .then((data) => fillContentPanel(data.data))
        .then(getEntries());
    });
}
