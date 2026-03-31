export interface Resource {
  title: string;
  url: string;
  description: string;
}

export interface ResourceCategory {
  category: string;
  resources: Resource[];
}

export const resourceCategories: ResourceCategory[] = [
  {
    category: "Data Sources",
    resources: [
      { title: "India Biodiversity Portal", url: "https://indiabiodiversity.org/", description: "Aggregates biodiversity data with public participation, offering open access under Creative Commons." },
      { title: "GBIF India", url: "https://www.gbif.org/country/IN/summary", description: "Free and open access to biodiversity data for India via an API." },
      { title: "Wildlife Institute of India", url: "https://wii.gov.in/national_wildlife_database", description: "Conservation status and habitat data from the national wildlife database." },
      { title: "MoEFCC Portal", url: "https://www.moef.gov.in/", description: "Official government source for environmental policy and conservation data." },
      { title: "Open Government Data India", url: "https://www.data.gov.in/", description: "Access to government datasets including environmental data." },
      { title: "Wildlife of India", url: "https://en.wikipedia.org/wiki/Wildlife_of_India", description: "Supplementary information on Indian wildlife species and habitats." },
      { title: "Fauna of India", url: "https://en.wikipedia.org/wiki/Fauna_of_India", description: "Details on Indian fauna for educational content and research." },
    ],
  },
  {
    category: "Open-Source Projects",
    resources: [
      { title: "Project Zamba", url: "https://zamba.drivendata.org/", description: "Machine learning for wildlife identification from camera traps." },
      { title: "Zamba GitHub", url: "https://github.com/drivendataorg/zamba", description: "Open-source code for Project Zamba's wildlife identification ML models." },
      { title: "Arribada Conservation Tech", url: "https://arribada.org/", description: "Tools like biologging and thermal imaging for conservation." },
      { title: "SMART Conservation Tools", url: "https://smartconservationtools.org/en-us/", description: "Open-source software for spatial monitoring of protected areas." },
      { title: "WildLift", url: "https://github.com/ABbiodiversity/WildLift", description: "R package for conservation decision-making with interactive tools." },
      { title: "Conservation International GitHub", url: "https://github.com/ConservationInternational", description: "General conservation tools adaptable to Indian ecosystems." },
      { title: "Wildlife Conservation India", url: "https://github.com/yashchitroda/Wildlife-Conservation", description: "Indian-specific repository focused on conservation importance." },
    ],
  },
  {
    category: "Best Practices & Strategies",
    resources: [
      { title: "Stakeholder Engagement", url: "https://www.wildteam.org.uk/conservation-best-practice-stakeholder-engagement", description: "Guidelines for engaging stakeholders in conservation projects." },
      { title: "Social Media for Conservation", url: "https://www.multipostdigital.com/blog/ihq2ugvlo1g2wx8melmrm850qun2zg", description: "Using social media platforms to raise wildlife conservation awareness." },
      { title: "7 Strategies for Protecting Wildlife", url: "https://www.green.earth/blog/7-strategies-for-protecting-wildlife", description: "Sustainable land-use practices for wildlife protection." },
      { title: "Conservation Technology Explained", url: "https://www.fauna-flora.org/explained/what-is-conservation-technology-how-tech-solutions-can-protect-the-worlds-wildlife/", description: "How technology enables monitoring, research, and protection." },
      { title: "Wildlife Conservation in India", url: "https://www.joshtalks.com/upsc/study-material/wildlife-conservation-efforts-in-india", description: "Overview of India's conservation efforts and frameworks." },
      { title: "WWF Conservation Initiatives", url: "https://www.worldwildlife.org/initiatives/wildlife-conservation", description: "Public education and outreach strategies from the World Wildlife Fund." },
    ],
  },
];
