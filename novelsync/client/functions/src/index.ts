/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onDocumentWritten } from "firebase-functions/v2/firestore";
// import * as logger from "firebase-functions/logger";

// Cloud function triggered on any document write (create, update, delete) in the 'story' collection
export const logStoryDataOnWrite = onDocumentWritten(
  "story/{storyId}",
  (event) => {
    // Get previous and new data from the event
    const beforeData = event.data?.before?.data() || null; // Data before the change
    const afterData = event.data?.after?.data() || null; // Data after the change

    const storyId = event.params?.storyId;

    // Check if the document was created
    if (!beforeData && afterData) {
      console.log(`Story with ID: ${storyId} was created.`);
      console.log("Story data:", afterData);
    }

    // Check if the document was updated
    if (beforeData && afterData) {
      console.log(`Story with ID: ${storyId} was updated.`);
      console.log("Before:", beforeData);
      console.log("After:", afterData);
    }

    // Check if the document was deleted
    if (beforeData && !afterData) {
      console.log(`Story with ID: ${storyId} was deleted.`);
      console.log("Deleted story data:", beforeData);
    }

    return;
  }
);
