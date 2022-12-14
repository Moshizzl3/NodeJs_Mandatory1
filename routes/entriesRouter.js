import { Router } from "express";
import fileUpload from "express-fileupload";
import path from "path";

const entriesRouter = Router();
entriesRouter.use(fileUpload());

entriesRouter.get("/entries", (req, res) => {
  res.status(200).send({ data: entries });
});

entriesRouter.get("/entries/:id", (req, res) => {
  const entry = entries.find(
    (entry) => entry.entriesId === Number(req.params.id)
  );
  res.status(200).send({ data: entry });
});

//get subentry
entriesRouter.get("/entries/subentry/:entryId/:subentryId", (req, res) => {
  const subEntry = entries
    .find((entry) => entry.entriesId === Number(req.params.entryId))
    .subEntries.find(
      (subentry) => subentry.subEntriesId === Number(req.params.subentryId)
    );
  res.status(200).send({ data: subEntry });
});

//get subentryies based on search
entriesRouter.get("/entries/search/:searchString", (req, res) => {
  const wordsFromString = req.params.searchString.split(" ");
  const matchedEntries = [];

  entries.forEach((entry) => {
    wordsFromString.forEach((word) => {
      entry.subEntries.forEach((subEntry) => {
        if (subEntry.text.toLowerCase().includes(word.toLowerCase())) {
          if (!matchedEntries.some((object) => object === subEntry)) {
            matchedEntries.push(subEntry);
          }
        }
      });
    });
  });
  res.status(200).send({ data: matchedEntries });
});

entriesRouter.get("/entries/user/:userId/:elective", (req, res) => {
  const entry = entries.filter(
    (entry) =>
      entry.userId === Number(req.params.userId) &&
      entry.elective.toLowerCase() === req.params.elective.toLowerCase()
  );
  res.status(200).send({ data: entry });
});

entriesRouter.post("/entries", (req, res) => {
  const newEntry = { ...req.body };
  newEntry.entriesId = ++entriesIdCounter;
  newEntry.userId = Number(newEntry.userId);
  entries.push(newEntry);
  res.status(200).send({ newEntry });
});

//uploads image to server
entriesRouter.post("/entries/image", (req, res) => {
  const { image } = req.files;
  if (!image) return res.status(400);
  image.mv(path.resolve("./public/ressources/images/" + image.name));
  res.status(200).send("ok");
});

//updates entry
entriesRouter.patch("/entries/:id", (req, res) => {
  const entryId = Number(req.params.id);
  let entry = entries.find((entry) => entry.entriesId == entryId);
  const subEntries = entry.subEntries;
  if (entry) {
    let subEntriesIdCounter = Math.max(
      ...subEntries.map((subentry) => subentry.subEntriesId)
    );

    let body = { ...req.body, subEntriesId: ++subEntriesIdCounter };
    //spread operater doesnt work, ask anders why
    entry.subEntries.push(body);
    for (let i in body) {
      if (body[i]) {
        entry[i] = body[i];
      }
    }
    res.status(200).send({ data: body });
  } else {
    res.status(404).send("No entry was found");
  }
});

//updates subentry
entriesRouter.patch("/entries/subentry/:entryId/:subEndtryId", (req, res) => {
  const entryId = Number(req.params.entryId);
  const subEntryId = Number(req.params.subEndtryId);
  let entry = entries.find((entry) => entry.entriesId === entryId);

  let body = { ...req.body };

  if (entry) {
    const index = entry.subEntries.findIndex(
      (subEntry) => subEntry.subEntriesId === subEntryId
    );
    if (index >= 0) {
      entry.subEntries[index] = body;
      entry.subEntries[index].subEntriesId = Number(body.subEntriesId);

      res.status(200).send({ data: entry });
    } else res.status(404);
  } else {
    res.status(404).send("Not Found");
  }
});

//delete entry
entriesRouter.delete("/entries/:entryId/", (req, res) => {
  const entryId = Number(req.params.entryId);

  if (entries.some((entry) => entry.entriesId === entryId)) {
    entries = entries.filter((entry) => entry.entriesId !== entryId);
    res.status(200).send("deleted");
  } else {
    res.status(404).send("Not found");
  }
});

