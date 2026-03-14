// Category definitions with color and icon
export const CATEGORIES = [
  { id: "food",          label: "Food & Dining",   icon: "🍔", color: "#f97316", bg: "bg-orange-500" },
  { id: "transport",     label: "Transport",        icon: "🚗", color: "#3b82f6", bg: "bg-blue-500"   },
  { id: "shopping",      label: "Shopping",         icon: "🛍️", color: "#a855f7", bg: "bg-purple-500" },
  { id: "bills",         label: "Bills & Utilities",icon: "📄", color: "#ef4444", bg: "bg-red-500"    },
  { id: "entertainment", label: "Entertainment",    icon: "🎮", color: "#ec4899", bg: "bg-pink-500"   },
  { id: "health",        label: "Health",           icon: "💊", color: "#10b981", bg: "bg-emerald-500"},
  { id: "savings",       label: "Savings",          icon: "💰", color: "#f59e0b", bg: "bg-amber-500"  },
  { id: "salary",        label: "Salary / Income",  icon: "💼", color: "#6366f1", bg: "bg-indigo-500" },
  { id: "others",        label: "Others",           icon: "📌", color: "#64748b", bg: "bg-slate-500"  },
];

// Keyword → category mapping for smart categorisation
const KEYWORD_MAP = {
  food:          ["kfc","mcdonalds","mcdonald","burger king","pizza","subway","dominos","starbucks",
                  "coffee","café","cafe","restaurant","sushi","noodle","bakery","grocery","supermart",
                  "food","eat","lunch","dinner","breakfast","snack","meal"],
  transport:     ["uber","grab","lyft","taxi","bus","train","metro","fuel","petrol","gas station",
                  "parking","toll","flight","airline","airport","ferry","commute","transport"],
  shopping:      ["amazon","lazada","shopee","ebay","zalora","tesco","walmart","mall","shop",
                  "clothes","clothing","shoes","fashion","ikea","online order","purchase"],
  bills:         ["electric","electricity","water bill","internet","wifi","phone bill","insurance",
                  "rent","mortgage","subscription","netflix","spotify","utility","bill","payment"],
  entertainment: ["cinema","movie","netflix","gaming","game","steam","playstation","xbox","concert",
                  "ticket","event","show","club","bowling","netflix","hbo","disney"],
  health:        ["pharmacy","clinic","hospital","doctor","medicine","gym","fitness","vitamin",
                  "dental","optician","health","medical","lab","test","checkup"],
  savings:       ["savings","invest","stock","crypto","deposit","wallet","piggy","transfer to savings"],
  salary:        ["salary","wage","paycheck","bonus","freelance","invoice","payment received","income"],
};

/**
 * Given a note string, return the best-matching category id, or "others".
 */
export function smartCategorize(note = "") {
  const lower = note.toLowerCase();
  for (const [catId, keywords] of Object.entries(KEYWORD_MAP)) {
    if (keywords.some(kw => lower.includes(kw))) return catId;
  }
  return "others";
}

/** Return category object by id */
export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}
