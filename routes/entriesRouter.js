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
  console.log(subEntry);
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
  console.log(wordsFromString);
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
  console.log(newEntry.entriesId);
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
  const subEntries = entry.subEntries
  console.log(body)
  if (entry) {
    
    let subEntriesIdCounter = Math.max(...subEntries.map((subentry) => subentry.subEntriesId));

    let body = { ...req.body, subEntriesId: ++subEntriesIdCounter };
    //spread operater doesnt work, ask anders why
    entry.subEntries.push(body);
    for (let i in body) {
      if (body[i]) {
        entry[i] = body[i];
      }
    }
    res.status(200).send({data: body});
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
      console.log(test);

      console.log(entryId, subEntryId);

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
        text: `GitHub er en hosting-tjeneste til version kontrol når man udvikler software, det er vigtigt lige at notere sig at git og GitHub ikke er det samme, GitHub er bygget på git der er opensource. GitHub shiner især når der er flere personer om det samme projekt, da det gør det nemt og overskueligt at holde kontrol over kodedelen af projektet, selvom flere arbejder på samme kode.
          •	Git pull (henter ændringer fra en specifik branch. Der findes mange kommandoer man kan bruge 
                  i forhold til at forbinde til forskellige branches)
          •	Git add -A (tilføj ændringer til staging, her kan man bruge -A for at tilføje alle ændringer i hele ens ”arbejdstræ” 
                  eller og kan man vælge en specifik fil)
          •	Git commit -m besked (man tilføjer de ændringer man har staged, man kan tilføje en besked efter -m. 
          •	Git push (man skubber sine lokale ændringer på den branch man er inde i, til en remote branch)
        
      `,
      },
      {
        subEntriesId: 2,
        subTitle: `Nodejs`,
        text: `NodeJs er et server miljø, som bruger JavaScript på serverside af fx en webapplikation. Det kan også køre på forskellige platforme fx Mac, Windows og Linux for at nævne de mest kendte. 
I NodeJs kan man som i Javascript bruge asynkront programmering, som gør det utroligt brugbart i et server miljø for at forhindre blocking, hvor der tit skal ”ventes” på noget eksekveres. 
Med NodeJs kan man manipulere med filer og data på serverside. Node kan også bruges i forbindelse med databaser, og Nodejs er optimalt at bygge restapi’er med. Hertil findes forskellige frameworks man kan bruge, vi har fx arbejdet med Express.        
      `,
      },
      {
        subEntriesId: 3,
        subTitle: `Package.json`,
        text: `Package.json filen indeholder en masse forskelligt data for projektet. Man laver egentlig bare en fil i roden af projektet der hedder package.json. Inde i filen kan man så oprette et objekt hvori der er et key-value forhold, der er utrolig mange ting man kan notere her, men overordnet er det:
        • Metadate – informativ data om projektet
        • Dependencires – Hvilke afhængigheder projektet har, Express er fx en dependency. Når man tilføjer en dependency 
          package.json filen  er det navnet samt versionen, dette er også et key-value forhold.
        • Scripts: Man kan definere scripts her, igen i et key-value forhold. Man kan så køre det script man laver ved at skrive 
          ”npm run navnPåScript” i terminalen, når man står i roden af projektet.
        
Efter man har udfyldt sin package.json fil, kan man igennem terminalen køre npm install/i. Dette vil eksekvere alt det defineret i package.json filen, fx starter download af diverse framworks.
Man kan også få en autogeneret package.json ved at skrive ”npm init” i terminalen, og intallere dependencies løbende igennem npm i terminalen (disse tilføjes automatisk i package.json filen under dependencies).
        
      `,
      },
      {
        subEntriesId: 4,
        subTitle: `REST-API konventioner`,
        text: `Der findes konventioner der forklarer hvordan man bør strukturere sine endpoints når man laver et rest api. Disse konventioner eksisterer for at gøre det nemmere for andre at sætte sig hurtigt og effektivt ind i en kode.
De bør laves i denne rækkefølge og bør være i flertal (beers, weapons, osv.):
`,
        imageUrl: "ressources/images/rest_api_example.png",
      },
      {
        subEntriesId: 5,
        subTitle: `Variabler og datastrukturer`,
        text: `Variabler bør enten være const eller let. const tillader ikke en ”reassignment” eller ”redeclation”, hvorimod let tillader dette
Der findes forskellige datastrukturer i Javascript, dem vi har arbejdet mest med er: 
Arrays – En collection af elementer som er gemt et bestemt et sted i memory
Objekter – Et objekt er en collection af et key value pair, fx {Name: ”Kurt”}
      `,
        imageUrl: "ressources/images/testsnip.png",
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
        text: `En funktion er en blok kode, som udfører en specifik handling. En funktion i javascript defineres ved at bruge key word ”function”, hvorefter man definerer navnet efterfulgt af to paranteser:`,
      },
      {
        subEntriesId: 2,
        subTitle: "Callback functions",
        text: `En callback function, er en funktion som der kan sendes med som et argument til en anden funktion.
Vi bruger det tit i forbindelse med at fetche, når vu bruger .then() (.then() tager imod en callback funktion). Dette gør at vi kan kalde et endpoint, hvorefter vi kan udføre en anden funktion, efter vi har fået et reponse tilbage. Fordelen ved at bruge callbacks er at vi kan forsætte med at eksekvere noget andet kode, mens vi venter på svar fra fx en database. Det er også grund til at de kaldes ”callback”, man kan forstille sig at der ringes tilbage når det er klar.
      `,
      },
      {
        subEntriesId: 3,
        subTitle: "Kodekonventioner",
        text: `Kodekonventioner bruges for at gøre koden mere læsbar. Hvis der er enighed omkring form og struktur, så vil det gøre det nemmere for en anden udvikler at sætte sig ind i ens arbejde. Der findes en del konventioner omkring det, men her er nogen af de vigtigste:
      •	I JavaScript bruges der camelCase til at navngive funktioner og variabler
      •	Navne på funktioner og variabler skal starte med et bogstav
      •	Huske at ”indente” ens kode, for at give en overskuelig struktur

Derudover er det vigtigt at man er konsistent med hvad end man gør, hvis man fx bruger ” til String’s, så bør bruge samme tegn hele vejen igennem.
      `,
      },
      {
        subEntriesId: 4,
        subTitle: "Scoping",
        text: `Der findes forskellige scopes i javascript. Block-scrope, Function-scope og Global-scope.
Block scope: variabler defineret herinde kan ikke tilgåes uden for bloken, en block er inden for tuborg klammerne {}
Funktion-scope: variabler defineret herinde kan ikke tilgåes uden for funktionen.
Global-scope: variabler defineret her, kan tilgåes af alle i scripts og funktioner især med variabler i Global scope, hvor man har en masse forskellige scripts sammen (fx på en html-side), er det en god ide at bruge const variabler, hver gang man kan. Da dette vil sikre at man ikke ”kommer til” at rette i noget utilsigtet. 
Lexical scope fortæller noget omkring hvor en variable har scope. I en nested funktion, vil den nestede funktion have samme scope som sin ”outer-level”  funktion.
`,
      },
      {
        subEntriesId: 5,
        subTitle: "Hoisting",
        text: `Hoisting i Javascript betyder at interperteren flytter alle deklarationer til toppen af deres scope inden koden eksekveres.
Rent praktisk betyder det at man kan kalde fx en funktion inden man har deklareret den i sin kode.
At bruge en variabel inden den er deklareret kan dog godt give fejl, da det ikke er selve initialiseringen der bliver ”hoisted”, men kun deklarationen.
`,
      },
      {
        subEntriesId: 6,
        subTitle: "Express",
        text: `Express er et Nodejs web framework, der kommer med forskellige værktøjer som gør det nemt og hurtigt at lave web apps samt api’er.
Express har en masse indbyggede http-metoder.
For at bruge express, skal dette importeres samt installeres som dependency, dette gør man ved at skrive ”npm i express” i ens terminal, i roden af ens projekt.
Derefter skal der laves en instans af express inde i ens app.js fil, hvorefter man får tilgang til at alle HTTP-metoderne. 
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
        text: `En arrow funktion, er en anonym funktion, som kan hjælpe med at øge læsbarheden samt at gøre koden mere koncentreret. Disse bruges især i forbindelse med ”array metoder” (map, filter, reduce, foreach), der alle tager imod en callback funktion. 
Arrow funktioner bruges også i forbindelse med callback funktioner, da man så kan sende en arrow funktion med som argument.
      `,
      },
      {
        subEntriesId: 2,
        subTitle: "Array-functions",
        text: `Array-funktioner er funktioner som kan ændre i elementerne i en array, ud fra den funktion man har sendt med som argument, og returnerer en opdaterede array.
Det er en god ide at bruge disse array funktioner, da det gør det nemmere at forstå hvad der sker, fremfor en masse loops.
      •	.map() denne funktion returner en array, hvor elementerne i array er ændret i forholdet til den funktion 
        man sender med. Så denne kan bruges hvis man ønsker at rette i elementerne i arrayet
      •	.filter() denne funktion returnerer en array der er filtreret efter den funktion man sender med. Hvis man fx ønsker
        at få alle elementer med et bestemt navn, så er filter god til dette.
      •	.reduce() dene funktion returnerer en array reduceret til én værdi. Dette kunne fx være en sum af en bestemt 
        attribut på hvert element.
      `,
      },
      {
        subEntriesId: 3,
        subTitle: "Import og Moduler",
        text: `I takt med at vores applikation bliver større, er det nødvendigt at begynde og bruge moduler. Moduler er andre filer, som kan indeholde klasser, ”libraries” og funktioner, disse kan man tilgå som vi fx gør med Express.  
Der findes forskellige syntaks for at bruge moduler, CommonJs og ES Imports. 
Require (CommonJs) var den gamle syntaks for at importere moduler på. Man importerede ved at bruge require(), hvorefter man kunne indtaste det man skal bruge: const express = require("express")
Require er synkront dvs. at hvis man har flere require kald, eksekveres de i rækkefølge.
ES imports er den nyere syntaks for at importere et modul, og kan være asynkront. Man importerer ved at bruge import og from, fx: import express from "express";
ES import tillader også at man kan importere specifikke elementer af modulet, det gøres ved at bruge { }  rundt om:  import {renderPage} from "./utils/templateRenderer.js";
For at kunne benytte ES import syntaks, skal man i sin package.json skrive ”type”:”module”
      `,
      },
      {
        subEntriesId: 4,
        subTitle: "Static files",
        text: `Express kan bruges til at servere statiske sider. For at kunne gøre det, kræver det et par steps.
Udover express, skal vi også importere path: import path from "path";
path modulet hjælper os med at definere stien til en bestemt fil korrekt, dette gør vi ved at kalde: path.resolve(sti-til-fil)
Vi peger vore app hen til en bestemt folder, der tillader at filer kan serveres herfra: app.use(express.static("public"));
Grunden til at vi gør dette, er så at vi kan sikre vores app. På denne her måde, kan der ikke redigeres i filer der eksisterer andre steder end i public mappen. Vi har nu gjort, at der kun er tilgang til public mappen på clientside. Publicmappen bør kun indeholde frontend relaterede ting såsom html, css og frontend Javascript. 
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
        text: `Package.Json filen indeholder som tidligere nævnt en masse data omkring projektet.
Meta data: Denne indeholder info omkring projektet såsom navn, forklaring eller version
dependencies: Denne indeholder afhængighederne  som projektet har, og bliver tilgået når man skal skriver ”npm install”, hvorefter dependencies installeres.
scripts: Her kan man definere sine scripts, disse kommer i et key value forhold, så man giver sit script et navn, fx: ”start-dev”:”nodemon app.js”
Jeg kan nu skrive npm run start-dev i min terminal, og nodemon vil startes op.
Nodemon er et modul der er lækkert at bruge under udvikling, da det genstarter webserveren hver gang man laver en ændring i filen.
`,
      },
      {
        subEntriesId: 2,
        subTitle: "Fetch",
        text: `fetch() metoden i javacript, bruges til at sende ”requests” til en server, metoden returnere et ”promise”, som vi så kan ”pakke ud” til data.
fetch() tager i mod to argumenter, url og options; hvor url er et krav at sende ,men options ikke er et krav. Option kan bruges til at specificere hvilken type request det er:  POST, PUT, DELETE 
Dette er ikke nødvendigt for en GET request.
fetch() er asynkront, da vi får et promise retur. Dette betyder at når vi laver vores request, skal vi afvente et promise, så fremt det lykkedes kan vi så pakke reponseobjektet ud, hvis ikke det lykkedes mislykkedes promiset og vi har ikke noget objekt. For at håndtere dette, kan man enten bruge .then syntaks, eller async/await:
`,
      },
      {
        subEntriesId: 3,
        subTitle: "CSS",
        text: `Der findes 3 metoder at tilføje css til et HTML element.
      • Inline-css: dette defineres direkte i html-tagget ved at bruge style=”color: red”
      • Styletag-css: dette defineres i html dokumentet, typisk i headeren, med et style tag: <style> css skrives her</style>
      • Css-fil: her linkes en css fil til ens html dokument ved at bruge <link> tagget: <link rel="stylesheet"
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
        subTitle: "Miljø variabler",
        text: `I Nodejs kan man definere mijøvariabler fx til porten, dette gøres ved at skrive:  const PORT = process.env.PORT || 3000; 
Vores Node app, vil nu køre på en port vi sender med som en miljøvariabel (hvis vi giver en), ELLER, på port 3000 hvis vi ikke giver en variabel.
For at tildelte en miljøvariabel, kan vi i terminalen køre vores nodeapp på denne måde: PORT=8080 nodemon app.js
Vores app vil nu køre på port 8080, havde vi ikke defineret en port så ville den køre på port 3000.
En package vi benytter er coss-env, som er en del af vores dependencies i package.json filen. Denne hjælper os med at sætte de her miljøvariabler rigtigt op da det er forskellgt fra system til system hvordan de håndteres.
`,
      },
      {
        subEntriesId: 2,
        subTitle: "Redirect frontend",
        text: `Man kan redirecte på forskellige måde i frontenden:
      • Man kan gøre det direkte i html ved at bruge href=”url” inde i selve html taget.
      • Man kan gøre det ved at bruge javascript:  window.location.href = ”/url”
      • En anden metode man kan bruge i javascript er:  window.location.replace(”url”)
      `,
      },
      {
        subEntriesId: 3,
        subTitle: "Redirect backend",
        text: `Man kan redirecte i sin backend, ved hjælp af express.
Måde at gøre det på er at bruge redirect metoden, som er indbygget i express. Vi kan bruge den på responset: res.redirect (”url”) inde i vores .get metode.
Url’en der redirectes til skal eksistere i ens backend.
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
        text: `SSR står for Server Side Rendering, som betyder at ens htmlsider bliver renderet på serveren inden de sendes til klienten.
Styrkerne for SSR er at filer loades hurtigere, så brugeren af siden får en god oplevelse. En anden styrke er at SEO bliver nemmere/bedre da siden er renderet før den loades. 
Svaghedenerne derimod for SSR er prisen for dette, da det nu er serveren der skal bruge ressourcer på at render siden og ikke klienten. Store komplekse sider kan godt tage længere tid at loade, så man skal også være opmærksom på størrelsen af ens projekt.
`,
      },
      {
        subEntriesId: 2,
        subTitle: "Client Side Rendering",
        text: `CSR står for Client Side Rendering, som betyder at ens html sider bliver renderet løbende på klient siden.
Styrkerne for CSR er at elementer kan blive renderet hos klienten løbende og kun hvis klienten skal bruge dem, derudover kan undgå flere kald til serveren på denne måde. Det er ikke længere ens server der render alt men clienten, der kan spares dyrebare server ressourcer på denne måde.
En svaghed kan være hastigheden som elementerne loades in (SSR er hurtigere i mindre projekter), en anden svaghed er at det ikke er SEO optimeret, da ens elementer rederes løbende og ikke vil være tilgængelige fra start af.
`,
      },
      {
        subEntriesId: 3,
        subTitle: "At bruge SSR",
        text: `Ved at benytte SSR, kan vi skabe nogen templates som vi kan loade ind.
Vi kan bygge en side som vi kan render og sende retur til klienten, ud fra forskellige komponenter. Hvis man forsøger bryder en side ned i komponenter, så består den typisk af en header, noget indhold og en footer.
For at kunne bruge filerne på vores server skal vi importere et modul der hedder fs. Dette er fil system modul, der tillader os at manipulere med filerne på vores server (læse, skrive, ændre, slette).
Vi kan så bruge fs.readFileSync(”folder-path”) for læse vores fil, og så efterfølgende bruge toString metoden for at gøre det til en String: 
const modal = fs.readFileSync("./public/components/modal/modal.html").toString();
Denne variable kan vi så appende til andre variabler af samme type for til sidst at bygge en hel siden:
      `,
      },
    ],
  },
  {
    entriesId: 7,
    title: "Uge 41",
    userId: 1,
    elective: "NodeJs",
    subEntries: [
      { subEntriesId: 1, subTitle: "Svelte", text: "text3 for subtitle 1" },
      { subEntriesId: 2, subTitle: "Subtitle 2", text: "text for subtitle 2" },
      { subEntriesId: 3, subTitle: "Subtitle 3", text: "text for subtitle 3" },
    ],
  },
  {
    entriesId: 8,
    title: "Uge 41",
    userId: 1,
    elective: "Python",
    subEntries: [
      { subEntriesId: 1, subTitle: "Subtitle 1", text: "text3 for subtitle 1" },
      { subEntriesId: 2, subTitle: "Subtitle 2", text: "text for subtitle 2" },
      { subEntriesId: 3, subTitle: "Subtitle 3", text: "text for subtitle 3" },
    ],
  },
  {
    entriesId: 9,
    title: "Uge 41",
    userId: 1,
    elective: "machinelearning",
    subEntries: [
      { subEntriesId: 1, subTitle: "Subtitle 1", text: "text3 for subtitle 1" },
      { subEntriesId: 2, subTitle: "Subtitle 2", text: "text for subtitle 2" },
      { subEntriesId: 3, subTitle: "Subtitle 3", text: "text for subtitle 3" },
    ],
  },
];

let entriesIdCounter = Math.max(...entries.map((entry) => entry.entriesId));

export default entriesRouter;
