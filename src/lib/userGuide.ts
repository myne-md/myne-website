import type { CollectionEntry } from "astro:content";
import sidebarManifest from "../content/user-guide/_sidebar.json";

export interface CategoryEntry {
  slug: string;
  label: string;
  description: string;
  articles: string[];
  intro?: string;
}

export type UserGuideArticle = CollectionEntry<"userGuide">;

export interface ArticleRef {
  kind: "article";
  slug: string;
  title: string;
  categorySlug: string;
}

export interface BackRef {
  kind: "back";
  categorySlug: string;
  categoryLabel: string;
}

/** Discriminated union driven by category cardinality. `two-card` for
 *  2-article+ categories (boundary side becomes a BackRef); `single-card`
 *  for 1-article categories (one centered "back to category" card). */
export type PrevNextResult =
  | { layout: "two-card"; prev: ArticleRef | BackRef; next: ArticleRef | BackRef }
  | { layout: "single-card"; back: BackRef };

const manifest: readonly CategoryEntry[] = sidebarManifest as readonly CategoryEntry[];

export function getManifest(): readonly CategoryEntry[] {
  return manifest;
}

export function getCategoryBySlug(slug: string): CategoryEntry | undefined {
  return manifest.find((c) => c.slug === slug);
}

export function getCategoryLabel(slug: string): string | undefined {
  return getCategoryBySlug(slug)?.label;
}

export function getCategoryDescription(slug: string): string | undefined {
  return getCategoryBySlug(slug)?.description;
}

export function getArticleSlugsInCategory(slug: string): readonly string[] {
  return getCategoryBySlug(slug)?.articles ?? [];
}

export function getPrevNext(
  categorySlug: string,
  articleSlug: string,
  articles: readonly UserGuideArticle[],
): PrevNextResult | null {
  const cat = getCategoryBySlug(categorySlug);
  if (!cat) return null;

  const titleFor = (slug: string): string => {
    const id = `${categorySlug}/${slug}`;
    const entry = articles.find((a) => a.id === id);
    return entry?.data.title ?? slug.replace(/-/g, " ");
  };
  const back: BackRef = {
    kind: "back",
    categorySlug,
    categoryLabel: cat.label,
  };
  const refFor = (slug: string): ArticleRef => ({
    kind: "article",
    slug,
    title: titleFor(slug),
    categorySlug,
  });

  const idx = cat.articles.indexOf(articleSlug);
  if (idx === -1) return null;

  if (cat.articles.length === 1) {
    return { layout: "single-card", back };
  }

  const prev: ArticleRef | BackRef = idx === 0 ? back : refFor(cat.articles[idx - 1]!);
  const next: ArticleRef | BackRef =
    idx === cat.articles.length - 1 ? back : refFor(cat.articles[idx + 1]!);

  return { layout: "two-card", prev, next };
}

/** A single Recommended row — pairs an article with the tags it shares with
 *  the current article (used to render the matching chips inline). */
export interface RecommendedItem {
  article: UserGuideArticle;
  sharedTags: string[];
}

const RECOMMENDED_CAP = 5;

/** Shared cap for visible tag chips before they collapse to a `+N` summary. */
export const TAG_DISPLAY_CAP = 3;

/** Recommended articles by tag overlap with the current article. Two-tier
 *  thin-tag fallback: prefer >=2-shared-tag candidates, fill with
 *  >=1-shared-tag candidates if the strict pool is short of the cap. Sort
 *  is overlap-count desc, alphabetic tie-break. Empty array on no overlap. */
export function getRecommended(
  current: UserGuideArticle,
  all: readonly UserGuideArticle[],
): readonly RecommendedItem[] {
  const currentTags = new Set(current.data.tags ?? []);
  if (currentTags.size === 0) return [];

  const score = (a: UserGuideArticle): RecommendedItem => {
    const sharedTags = (a.data.tags ?? []).filter((t) => currentTags.has(t));
    return { article: a, sharedTags };
  };

  const cmp = (a: RecommendedItem, b: RecommendedItem) =>
    b.sharedTags.length - a.sharedTags.length ||
    a.article.data.title.localeCompare(b.article.data.title);

  const others = all.filter((a) => a.id !== current.id).map(score);

  const tier2 = others.filter((it) => it.sharedTags.length >= 2).sort(cmp);
  if (tier2.length >= RECOMMENDED_CAP) {
    return tier2.slice(0, RECOMMENDED_CAP);
  }

  const tier2Ids = new Set(tier2.map((it) => it.article.id));
  const tier1 = others
    .filter((it) => it.sharedTags.length >= 1 && !tier2Ids.has(it.article.id))
    .sort(cmp);

  return [...tier2, ...tier1].slice(0, RECOMMENDED_CAP);
}
