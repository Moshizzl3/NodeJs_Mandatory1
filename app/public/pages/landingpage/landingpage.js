const navBarContainer = document.getElementById("navContainer");
const sidePanelDiv = document.getElementById("sidePanel");
const contentPanelDiv = document.getElementById("contentPanel");
const modalDiv = document.getElementById("modalBody")
const myModallLabel = document.getElementById("myModallLabel")

async function getEntries() {

  const response = await fetch(`/entries/user/${sessionStorage.getItem("userId")}`);
  const data = await response.json();

  data.data.forEach((entry) => {
    console.log(entry);

    const hTag = document.createElement("h4");
    hTag.classList.add("border", "entryClick", "rounded");
    hTag.id = entry.entriesId;
    hTag.textContent = entry.title;
    sidePanelDiv.appendChild(hTag);

    hTag.addEventListener("click", () => fillContent(entry));
  });
}

 function fillContent(entry) {
  contentPanelDiv.innerHTML = ""
  entry.subEntries.forEach( subentry => {

    const pTagTitle = document.createElement("p");
    pTagTitle.classList.add("contentTitle");
    pTagTitle.textContent = subentry.subTitle;


    const pTagText = document.createElement("text");
    pTagText.classList.add("contentText");
    pTagText.textContent = subentry.text;

    console.log(subentry.imageUrl)

    const divTagRow = document.createElement("div")
    divTagRow.classList.add("row", "border", "rounded", "m-2", "contentRow")
   
    const divTagContainer = document.createElement("div")
    divTagContainer.classList.add("container")

    divTagRow.appendChild(divTagContainer)

    divTagContainer.appendChild(pTagTitle)
    divTagContainer.appendChild(pTagText)

    if(subentry.hasOwnProperty('imageUrl')){
      const imageTag = document.createElement("img");
      imageTag.setAttribute("data-bs-toggle", "modal")
      imageTag.setAttribute("data-bs-target","#myModal")
      imageTag.classList.add("img-fluid", "mx-auto", "d-block", "w-75");
      imageTag.src = subentry.imageUrl
      divTagRow.appendChild(imageTag)

      imageTag.addEventListener("click", ()=>{
        fillModal(subentry, imageTag)
})
      
    }

    contentPanelDiv.appendChild(divTagRow);
  })
}

function fillModal(data, element){
  element.classList.remove()
  modalDiv.innerHTML = ""
  myModallLabel.textContent = data.subTitle
  modalDiv.appendChild(element.cloneNode())
}

getEntries();

