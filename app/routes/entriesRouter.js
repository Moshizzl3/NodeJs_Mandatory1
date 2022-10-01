import { Router } from "express";

export const entriesRouter = Router();

entriesRouter.get("/entries", (req, res) => {
  res.status(200).send({ data: entries });
});

entriesRouter.get("/entries/:id", (req, res) => {
  const entry = entries.find((entry)=> entry.entriesId === Number(req.params.id))
  res.status(200).send({ data: entry })
});

const entries = [
  {
    entriesId: 1,
    title: "No 1",
    userId: 1,
    subEntries: [
      { subEntriesId: 1, subTitle: "Subtitle 1", text: "text for subtitle 1" },
      { subEntriesId: 2, subTitle: "Subtitle 2", text: "text for subtitle 2" },
      { subEntriesId: 3, subTitle: "Subtitle 3", text: "text for subtitle 3" },
    ],
  },
  {
    entriesId: 2,
    title: "No 2",
    userId: 1,
    subEntries: [
      { subEntriesId: 1, subTitle: "Subtitle 1", text: "text for subtitle 1" },
      { subEntriesId: 2, subTitle: "Subtitle 2", text: "text for subtitle 2" },
      { subEntriesId: 3, subTitle: "Subtitle 3", text: "text for subtitle 3" },
    ],
  },
  {
    entriesId: 3,
    title: "No 3",
    userId: 2,
    subEntries: [
      { subEntriesId: 1, subTitle: "Subtitle 1", text: "text for subtitle 1" },
      { subEntriesId: 2, subTitle: "Subtitle 2", text: "text for subtitle 2" },
      { subEntriesId: 3, subTitle: "Subtitle 3", text: "text for subtitle 3" },
    ],
  },
];
