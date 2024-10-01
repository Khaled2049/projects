import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../../config/firebase";
// import { storiesRepo } from "../StoriesRepo";
import { Character } from "@/types/ICharacter";

class CharacterService {
  private storiesCollection = collection(firestore, "stories");

  async getCharacters(storyId: string): Promise<Character[]> {
    try {
      const plotsCollection = collection(
        this.storiesCollection,
        storyId,
        "characters"
      );
      const charactersSnapshot = await getDocs(plotsCollection);
      return charactersSnapshot.docs.map((doc) => doc.data() as Character);
    } catch (error) {
      console.error("Error getting plots:", error);
      throw error;
    }
  }

  async addCharacter(
    storyId: string,
    character: Omit<Character, "id">
  ): Promise<string> {
    try {
      const storyRef = doc(this.storiesCollection, storyId);
      const charactersCollection = collection(storyRef, "characters");
      const newCharacterRef = doc(charactersCollection);

      const newCharacter: Character = {
        ...character,
        id: newCharacterRef.id,
      };

      await setDoc(newCharacterRef, newCharacter);
      console.log(`Character ${newCharacter.name} added successfully`);
      return newCharacter.id;
    } catch (error) {
      console.error("Error adding character:", error);
      throw error;
    }
  }

  async updateCharacter(storyId: string, character: Character): Promise<void> {
    try {
      const storyRef = doc(this.storiesCollection, storyId);
      const characterRef = doc(
        collection(storyRef, "characters"),
        character.id
      );
      const characterSnapshot = await getDoc(characterRef);
      if (!characterSnapshot.exists()) {
        throw new Error("Character not found");
      }

      const characterData = characterSnapshot.data() as Character;
      await updateDoc(characterRef, {
        ...characterData,
        ...character,
      });

      console.log(`Character ${character.name} updated successfully`);
    } catch (error) {
      console.error("Error updating character:", error);
      throw error;
    }
  }

  async deleteCharacter(storyId: string, characterId: string): Promise<void> {
    try {
      const storyRef = doc(this.storiesCollection, storyId);
      const characterRef = doc(collection(storyRef, "characters"), characterId);
      await deleteDoc(characterRef);
      console.log(`Character with ID ${characterId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting character:", error);
      throw error;
    }
  }
}

export const characterService = new CharacterService();
