export interface ArticleForPublishing {
  title: string;
  title_fr: string | null;
  excerpt: string | null;
  excerpt_fr: string | null;
  slug: string;
  image_url: string | null;
}

export interface PublishResult {
  ok: boolean;
  error?: string;
}

export type Publisher = (article: ArticleForPublishing) => Promise<PublishResult>;
