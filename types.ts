export type Category = "model" | "product" | "api" | "strategic";

export type Company = {
  id: string;
  name: string;
  product: string;
  color: string;
};

export type Launch = {
  company: string;
  date: string;
  label: string;
  category: Category;
  description: string;
};

export type LaunchData = {
  meta: {
    last_updated: string;
    week_number: number;
    tracked_since: string;
  };
  companies: Company[];
  launches: Launch[];
  watch: string[];
};

export const CATEGORY_META: Record<Category, { icon: string; label: string }> = {
  model: { icon: "🧠", label: "Model" },
  product: { icon: "📦", label: "Product" },
  api: { icon: "⚙️", label: "API" },
  strategic: { icon: "🏷️", label: "Strategic" },
};
