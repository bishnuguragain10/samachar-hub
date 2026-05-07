export function localizedText(
  isNepali: boolean,
  english?: string | null,
  nepali?: string | null
) {
  const englishText = english?.trim() ?? "";
  const nepaliText = nepali?.trim() ?? "";
  return isNepali && nepaliText ? nepaliText : englishText;
}

export function localizedArticle(
  article: {
    title?: string | null;
    titleNe?: string | null;
    excerpt?: string | null;
    excerptNe?: string | null;
    content?: string | null;
    contentNe?: string | null;
    aiSummary?: string | null;
    aiSummaryNe?: string | null;
  },
  isNepali: boolean
) {
  return {
    title: localizedText(isNepali, article.title, article.titleNe),
    excerpt: localizedText(isNepali, article.excerpt, article.excerptNe),
    content: localizedText(isNepali, article.content, article.contentNe),
    summary: localizedText(isNepali, article.aiSummary, article.aiSummaryNe),
  };
}

export function localizedCategory(
  category: {
    name?: string | null;
    nameNe?: string | null;
    description?: string | null;
    descriptionNe?: string | null;
  },
  isNepali: boolean
) {
  return {
    name: localizedText(isNepali, category.name, category.nameNe),
    description: localizedText(
      isNepali,
      category.description,
      category.descriptionNe
    ),
  };
}
