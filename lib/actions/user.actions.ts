"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"

interface Params {
    userId: string;
    username: string;
    name: string;
    image: string;
    bio: string;
    path: string;
}
// this interface helps us in sharing the props 

export async function updateUser({
  userId,
  username,
  name,
  image,
  bio,
  path,
} : Params): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        image,
        bio,
        onboarded: true,
      },
      { upsert: true } // means update and insert
    );
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}