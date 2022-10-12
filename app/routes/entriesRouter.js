import { Router } from "express";

export const entriesRouter = Router();

entriesRouter.get("/entries", (req, res) => {
  res.status(200).send({ data: entries });
});

entriesRouter.get("/entries/:id", (req, res) => {
  const entry = entries.find(
    (entry) => entry.entriesId === Number(req.params.id)
  );
  res.status(200).send({ data: entry });
});

entriesRouter.get("/entries/user/:userId", (req, res) => {
  const entry = entries.filter(
    (entry) => entry.userId === Number(req.params.userId)
  );
  res.status(200).send({ data: entry });
});

const entries = [
  {
    entriesId: 1,
    title: "Uge 35",
    userId: 1,
    subEntries: [
      {
        subEntriesId: 1,
        subTitle: `GitHub og git`,
        text: `GitHub er en hostingtjeneste til version kontrol når man udvikler software, det er vigtigt lige at notere sig at git og GitHub ikke er det samm, GitHub er bygget på git som er opensource.  (lidt mere her).
      GitHub shiner især når der er flere personer om det samme projekt, da det gør det nemt og overskueligt at holde kontrol over kodedelen af projektet, selvom flere arbejder på samme kode.
      Der findes diverse extensions til GitHub man kan bruge til at eksekvere github kommandoer igennem sin ide, jeg bruger dog terminalen. De mest brugte kommandoer er nok:
      Git pull (hent en specifik branch ned som man tidligere har forbinde til. Der findes mange kommandoer man kan bruge i forhold til at forbinde til forskellige branches)
      Git add -A (tilføj ændringer til staging, her kan man bruge -A for at tilføje alle ændringer i hele ens ”arbejdstræ” eller og kan man vælge en specific fil”
      Git commit -m besked (man tilføjer de ændringer man har staged, man kan tilføje en besked efter -m. Der findes yderligere kommandoer man kan bruge hvis man fx har meget på hjertet, da -m mere er en overskrift)
      Git push (man skubber sine lokale ændringer på den branch man er inde i til en remote branch)
      `,
      },
      {
        subEntriesId: 2,
        subTitle: `Nodejs`,
        text: `NodeJs er et server miljø, som bruger JavaScript på serverside af fx en webapplikation. Det kan også køre på forskellige platforme fx Mac, Windows og Linux for at nævne de mest kendte. 
      I NodeJs kan man som Javascript bruge asynkront programmering, som gør det utroligt brugbart i et server miljø for at forhindre blocking, hvor der tit skal ”ventes” på noget eksekveres.
      Med NodeJs kan man manipulere med filer og data på serverside. I vores projekt på 3. semester byggede min gruppe og jeg et CMS-system (Content Management System) til en skakklub, her kunne det have løst en del af vores udfordringer hvis vi kunne have manipuleret med filerne på serverside 😊
      Node kan også bruges i forbindelse med databaser og optimalt at bygge restapi’er med. Hertil findes forskellige frameworks, vi har arbejdet med Express især, som denne hjemmeside er bygget på.
      `,
      },
      {
        subEntriesId: 3,
        subTitle: `Package.json`,
        text: `
      Package.json filen indeholder en masse forskelligt data for projektet. Man laver egentlig bare en fil i roden af projektet der hedder package.json. Inde i filen kan man så oprette et objekt der her et key-value forhold, der er utrolig mange ting man kan notere her, men overordnet er det:
      Metadate – informativ data om projektet
      Dependencires – Hvilke afhængigheder projektet har Express er fx en dependency. Når man tilføjer en dependency er det navnet samt versionen man ønsker, dette er også et key value forhold.
      Scripts: Man kan definere scripts her, igen i et key-value forhold. Man kan så køre det script man laver ved at bruge npm run navnPåScript.
      
      Efter man har udfyldt sin package.json fil, kan man igennem terminalen køre npm install/i. Dette vil eksekvere alt det defineret i package.json filen, fx starter download af diverse framworks.
      Man kan også få en autogeneret package.json ved at skrive ”npm init” i terminalen.
      `,
      },
      {
        subEntriesId: 4,
        subTitle: `REST-API konventioner`,
        text: `

      Får at minimere tidspild, er der opfundet nogen konventioner der forklarer hvordan 
      man bør strukturere sine endpoints, når man laver et rest api. De bør laves i denne rækkefølge 
      og bør være i flertal (beers, weapons, osv.):
      `,
        imageUrl: "ressources/images/rest_api_example.png",
      },
      {
        subEntriesId: 5,
        subTitle: `JavaScript`,
        text: `
      Variabler bør være const eller let. const tillader ikke en ”reassignment” eller ”redeclation”, hvor let kan dette. At bruge const er IKKE det samme som at variablen bliver immutable, det er fx muligt at ændre indholdet i et objekt eller en array.
      Der findes forskellige datastrukturer i Javascript, dem vi har arbejdet mest med er: 
      Arrays – En collection af elementer som er gemt på en bestemt et sted memory
      Objekter – Et objekt er en collection af et key value pair, fx {Name: ”Mohamad”}
      
      `,
        imageUrl: "ressources/images/testsnip.png",
      },
    ],
  },
  {
    entriesId: 2,
    title: "No 2",
    userId: 1,
    subEntries: [
      { subEntriesId: 1, subTitle: "Subtitle 1", text: "text2 for subtitle 1" },
      { subEntriesId: 2, subTitle: "Subtitle 2", text: "text for subtitle 2" },
      { subEntriesId: 3, subTitle: "Subtitle 3", text: "text for subtitle 3" },
    ],
  },
  {
    entriesId: 3,
    title: "No 3",
    userId: 2,
    subEntries: [
      { subEntriesId: 1, subTitle: "Subtitle 1", text: "text3 for subtitle 1" },
      { subEntriesId: 2, subTitle: "Subtitle 2", text: "text for subtitle 2" },
      { subEntriesId: 3, subTitle: "Subtitle 3", text: "text for subtitle 3" },
    ],
  },
];
