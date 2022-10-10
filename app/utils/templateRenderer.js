import fs from "fs";

let navbar = fs
  .readFileSync("./public/components/navbar/navbar.html")
  .toString();
let footer = fs
  .readFileSync("./public/components/footer/footer.html")
  .toString();

export function renderPage(path, options = {}) {

    let page = fs.readFileSync(path);
    navbar = navbar
      .replace("%%TAB_TITLE%%", options.tabTitle || "Notepad")
      .replace("%%PAGE_STYLESHEET%%", options.PAGE_STYLESHEET || "");
    footer = footer.replace("%%PAGE_SCRIPT%%", options.PAGE_SCRIPT || "");

    return navbar + page + footer;
}
