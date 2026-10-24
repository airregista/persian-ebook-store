export interface CategoryDefinition {
  id: string;
  label: string;
  type?: "category" | "shelf";
  shelfId?: string;
  iconName?: string;
}

export const CATEGORIES: CategoryDefinition[] = [
  { id: "all", label: "همه دسته‌ها", type: "category" },
  { id: "deals", label: "پیشنهاد شگفت‌انگیز", type: "shelf", shelfId: "shelf-deals" },
  { id: "audio", label: "کتاب‌های صوتی", type: "shelf", shelfId: "shelf-audio" },
  { id: "story-foreign", label: "داستان و رمان خارجی", type: "category" },
  { id: "story-persian", label: "داستان و رمان فارسی", type: "category" },
  { id: "psychology", label: "روانشناسی و تحول فردی", type: "category" },
  { id: "management", label: "مدیریت و کسب‌وکار", type: "category" },
  { id: "philosophy", label: "فلسفه و اندیشه", type: "category" },
  { id: "history", label: "تاریخ و زندگی‌نامه", type: "category" },
  { id: "social-sciences", label: "جامعه‌شناسی و علوم اجتماعی", type: "category" },
  { id: "literature", label: "شعر و ادبیات کلاسیک", type: "category" },
  { id: "lifestyle", label: "سبک زندگی و سلامت", type: "category" },
  { id: "scientific", label: "علمی و فناوری", type: "category" },
  { id: "kid-teen", label: "کودک و نوجوان", type: "category" },
  { id: "freebooks", label: "کتاب‌های رایگان", type: "category" },
];

export const CATEGORY_NAMES: Record<string, string> = {
  all: "همه دسته‌ها",
  "story-foreign": "داستان و رمان خارجی",
  "story-persian": "داستان و رمان فارسی",
  psychology: "روانشناسی، خودشناسی و رشد فردی",
  management: "مدیریت، بازاریابی و کسب‌وکار",
  philosophy: "فلسفه، اندیشه و منطق",
  history: "تاریخ جهان، ایران و زندگی‌نامه‌ها",
  "social-sciences": "جامعه‌شناسی، اقتصاد و علوم اجتماعی",
  audio: "کتاب‌های صوتی و پادکست",
  literature: "شعر و ادبیات کلاسیک",
  lifestyle: "سبک زندگی، سلامت و تندرستی",
  scientific: "دانش، علوم و فناوری",
  "kid-teen": "کودک و نوجوان",
  freebooks: "کتاب‌های رایگان و همگانی",
};
