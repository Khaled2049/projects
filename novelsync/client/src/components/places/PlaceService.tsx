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
import { Place } from "@/types/IPlace";

class PlaceService {
  private storiesCollection = collection(firestore, "stories");

  async getPlaces(storyId: string): Promise<Place[]> {
    try {
      const plotsCollection = collection(
        this.storiesCollection,
        storyId,
        "places"
      );
      const placesSnapshot = await getDocs(plotsCollection);
      return placesSnapshot.docs.map((doc) => doc.data() as Place);
    } catch (error) {
      console.error("Error getting plots:", error);
      throw error;
    }
  }

  async addPlace(storyId: string, place: Omit<Place, "id">): Promise<string> {
    try {
      const storyRef = doc(this.storiesCollection, storyId);
      const placesCollection = collection(storyRef, "places");
      const newplaceRef = doc(placesCollection);

      const newplace: Place = {
        ...place,
        id: newplaceRef.id,
      };

      await setDoc(newplaceRef, newplace);
      console.log(`place ${newplace.name} added successfully`);
      return newplace.id;
    } catch (error) {
      console.error("Error adding place:", error);
      throw error;
    }
  }

  async updatePlace(storyId: string, place: Place): Promise<void> {
    try {
      const storyRef = doc(this.storiesCollection, storyId);
      const placeRef = doc(collection(storyRef, "places"), place.id);
      const placesnapshot = await getDoc(placeRef);
      if (!placesnapshot.exists()) {
        throw new Error("place not found");
      }

      const placeData = placesnapshot.data() as Place;
      await updateDoc(placeRef, {
        ...placeData,
        ...place,
      });

      console.log(`place ${place.name} updated successfully`);
    } catch (error) {
      console.error("Error updating place:", error);
      throw error;
    }
  }

  async deletePlace(storyId: string, placeId: string): Promise<void> {
    try {
      const storyRef = doc(this.storiesCollection, storyId);
      const placeRef = doc(collection(storyRef, "places"), placeId);
      await deleteDoc(placeRef);
      console.log(`place with ID ${placeId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting place:", error);
      throw error;
    }
  }
}

export const placeService = new PlaceService();
