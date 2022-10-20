import fs from "fs";

const modal = fs
  .readFileSync("./public/components/modal/modal.html")
  .toString();

export function renderPage(path, options = {}, isLoggedin) {
  
  let navbar = fs
    .readFileSync("./public/components/navbar/navbar.html")
    .toString();

  let footer = fs
    .readFileSync("./public/components/footer/footer.html")
    .toString();

  let page = fs.readFileSync(path.toString()).toString();

  page = page
    .replace("%%PAGE_STYLESHEET%%", options.pageStylesheet || "")
    .replace("%%TAB_TITLE%%", options.tabTitle || "Notepad");

  navbar = navbar
    .replace("%%TAB_TITLE%%", options.tabTitle || "Notepad")
    .replace("%%PAGE_STYLESHEET%%", options.pageStylesheet || "");

  footer = footer.replace("%%PAGE_SCRIPT%%", options.pageScript || "");

  if (isLoggedin) {
    return navbar + page + modal + footer;
  } else return page + footer;
}
