"use client";
// Single API module for all Folia content (categories, topics, vocab).
// All paths go through Next.js rewrites (/api/* → PersonalHub-Back) — no backend URL in client.

const apiFetch = async (path) => {
  const res = await fetch(path);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed: ${path}`);
  }
  return res.json();
};

// Returns [{ categoryId, categoryName, icon, topicList: [{ topicId, topicName, wordCount, img }] }]
export const getCategories = () => apiFetch("/api/vocab/categories-with-topics");

// Returns { topicId, topics, category, vocabs: [{ Id, Word, Meaning, jp, cn, fr, nl, Pronunciation, WordType, Set, Img, example, _id }] }
export const getTopicFlashcards = (topicId) =>
  apiFetch(`/api/vocab/topics/${topicId}/flashcards`);

// Returns { topicId, topics, category, questions: [...vocab + distractors] }
export const getTopicQuiz = (topicId) =>
  apiFetch(`/api/vocab/topics/${topicId}/quiz`);

// Returns topic info: { id, name, categoryId, category: { id, name }, ... }
export const getTopicInfo = (topicId) =>
  apiFetch(`/api/vocab/topics/${topicId}`);

// Returns vocab array matching search phrase
export const searchVocab = (phrase, limit = 30) =>
  apiFetch(`/api/vocab/vocabularies/search?q=${encodeURIComponent(phrase)}&limit=${limit}`);
