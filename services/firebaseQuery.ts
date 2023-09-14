import { admindb } from "./firebaseAdmin";

export async function getAllRecipes() {
  const querySnapshot = await admindb.collection('category').get();

  const recipes = await Promise.all(querySnapshot.docs.map(async (doc) => {
    const data = doc.data();

    if (data.Test) {
      const testDoc = await data.Test.get();
      data.Test = testDoc.data();
    }

    return data;
  }));

  return recipes;
}
