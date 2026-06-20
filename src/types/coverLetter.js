import { generateId } from "../lib/utils";
import { SIGNATURE_WIDTH, SIGNATURE_HEIGHT } from "../lib/signatureConstants";

export const defaultCoverLetter = {
  meta: {
    template: "professional",
    accentColor: "#1e3a5f",
    fontFamily: "Inter, sans-serif",
    fontSize: "md",
    pageMargin: "normal",
    paperSize: "letter",
  },

  sender: {
    fullName: "John Doe",
    address: "123 Market Street, New York, NY 10001",
    phone: "+1 (555) 123-4567",
    email: "john.doe@example.com",
  },

  letter: {
    date: new Date().toISOString().slice(0, 10),
    jobTitle: "Marketing Specialist",
    recipientName: "Hiring Manager",
    recipientCompany: "Acme Corporation",
    salutation: "Dear Hiring Manager,",
    body:
      "I am writing to express my interest in the position. With a strong background in marketing and communications, I am confident I can contribute meaningfully to your team.\n\n" +
      "In my previous roles, I developed campaigns that increased engagement and supported business growth. I enjoy collaborating across teams and turning ideas into clear, compelling messaging.\n\n" +
      "Thank you for your time and consideration. I would welcome the opportunity to discuss how my experience aligns with your needs.",
    bullets: [
      { id: generateId(), text: "Led cross-channel campaigns that improved audience engagement." },
      { id: generateId(), text: "Coordinated projects from planning through delivery on tight timelines." },
    ],
    closing: "Sincerely,",
    signature: null,
    signatureWidth: SIGNATURE_WIDTH,
    signatureHeight: SIGNATURE_HEIGHT,
    signatureOffsetX: 0,
    signatureOffsetY: 0,
  },
};

export function createBullet(text = "") {
  return { id: generateId(), text };
}
