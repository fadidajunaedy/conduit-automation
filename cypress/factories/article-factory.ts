interface ArticleData {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

export function generateArticle(): ArticleData {
  const uniqueId = Date.now().toString();
  return {
    title: `Test Article ${uniqueId}`,
    description: "dummy description",
    body: "dummy body",
    tagList: ["Dummy Tag 1", "Dummy Tag 2"],
  };
}
