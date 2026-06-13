import type {
  AppUser,
  Course,
  DownloadRecord,
  Instrumental,
  Sample,
  SamplePack,
  SubscriptionPlan,
} from "./types";

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    name: "Initiate",
    slug: "initiate",
    description: "Primera llave al archivo. Escucha más. Descarga con precisión.",
    priceMonthly: 149,
    monthlySampleLimit: 10,
    monthlyInstrumentalLimit: 0,
    includesCourses: false,
    isActive: true,
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    name: "Inner Circle",
    slug: "inner-circle",
    description: "Frecuencia privada para productores que ya conocen la señal.",
    priceMonthly: 349,
    monthlySampleLimit: 50,
    monthlyInstrumentalLimit: 5,
    includesCourses: false,
    isActive: true,
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    name: "Archivist",
    slug: "archivist",
    description: "Acceso completo al archivo, las obras y el conocimiento.",
    priceMonthly: 649,
    monthlySampleLimit: null,
    monthlyInstrumentalLimit: null,
    includesCourses: true,
    isActive: true,
  },
];

export const samplePacks: SamplePack[] = [
  {
    id: "20000000-0000-4000-8000-000000000001",
    title: "Obsidian Drums",
    slug: "obsidian-drums",
    description: "Baterías secas y profundas para rituales nocturnos.",
    genre: "Hip Hop",
    bpm: 92,
    musicalKey: "Dm",
    packType: "Drum Kit",
    tags: ["drums", "hip-hop", "dark"],
    filePath: "sample-packs/obsidian-drums.zip",
    status: "published",
    sampleCount: 8,
  },
  {
    id: "20000000-0000-4000-8000-000000000002",
    title: "Midnight Ritual",
    slug: "midnight-ritual",
    description: "Coros lejanos, cinta gastada y melodías ceremoniales.",
    genre: "Trap",
    bpm: 88,
    musicalKey: "F#m",
    packType: "Texture Pack",
    tags: ["melodic", "dark", "atmospheric"],
    filePath: "sample-packs/midnight-ritual.zip",
    status: "published",
    sampleCount: 12,
  },
  {
    id: "20000000-0000-4000-8000-000000000003",
    title: "Neon Brujería",
    slug: "neon-brujeria",
    description: "Percusión latina mutada para frecuencias modernas.",
    genre: "Reggaetón",
    bpm: 96,
    musicalKey: "Am",
    packType: "Drum Kit",
    tags: ["reggaeton", "latin", "modern"],
    filePath: "sample-packs/neon-brujeria.zip",
    status: "published",
    sampleCount: 10,
  },
  {
    id: "20000000-0000-4000-8000-000000000004",
    title: "Archivo 909",
    slug: "archivo-909",
    description: "Máquinas clásicas registradas en una habitación sin ventanas.",
    genre: "Techno",
    bpm: 100,
    musicalKey: "C#m",
    packType: "Drum Kit",
    tags: ["techno", "90s", "analog"],
    filePath: "sample-packs/archivo-909.zip",
    status: "published",
    sampleCount: 15,
  },
  {
    id: "20000000-0000-4000-8000-000000000005",
    title: "Ritual de Cinta",
    slug: "ritual-de-cinta",
    description: "Texturas lo-fi rescatadas de grabaciones olvidadas.",
    genre: "Lo-Fi",
    bpm: 78,
    musicalKey: "G",
    packType: "Texture Pack",
    tags: ["lo-fi", "texture", "tape"],
    filePath: "sample-packs/ritual-de-cinta.zip",
    status: "published",
    sampleCount: 9,
  },
];

