import { admindb } from "./firebaseAdmin";

export async function getAllRecipes() {
  const querySnapshot = await admindb.collection('recipe').get();
  const recipes = Array();

  querySnapshot.forEach(doc => {
      recipes.push(doc.data());
  });

  return recipes;
}