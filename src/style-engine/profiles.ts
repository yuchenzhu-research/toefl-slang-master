import type { StyleProfileId } from "./types";

export type StyleProfile = {
  id: StyleProfileId;
  title: string;
  lexicalMarkers: string[];
  contrastMarkers: string[];
  causalMarkers: string[];
  hedgeMarkers: string[];
  preferredSentenceLength: {
    min: number;
    max: number;
  };
};

export const ECONOMIST_PROFILE: StyleProfile = {
  id: "economist",
  title: "Economist-style analytical prose",
  lexicalMarkers: [
    "arguably",
    "counterintuitive",
    "incentive",
    "trade-off",
    "productivity",
    "regulation",
    "market",
    "institution",
    "constraint",
    "welfare",
    "growth",
    "scarce",
  ],
  contrastMarkers: [
    "although",
    "but",
    "yet",
    "however",
    "whereas",
    "while",
    "nevertheless",
    "rather than",
  ],
  causalMarkers: [
    "because",
    "therefore",
    "thus",
    "so",
    "as a result",
    "in turn",
    "leads to",
    "explains why",
  ],
  hedgeMarkers: [
    "may",
    "might",
    "could",
    "likely",
    "appears",
    "suggests",
    "tends to",
    "is unlikely to",
  ],
  preferredSentenceLength: {
    min: 18,
    max: 32,
  },
};