export const samples: Sample[] = [
  ["Kick_Obsidian_01.wav", "Hip Hop", 92, "Dm", "Kick", ["drums", "dark"]],
  ["Snare_Dust_04.wav", "Hip Hop", 92, "Dm", "Snare", ["drums", "dusty"]],
  ["MR_Atmos_DistantChoir.wav", "Trap", 88, "F#m", "Atmos", ["vocal", "dark"]],
  ["MR_Texture_WornTape.wav", "Trap", 88, "F#m", "Texture", ["tape", "vinyl"]],
  ["NB_Dembow_Shadow.wav", "Reggaetón", 96, "Am", "Loop", ["latin", "drums"]],
  ["NB_Perc_Crystal.wav", "Reggaetón", 96, "Am", "One Shot", ["perc", "bright"]],
  ["A909_Kick_Raw.wav", "Techno", 100, "C#m", "Kick", ["909", "analog"]],
  ["A909_Hat_Closed.wav", "Techno", 100, "C#m", "Hi-Hat", ["909", "club"]],
  ["RC_Noise_Hall.wav", "Lo-Fi", 78, "G", "Texture", ["tape", "noise"]],
  ["RC_Keys_Forgotten.wav", "Lo-Fi", 78, "G", "Loop", ["keys", "melodic"]],
].map(([title, genre, bpm, musicalKey, sampleType, tags], index) => ({
  id: `30000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  samplePackId: samplePacks[Math.floor(index / 2)].id,
  title: title as string,
  slug: (title as string).toLowerCase().replaceAll("_", "-").replace(".wav", ""),
  genre: genre as string,
  bpm: bpm as number,
  musicalKey: musicalKey as string,
  sampleType: sampleType as string,
  tags: tags as string[],
  durationSeconds: 18 + index * 2,
  filePath: `samples/${title}`,
  status: "published" as const,
}));

export const instrumentals: Instrumental[] = [
  ["Eclipse Ritual", "Dark Trap", 86, "F#m", "Nocturno", 1200],
  ["Eco del Abismo", "Hip Hop", 92, "Dm", "Introspectivo", 900],
  ["Voz de los Muertos", "Boom Bap", 74, "Cm", "Crudo", 1100],
  ["Clave Fantasma", "R&B", 98, "Bbm", "Etéreo", 1300],
  ["Circuito Rojo", "Techno", 128, "Am", "Hipnótico", 1500],
].map(([title, genre, bpm, musicalKey, mood, price], index) => ({
  id: `40000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  title: title as string,
  slug: (title as string).toLowerCase().replaceAll(" ", "-"),
  description: "Una transmisión original de la matriz sonora SSR.",
  genre: genre as string,
  bpm: bpm as number,
  musicalKey: musicalKey as string,
  mood: mood as string,
  tags: [(genre as string).toLowerCase(), (mood as string).toLowerCase()],
  filePath: `instrumentals/${(title as string).toLowerCase().replaceAll(" ", "-")}.wav`,
  license: "Licencia básica SSR",
  price: price as number,
  status: "published" as const,
}));

export const courses: Course[] = [
  {
    id: "50000000-0000-4000-8000-000000000001",
    title: "Arquitectura del Beat",
    slug: "arquitectura-del-beat",
    description: "De la primera frecuencia al arreglo terminado.",
    instructor: "Consejo SSR",
    status: "published",
    modules: [],
  },
  {
    id: "50000000-0000-4000-8000-000000000002",
    title: "Texturas Prohibidas",
    slug: "texturas-prohibidas",
    description: "Resampling, cinta, ruido y profundidad.",
    instructor: "Consejo SSR",
    status: "draft",
    modules: [],
  },
];

const innerCirclePlan = subscriptionPlans[1];
const periodStart = new Date();
periodStart.setUTCDate(1);
periodStart.setUTCHours(0, 0, 0, 0);
const periodEnd = new Date(periodStart);
periodEnd.setUTCMonth(periodEnd.getUTCMonth() + 1);

export const demoSubscriber: AppUser = {
  id: "60000000-0000-4000-8000-000000000001",
  email: "miembro@ssr.local",
  displayName: "ritualista",
  role: "subscriber",
  plan: innerCirclePlan,
  subscription: {
    id: "70000000-0000-4000-8000-000000000001",
    userId: "60000000-0000-4000-8000-000000000001",
    planId: innerCirclePlan.id,
    status: "active",
    currentPeriodStart: periodStart.toISOString(),
    currentPeriodEnd: periodEnd.toISOString(),
  },
};

export const demoAdmin: AppUser = {
  id: "60000000-0000-4000-8000-000000000002",
  email: "archivista@ssr.local",
  displayName: "archivista.ssr",
  role: "admin",
  plan: subscriptionPlans[2],
};

export const initialDownloads: DownloadRecord[] = [
  {
    id: "80000000-0000-4000-8000-000000000001",
    userId: demoSubscriber.id,
    contentType: "sample_pack",
    contentId: samplePacks[1].id,
    title: samplePacks[1].title,
    createdAt: new Date().toISOString(),
  },
  {
    id: "80000000-0000-4000-8000-000000000002",
    userId: demoSubscriber.id,
    contentType: "sample_pack",
    contentId: samplePacks[0].id,
    title: samplePacks[0].title,
    createdAt: new Date().toISOString(),
  },
  {
    id: "80000000-0000-4000-8000-000000000003",
    userId: demoSubscriber.id,
    contentType: "instrumental",
    contentId: instrumentals[3].id,
    title: instrumentals[3].title,
    createdAt: new Date().toISOString(),
  },
];
