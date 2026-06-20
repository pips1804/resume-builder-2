import { generateId } from "../lib/utils";

export const defaultResume = {
  meta: {
    template: "classic",
    accentColor: "#1a1a1a",
    fontFamily: "Georgia, serif",
    fontSize: "md",
    pageMargin: "normal",
    paperSize: "letter",
    showPhoto: false,
    sectionOrder: [
      "summary",
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "languages",
      "awards",
      "references",
    ],
    hiddenSections: [],
  },

  personal: {
    fullName: "John Doe",
    jobTitle: "Marketing Specialist",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    website: "johndoe.com",
    linkedin: "",
    github: "",
    photo: null,
  },

  summary:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non elit mauris. Cras euismod, metus ac finibus finibus, felis dui suscipit purus, a maximus leo ligula at dolor. Results-driven professional with a strong background in communication, project coordination, and digital operations, eager to contribute to a dynamic team.",

  experience: [
    {
      id: generateId(),
      company: "Acme Corporation",
      position: "Marketing Specialist",
      location: "New York, NY",
      startDate: "2022-03",
      endDate: "",
      current: true,
      bullets: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit quisque non elit mauris cras euismod.",
        "Coordinated cross-functional projects and managed digital communication channels effectively.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit felis dui suscipit purus maximus.",
      ],
    },
    {
      id: generateId(),
      company: "Sample Company Ltd.",
      position: "Junior Coordinator",
      location: "Boston, MA",
      startDate: "2020-06",
      endDate: "2022-02",
      current: false,
      bullets: [
        "Assisted in organizing data, documents, and reports for the operations department.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit quisque non elit mauris.",
        "Collaborated with team members to deliver projects on schedule and within budget.",
      ],
    },
  ],

  education: [
    {
      id: generateId(),
      institution: "State University",
      degree: "Bachelor of Science",
      field: "Business Administration",
      location: "Boston, MA",
      startDate: "2016-09",
      endDate: "2020-05",
      gpa: "3.7/4.0",
      honors: "",
    },
  ],

  skills: [
    {
      id: generateId(),
      category: "Technical Skills",
      items: ["Microsoft Office", "Google Workspace", "Data Entry", "CRM Software"],
    },
    {
      id: generateId(),
      category: "Soft Skills",
      items: ["Communication", "Teamwork", "Problem Solving", "Time Management"],
    },
    {
      id: generateId(),
      category: "Languages",
      items: ["English (Fluent)", "Spanish (Intermediate)"],
    },
  ],

  projects: [],
  certifications: [],
  languages: [],
  awards: [],
  references: [],
};