//delete sub entry
entriesRouter.delete("/entries/:entryId/:subEntryId", (req, res) => {
  const entryId = Number(req.params.entryId);
  const subEntryId = Number(req.params.subEntryId);

  const entry = entries.find((entry) => entry.entriesId === entryId);
  if (entry) {
    const index = entry.subEntries.findIndex(
      (subEntry) => subEntry.subEntriesId === subEntryId
    );
    if (index >= 0) {
      const test = entry.subEntries.splice(index, 1);
      res.status(200).send({ data: entry });
    } else res.status(404);
  } else {
    res.status(404).send("Not Found");
  }
});

let entries = [
  {
    entriesId: 1,
    title: "Uge 35",
    userId: 1,
    elective: "NodeJs",
    subEntries: [
      {
        subEntriesId: 1,
        subTitle: `GitHub og git`,
        text: `GitHub er en hosting-tjeneste til version kontrol n??r man udvikler software, det er vigtigt lige at notere sig at git og GitHub ikke er det samme, GitHub er bygget p?? git der er opensource. GitHub shiner is??r n??r der er flere personer om det samme projekt, da det g??r det nemt og overskueligt at holde kontrol over kodedelen af projektet, selvom flere arbejder p?? samme kode.
          ???	Git pull (henter ??ndringer fra en specifik branch. Der findes mange kommandoer man kan bruge 
                  i forhold til at forbinde til forskellige branches)
          ???	Git add -A (tilf??j ??ndringer til staging, her kan man bruge -A for at tilf??je alle ??ndringer i hele ens ???arbejdstr????? 
                  eller og kan man v??lge en specifik fil)
          ???	Git commit -m besked (man tilf??jer de ??ndringer man har staged, man kan tilf??je en besked efter -m. 
          ???	Git push (man skubber sine lokale ??ndringer p?? den branch man er inde i, til en remote branch)
        
      `,
      },
      {
        subEntriesId: 2,
        subTitle: `Nodejs`,
        text: `NodeJs er et server milj??, som bruger JavaScript p?? serverside af fx en webapplikation. Det kan ogs?? k??re p?? forskellige platforme fx Mac, Windows og Linux for at n??vne de mest kendte. 
I NodeJs kan man som i Javascript bruge asynkront programmering, som g??r det utroligt brugbart i et server milj?? for at forhindre blocking, hvor der tit skal ???ventes??? p?? noget eksekveres. 
Med NodeJs kan man manipulere med filer og data p?? serverside. Node kan ogs?? bruges i forbindelse med databaser, og Nodejs er optimalt at bygge restapi???er med. Hertil findes forskellige frameworks man kan bruge, vi har fx arbejdet med Express.        
      `,
      },
      {
        subEntriesId: 3,
        subTitle: `Package.json`,
        imageUrl: "ressources/images/package-json.png",
        text: `Package.json filen indeholder en masse forskelligt data for projektet. Man laver egentlig bare en fil i roden af projektet der hedder package.json. Inde i filen kan man s?? oprette et objekt hvori der er et key-value forhold, der er utrolig mange ting man kan notere her, men overordnet er det:
        ??? Metadate ??? informativ data om projektet
        ??? Dependencires ??? Hvilke afh??ngigheder projektet har, Express er fx en dependency. N??r man tilf??jer en dependency 
          package.json filen  er det navnet samt versionen, dette er ogs?? et key-value forhold.
        ??? Scripts: Man kan definere scripts her, igen i et key-value forhold. Man kan s?? k??re det script man laver ved at skrive 
          ???npm run navnP??Script??? i terminalen, n??r man st??r i roden af projektet.
        
Efter man har udfyldt sin package.json fil, kan man igennem terminalen k??re npm install/i. Dette vil eksekvere alt det defineret i package.json filen, fx starter download af diverse framworks.
Man kan ogs?? f?? en autogeneret package.json ved at skrive ???npm init??? i terminalen, og intallere dependencies l??bende igennem npm i terminalen (disse tilf??jes automatisk i package.json filen under dependencies).
        
      `,
      },
      {
        subEntriesId: 4,
        subTitle: `REST-API konventioner`,
        text: `Der findes konventioner der forklarer hvordan man b??r strukturere sine endpoints n??r man laver et rest api. Disse konventioner eksisterer for at g??re det nemmere for andre at s??tte sig hurtigt og effektivt ind i en kode.
De b??r laves i denne r??kkef??lge og b??r v??re i flertal (beers, weapons, osv.):
`,
        imageUrl: "ressources/images/rest_api_example.png",
      },
      {
        subEntriesId: 5,
        subTitle: `Variabler og datastrukturer`,
        text: `Variabler b??r enten v??re const eller let. const tillader ikke en ???reassignment??? eller ???redeclation???, hvorimod let tillader en "reassignment"
Der findes forskellige datastrukturer i Javascript, dem vi har arbejdet mest med er: 
Arrays ??? En collection af elementer som er gemt et bestemt et sted i memory
Objekter ??? Et objekt er en collection af et key value pair, fx {Name: ???Kurt???}
      `,
      },
    ],
  },
  {
    entriesId: 2,
    title: "Uge 36",
    userId: 1,
    elective: "Nodejs",
    subEntries: [
      {
        subEntriesId: 1,
        subTitle: "Funktioner",
        imageUrl:"ressources/images/functions.png",
        text: `En funktion er en blok kode, som udf??rer en specifik handling. Der findes 3 tryper funktioner i javascript:
      ??? "Named functions": defineres ved at bruge key word ???function???, hvorefter man definerer navnet 
        efterfulgt af to paranteser, ogs?? kaldt "function declatration".
      ??? "Unnamed functions": En anonym funktion, dvs. den ikke har et navn, her bruges key word 
        function efterfulgt af to paratenser, ogs?? kaldt en "function expression"
      ???"Arrow-functions": ogs?? en anonym funktion, her skal man dog blot bruge paranteser 
        efterfulgt af en pil: () =>
        Man skal s?? bruge brackets hvis man vil have flere linjers kode: () => {..kode}

      `,
      },
      {
        subEntriesId: 2,
        subTitle: "Callback functions",
        imageUrl:"ressources/images/callback.png",
        text: `En callback function, er en funktion som der kan sendes med som et argument til en anden funktion.
Vi bruger det tit i forbindelse med at fetche, n??r vi bruger .then() (.then() tager imod en callback funktion). Dette g??r at vi kan kalde et endpoint, hvorefter vi kan udf??re en anden funktion, efter vi har f??et et reponse tilbage. Fordelen ved at bruge callbacks er at vi kan fors??tte med at eksekvere noget andet kode, mens vi venter p?? svar fra fx en database. Det er ogs?? grund til at de kaldes ???callback???, man kan forstille sig at der ringes tilbage n??r det er klar.
      `,
      },
      {
        subEntriesId: 3,
        subTitle: "Kodekonventioner",
        text: `Kodekonventioner bruges for at g??re koden mere l??sbar. Hvis der er enighed omkring form og struktur, s?? vil det g??re det nemmere for en anden udvikler at s??tte sig ind i ens arbejde. Der findes en del konventioner omkring det, men her er nogen af de vigtigste:
      ???	I JavaScript bruges der camelCase til at navngive funktioner og variabler
      ???	Navne p?? funktioner og variabler skal starte med et bogstav
      ???	Huske at ???indente??? ens kode, for at give en overskuelig struktur

Derudover er det vigtigt at man er konsistent med hvad end man g??r, hvis man fx bruger ??? til String???s, s?? b??r bruge samme tegn hele vejen igennem.
      `,
      },
      {
        subEntriesId: 4,
        subTitle: "Scoping",
        text: `Der findes forskellige scopes i javascript. Block-scrope, Function-scope og Global-scope.
Block scope: variabler/funktioner defineret herinde kan ikke tilg??es uden for bloken, en block er inden for tuborg klammerne {}
Funktion-scope: variabler/funktioner defineret herinde kan ikke tilg??es uden for funktionen.
Global-scope: variabler/funktioner defineret her, kan tilg??es af alle funktioner i scriptet. Is??r med variabler i Global scope, hvor man har en masse forskellige scripts sammen (fx p?? en html-side), er det en god ide at bruge const variabler, hver gang man kan. Da dette vil sikre at man ikke ???kommer til??? at rette i noget utilsigtet. 
Lexical scope fort??ller noget omkring hvor en variable har scope. I en nested funktion, vil den nestede funktion have samme scope som sin ???outer-level???  funktion.
`,
      },
      {
        subEntriesId: 5,
        subTitle: "Hoisting",
        text: `Hoisting i Javascript betyder at interperteren flytter alle deklarationer til toppen af deres scope inden koden eksekveres.
Rent praktisk betyder det at man kan kalde fx en funktion inden man har deklareret den i sin kode.
At bruge en variabel inden den er deklareret kan dog godt give fejl, da det ikke er selve initialiseringen der bliver ???hoisted???, men kun deklarationen.
`,
      },
      {
        subEntriesId: 6,
        subTitle: "Express",
        imageUrl:"ressources/images/express1.png",
        text: `Express er et Nodejs web framework, der kommer med forskellige v??rkt??jer som g??r det nemt og hurtigt at lave web apps samt api???er.
Express har en masse indbyggede http-metoder.
For at bruge express, skal dette importeres samt installeres som dependency, dette g??r man ved at skrive ???npm i express??? i ens terminal, i roden af ens projekt.
Derefter skal der laves en instans af express inde i ens app.js fil, hvorefter man f??r tilgang til at alle HTTP-metoderne. 
`,
      },
    ],
  },
  {
    entriesId: 3,
    title: "Uge 37",
    userId: 1,
    elective: "NodeJs",
    subEntries: [
      {
        subEntriesId: 1,
        subTitle: "Arrow-functions",
        imageUrl:"ressources/images/arrow-function.png",
        text: `En arrow funktion, er en anonym funktion, som kan hj??lpe med at ??ge l??sbarheden samt at g??re koden mere koncentreret. Disse bruges is??r i forbindelse med ???array metoder??? (map, filter, reduce, foreach), der alle tager imod en callback funktion:
      `,
      },
      {
        subEntriesId: 2,
        subTitle: "Array-functions",
        imageUrl:"ressources/images/map-example.png",
        text: `Array-funktioner er funktioner som kan ??ndre i elementerne i en array, ud fra den funktion man har sendt med som argument, og returnerer en opdaterede array.
Det er en god ide at bruge disse array funktioner, da det g??r det nemmere at forst?? hvad der sker, fremfor en masse loops.
      ???	.map() denne funktion returner en array, hvor elementerne i array er ??ndret i forholdet til den funktion 
        man sender med. S?? denne kan bruges hvis man ??nsker at rette i elementerne i arrayet
      ???	.filter() denne funktion returnerer en array der er filtreret efter den funktion man sender med. Hvis man fx ??nsker
        at f?? alle elementer med et bestemt navn, s?? er filter god til dette.
      ???	.reduce() dene funktion returnerer en array reduceret til ??n v??rdi. Dette kunne fx v??re en sum af en bestemt 
        attribut p?? hvert element.
Nedenfor er en snedig m??de at finde max p?? et id tilh??rende et object, ved hj??lp af .map() og Math.max() metoderne:
      `,
      },
      {
        subEntriesId: 3,
        subTitle: "Import og Moduler",
        imageUrl:"ressources/images/import-module.png",
        text: `I takt med at vores applikation bliver st??rre, er det n??dvendigt at begynde og bruge moduler. Moduler er andre filer, som kan indeholde klasser, ???libraries??? og funktioner, disse kan man tilg?? som vi fx g??r med Express.  
Der findes forskellige syntaks for at bruge moduler, CommonJs og ES Imports. 
Require (CommonJs) var den gamle syntaks for at importere moduler p??. Man importerede ved at bruge require(), hvorefter man kunne indtaste det man skal bruge: const express = require("express")
Require er synkront dvs. at hvis man har flere require kald, eksekveres de i r??kkef??lge.
ES imports er den nyere syntaks for at importere et modul, og kan v??re asynkront. Man importerer ved at bruge import og from, fx: import express from "express";
ES import tillader ogs?? at man kan importere specifikke elementer af modulet, det g??res ved at bruge { }  rundt om:  import {renderPage} from "./utils/templateRenderer.js";
For at kunne benytte ES import syntaks, skal man i sin package.json skrive ???type???:???module???
      `,
      },
      {
        subEntriesId: 4,
        subTitle: "Static files",
        imageUrl:"ressources/images/static.png",
        text: `Express kan bruges til at servere statiske sider. For at kunne g??re det, kr??ver det et par steps.
Udover express, skal vi ogs?? importere path: import path from "path";
path modulet hj??lper os med at definere stien til en bestemt fil korrekt, dette g??r vi ved at kalde: path.resolve(sti-til-fil)
Vi peger vore app hen til en bestemt folder, der tillader at filer kan serveres herfra: app.use(express.static("public"));
Grunden til at vi g??r dette, er s?? at vi kan sikre vores app. P?? denne her m??de, kan der ikke redigeres i filer der eksisterer andre steder end i public mappen. Vi har nu gjort, at der kun er tilgang til public mappen p?? clientside. Publicmappen b??r kun indeholde frontend relaterede ting s??som html, css og frontend Javascript. 
`,
      },
    ],
  },
  {
    entriesId: 4,
    title: "Uge 38",
    userId: 1,
    elective: "NodeJs",
    subEntries: [
      {
        subEntriesId: 1,
        subTitle: "Package.json - udvidet",
        imageUrl:"ressources/images/package-json.png",
        text: `Package.Json filen indeholder som tidligere n??vnt en masse data omkring projektet.
Meta data: Denne indeholder info omkring projektet s??som navn, forklaring eller version
dependencies: Denne indeholder afh??ngighederne  som projektet har, og bliver tilg??et n??r man skal skriver ???npm install???, hvorefter dependencies installeres.
scripts: Her kan man definere sine scripts, disse kommer i et key value forhold, s?? man giver sit script et navn, fx: ???start-dev???:???nodemon app.js???
Jeg kan nu skrive npm run start-dev i min terminal, og nodemon vil startes op.
Nodemon er et modul der er l??kkert at bruge under udvikling, da det genstarter webserveren hver gang man laver en ??ndring i filen.
`,
      },
      {
        subEntriesId: 2,
        subTitle: "Fetch",
        imageUrl:"ressources/images/fetch.png",
        text: `fetch() metoden i javacript, bruges til at sende ???requests??? til en server, metoden returnere et ???promise???, som vi s?? kan ???pakke ud??? til data.
fetch() tager i mod to argumenter, url og options; hvor url er et krav at sende ,men options ikke er et krav. Option kan bruges til at specificere hvilken type request det er:  POST, PUT, DELETE 
Dette er ikke n??dvendigt for en GET request.
fetch() er asynkront, da vi f??r et promise retur. Dette betyder at n??r vi laver vores request, skal vi afvente et promise, s?? fremt det lykkedes kan vi s?? pakke reponseobjektet ud, hvis ikke det lykkedes mislykkedes promiset og vi har ikke noget objekt. For at h??ndtere dette, kan man enten bruge .then syntaks, eller async/await:
`,
      },
      {
        subEntriesId: 3,
        subTitle: "CSS",
        text: `Der findes 3 metoder at tilf??je css til et HTML element.
      ??? Inline-css: dette defineres direkte i html-tagget ved at bruge style=???color: red???
      ??? Styletag-css: dette defineres i html dokumentet, typisk i headeren, med et style tag: <style> css skrives her</style>
      ??? Css-fil: her linkes en css fil til ens html dokument ved at bruge <link> tagget: <link rel="stylesheet"
       href="mystyle.css">
`,
      },
    ],
  },
  {
    entriesId: 5,
    title: "Uge 39",
    userId: 1,
    elective: "NodeJs",
    subEntries: [
      {
        subEntriesId: 1,
        subTitle: "Milj?? variabler",
        text: `I Nodejs kan man definere mij??variabler fx til porten, dette g??res ved at skrive:  const PORT = process.env.PORT || 3000; 
Vores Node app, vil nu k??re p?? en port vi sender med som en milj??variabel (hvis vi giver en), ELLER, p?? port 3000 hvis vi ikke giver en variabel.
For at tildelte en milj??variabel, kan vi i terminalen k??re vores nodeapp p?? denne m??de: PORT=8080 nodemon app.js
Vores app vil nu k??re p?? port 8080, havde vi ikke defineret en port s?? ville den k??re p?? port 3000.
En package vi benytter er coss-env, som er en del af vores dependencies i package.json filen. Denne hj??lper os med at s??tte de her milj??variabler rigtigt op da det er forskellgt fra system til system hvordan de h??ndteres.
`,
      },
      {
        subEntriesId: 2,
        subTitle: "Redirect frontend",
        imageUrl:"ressources/images/redirect-frontend.png",
        text: `Man kan redirecte p?? forskellige m??de i frontenden:
      ??? Man kan g??re det direkte i html ved at bruge href=???url??? inde i selve html taget.
      ??? Man kan g??re det ved at bruge javascript:  window.location.href = ???/url???
      ??? En anden metode man kan bruge i javascript er:  window.location.replace(???url???)
      `,
      },
      {
        subEntriesId: 3,
        subTitle: "Redirect backend",
        imageUrl:"ressources/images/redirect-backend.png",
        text: `Man kan redirecte i sin backend, ved hj??lp af express.
M??de at g??re det p?? er at bruge redirect metoden, som er indbygget i express. Vi kan bruge den p?? responset: res.redirect (???url???) inde i vores .get metode.
Url???en der redirectes til skal eksistere i ens backend.
      `,
      },
    ],
  },
  {
    entriesId: 6,
    title: "Uge 40",
    userId: 1,
    elective: "NodeJs",
    subEntries: [
      {
        subEntriesId: 1,
        subTitle: "Server Side Rendering",
        text: `SSR st??r for Server Side Rendering, som betyder at ens htmlsider bliver renderet p?? serveren inden de sendes til klienten.
Styrkerne for SSR er at filer loades hurtigere, s?? brugeren af siden f??r en god oplevelse. En anden styrke er at SEO bliver nemmere/bedre da siden er renderet f??r den loades. 
Svaghedenerne derimod for SSR er prisen for dette, da det nu er serveren der skal bruge ressourcer p?? at render siden og ikke klienten. Store komplekse sider kan godt tage l??ngere tid at loade, s?? man skal ogs?? v??re opm??rksom p?? st??rrelsen af ens projekt.
`,
      },
      {
        subEntriesId: 2,
        subTitle: "Client Side Rendering",
        text: `CSR st??r for Client Side Rendering, som betyder at ens html sider bliver renderet l??bende p?? klient siden.
Styrkerne for CSR er at elementer kan blive renderet hos klienten l??bende og kun hvis klienten skal bruge dem, derudover kan undg?? flere kald til serveren p?? denne m??de. Det er ikke l??ngere ens server der render alt men clienten, der kan spares dyrebare server ressourcer p?? denne m??de.
En svaghed kan v??re hastigheden som elementerne loades in (SSR er hurtigere i mindre projekter), en anden svaghed er at det ikke er SEO optimeret, da ens elementer rederes l??bende og ikke vil v??re tilg??ngelige fra start af.
`,
      },
      {
        subEntriesId: 3,
        subTitle: "At bruge SSR",
        imageUrl:"ressources/images/SSR.png",
        text: `Ved at benytte SSR, kan vi skabe nogen templates som vi kan loade ind.
Vi kan bygge en side som vi kan render og sende retur til klienten, ud fra forskellige komponenter. Hvis man fors??ger bryder en side ned i komponenter, s?? best??r den typisk af en header, noget indhold og en footer.
For at kunne bruge filerne p?? vores server skal vi importere et modul der hedder fs. Dette er fil system modul, der tillader os at manipulere med filerne p?? vores server (l??se, skrive, ??ndre, slette).
Vi kan s?? bruge fs.readFileSync(???folder-path???) for l??se vores fil, og s?? efterf??lgende bruge toString metoden for at g??re det til en String: 
const modal = fs.readFileSync("./public/components/modal/modal.html").toString();
Denne variable kan vi s?? appende til andre variabler af samme type for til sidst at bygge en hel siden:
      `,
      },
    ],
  },
  {
    entriesId: 7,
    title: "Uge 41",
    userId: 1,
    elective: "Python",
    subEntries: [
      { subEntriesId: 1, subTitle: "Subtitle 1", text: "text for subtitle 1" },
      { subEntriesId: 2, subTitle: "Subtitle 2", text: "text for subtitle 2" },
      { subEntriesId: 3, subTitle: "Subtitle 3", text: "text for subtitle 3" },
    ],
  },
  {
    entriesId: 8,
    title: "Uge 41",
    userId: 1,
    elective: "machinelearning",
    subEntries: [
      { subEntriesId: 1, subTitle: "Subtitle 1", text: "text for subtitle 1" },
      { subEntriesId: 2, subTitle: "Subtitle 2", text: "text for subtitle 2" },
      { subEntriesId: 3, subTitle: "Subtitle 3", text: "text for subtitle 3" },
    ],
  },
];

let entriesIdCounter = Math.max(...entries.map((entry) => entry.entriesId));

export default entriesRouter;
