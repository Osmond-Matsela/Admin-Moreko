import {
  collection,
  doc,
  setDoc,
  where,
  query,
  getDocs,
  CACHE_SIZE_UNLIMITED,
  getDoc,
  updateDoc,
  deleteDoc,
  DocumentData,
} from "firebase/firestore";
import { app } from "@/lib/firebase";
import { initializeFirestore } from "firebase/firestore";

export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

export const addData = async (
  collectionName: string,
  data: any,
  id: string
) => {
  await setDoc(doc(db, collectionName, id), data);
};

export const userExists = async (collectionName: string, userEmail: string) => {
  const q = query(
    collection(db, collectionName),
    where("email", "==", userEmail)
  );
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const parentExists = async (collectionName: string, contact: string) => {
  const q = query(
    collection(db, collectionName),
    where("contact", "==", contact)
  );
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const getUser = async (collectionName: string, userEmail: string) => {
  const q = query(
    collection(db, collectionName),
    where("email", "==", userEmail)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0].data();
};

export const getParent = async (collectionName: string, phone: string) => {
  const q = query(collection(db, collectionName), where("phone", "==", phone));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0].data();
};

export const deleteParent = async (collectionName: string, id: string) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    return true;
  } catch (e) {
    return false;
  }
};

export const deleteArticle = async (collectionName: string, id: string) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    return true;
  } catch (e) {
    return false;
  }
}

export const addParent = async (collectionName: string, data: any) => {
  try {
    data.forEach(async (parent: any) => {
      await setDoc(doc(db, collectionName, parent.id), parent);
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getParents = async (collectionName: string) => {
  const users: DocumentData[] = [];
  const q = query(collection(db, collectionName));
  const querySnapshot = await getDocs(q);
  querySnapshot.docs.forEach((doc) => users.push(doc.data()));

  return users;
};

export const getContent = async (collectionName: string) => {
  const q = query(collection(db, collectionName));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0].data();
};

export const getPosts = async (collectionName: string) => {
  const posts: DocumentData[] = [];
  const q = query(collection(db, collectionName));
  const querySnapshot = await getDocs(q);
  querySnapshot.docs.forEach((doc) => posts.push(doc.data()));

  return posts;
};

export const addPost = async (collectionName: string, data: any) => {
  try {
    await setDoc(doc(db, collectionName, data.id), data);

    return true;
  } catch (e) {
    return false;
  }
};


export const updateData = async (
  collectionName: string,
  id: string,
  data: any
) => {
  await updateDoc(doc(db, collectionName, id), data);
};

export const deleteData = async (collectionName: string, id: string) => {
  await deleteDoc(doc(db, collectionName, id));
};
