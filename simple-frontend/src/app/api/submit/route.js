import dbConnect from '../../lib/db';
import Recipe from '../../models/entry'; // Ensure this path matches where you saved your schema
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function POST(req) {
  try {
    // 1. Connect to Database
    await dbConnect();
    
    console.log("Writing to Database:", mongoose.connection.name);

    // 2. Parse the incoming JSON from the frontend
    const body = await req.json();

    // 3. TRANSFORM: Map Frontend names to Schema names
    // We construct the object exactly how the Mongoose Schema expects it
    const recipeData = {
      title: {
        en: body.englishName,
        es: body.spanishName,
      },
      ingredientPlainText: {
        en: body.englishIngredientList,
        es: body.spanishIngredientList,
      },
      // Note: Your frontend didn't have an "Instructions" field yet, 
      // so we leave this empty or you can add inputs for it later.
      instructions: {
        en: body.englishInstructionList, 
        es: body.spanishInstructionList,
      },
      imageURI: body.imageLink,
      tags: {
        blueRibbon: body.isBlueRibbon,
        vegan: body.isVegan,
        vegetarian: body.isVegetarian,
      },
      // Map the array of objects
      ingredients: body.structuredIngredients.map((ing) => ({
        ingredient: ing.refId, // Mongoose automatically converts valid ID strings to ObjectIds
        amount: ing.amount,
        unit: ing.unit,
      })),
      // Map the array of strings
      appliances: body.structuredAppliances
    };

    // 4. Create and Save
    const newRecipe = await Recipe.create(recipeData);

    return NextResponse.json({ success: true, data: newRecipe }, { status: 201 });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create recipe" }, 
      { status: 400 }
    );
  }
}