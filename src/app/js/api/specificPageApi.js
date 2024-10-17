import { getDatabase } from "../api/databaseAPI";

const cache = {};
const categoryCache = {}; // Cache for categories

// Fetch category by its ID
const fetchCategory = async (categoryId) => {
  // Check if the category is already in the cache
  if (categoryCache[categoryId]) {
    console.log("Fetching category from cache:", categoryCache[categoryId]);
    return categoryCache[categoryId];
  }

  try {
    // Fetch categories (assuming you have a function to fetch all categories)
    const categoryResponse = await getDatabase("f52cea04f3cd43239e0c8a409f67c8e8", {}); // Replace with your actual categories database ID
    const category = categoryResponse.find((cat) => cat.id === categoryId);

    if (category) {
      const result = {
        categoryId: category.id,
        categoryName: category.properties.Name.title[0]?.plain_text || 'No Name', // Adjust based on your actual category structure
      };

      // Cache the category result
      categoryCache[categoryId] = result;
      console.log("Fetched category from API:", result);
      return result;
    } else {
      console.warn("Category not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching category data:", error);
    throw error;
  }
};

export const fetchTopic = async (topicID) => {
  if (cache[topicID]) {
    console.log("Fetching from cache:", cache[topicID]);
    return cache[topicID];
  }

  try {
    const topicResponse = await getDatabase("10087f66f2404f85ac4eee90c2203dc3", {});
    const topic = topicResponse.find((topic) => topic.id === topicID);

    if (topic) {
      console.log(topic);

      // Fetch categories based on the relation IDs found in the topic
      const categoryPromises = topic.properties.Category.relation.map((relation) => {
        return fetchCategory(relation.id); // Fetch each category by its ID
      });

      // Wait for all category fetches to complete
      const categories = await Promise.all(categoryPromises);

      const result = {
        topicId: topic.id,
        topicName: topic.properties.Name.title[0]?.plain_text || 'No Name',
        topicImage: topic.properties.SVG.rich_text[0]?.plain_text || 'No Image',
        wordCount: topic.properties.WordCountDev.formula.number || 0,
        categories: categories.filter(cat => cat !== null), // Filter out any null categories
      };

      // Cache the topic result
      cache[topicID] = result;
      console.log("Fetched from API:", result);
      return result;
    } else {
      console.warn("Topic not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
