import { Article } from "../support/types/articles";

export function generateArticle(): Article {
  const uniqueId = Date.now().toString();
  return {
    title: `Test Article ${uniqueId}`,
    description: `dummy description ${uniqueId}`,
    body: "dummy body",
    tagList: ["Dummy Tag 1", "Dummy Tag 2"],
  };
}
