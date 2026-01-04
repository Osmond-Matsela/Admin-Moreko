// server-only Firestore Admin helpers
import { adminDb } from "./firebaseAdmin";
import { randomUUID } from "crypto";
import { z } from "zod";

// Example validation schemas
export const ParentSchema = z.object({
  name: z.string().min(2).max(200),
  phone: z.string().min(7).max(50).optional(),
  children: z.array(z.object({id: z.string().min(1), name: z.string(), grade: z.string() })),
  id: z.string().min(1),
  addedDate: z.string().min(1),
});

export const PostSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  author: z.string().min(1),
  category: z.string().min(1),
  submittedAt: z.string().min(1),
  status: z.string().min(1),
  featuredImage: z.string().min(1),
});


export const ArticleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  authorId: z.string().min(1),
  submittedAt: z.string().min(1),
});

export const UserSchema = z.object({
  id: z.string().min(1),
  email: z.string(),
  name: z.string().min(2).max(100),
  role: z.string().optional(),
});

type CollectionNames = "parents" | "posts" | "student-articles" | "user";

// -------------------- Generic Helpers --------------------

const generateId = () => randomUUID();

const batchWrite = async (operations: { ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>, data: any }[]) => {
  const batch = adminDb.batch();
  for (const op of operations) batch.set(op.ref, op.data);
  await batch.commit();
};

// -------------------- Parents --------------------

export const addParents = async (parents: any[]) => {
  const validated = parents.map(p => ParentSchema.parse(p));
  
  const ops = validated.map(parent => {
    const id = parent.id;
    const ref = adminDb.collection("parent").doc(id);
    return { ref, data: { ...parent, createdAt: new Date().toISOString() } };
  });

  await batchWrite(ops);
  return ops.map(op => op.ref.id);

};

export const getParents = async (limit = 25, startAfter?: string) => {
  let q = adminDb.collection("parent").orderBy("addedDate", "desc");
  if (startAfter) {
    const doc = await adminDb.collection("parent").doc(startAfter).get();
    if (doc.exists) q = q.startAfter(doc);
  }
  const snap = await q.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const deleteParent = async (id: string) => {
  await adminDb.collection("parent").doc(id).delete();
};

export const updateParent = async (
  id: string,
  updates: any
) => {
  const ref = adminDb.collection("parent").doc(id);

  if (!(await ref.get()).exists) {
    throw new Error("Parent not found");
  }

  await ref.update({
    ...updates,
  
  });

  return id;
};

// -------------------- Posts --------------------

export const addPosts = async (post: any) => {
  const validated = PostSchema.parse(post);
  const ref = adminDb.collection("posts").doc(post.id);
  const data = { ...validated };
  await ref.set(data);
  return ref.id;
};

export const getPosts = async (collectionName: string, limit = 25, startAfter?: string) => {
  let q = adminDb.collection(collectionName).orderBy("submittedAt", "desc").limit(limit);

  if (startAfter) {
    const doc = await adminDb.collection(collectionName).doc(startAfter).get();
    if (doc.exists) q = q.startAfter(doc);
  }

  const snap = await q.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};



// -------------------- Student Articles --------------------

export const addArticles = async (articles: unknown[]) => {
  const validated = articles.map(a => ArticleSchema.parse(a));
  const ops = validated.map(article => {
    const id = article.id;
    const ref = adminDb.collection("student-articles").doc(id);
    return { ref, data: { ...article, createdAt: new Date().toISOString() } };
  });
  await batchWrite(ops);
  return ops.map(op => op.ref.id);
};

export const getArticles = async (limit = 25, startAfter?: string) => {
  let q = adminDb.collection("student-articles").limit(limit);
  if (startAfter) {
    const doc = await adminDb.collection("student-articles").doc(startAfter).get();
    if (doc.exists) q = q.startAfter(doc);
  }
  const snap = await q.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const deleteArticle = async (id: string) => {
  await adminDb.collection("student-articles").doc(id).delete();
  await adminDb.collection("posts").doc(id).delete();
};

// -------------------- Users --------------------

export const addUser = async (user: any) => {
  // Validate schema
  const validatedUser = UserSchema.parse(user);

  const id = user.id;
  const ref = adminDb.collection("user").doc(id);
  await ref.set({ ...validatedUser, createdAt: new Date().toISOString() });
  return id;

};

export const getUser = async (role: string = "admin", email: string) => {
  const q = adminDb
    .collection("user")
    .where("role", "==", role)
    .where("email", "==", email)
    .limit(1);

  const snap = await q.get();

  const doc = snap.docs[0];
  return doc.data();
};

export const deleteUser = async (id: string) => {
  await adminDb.collection("user").doc(id).delete();
};

export const findUser = async (role: string, email: string) => {
  const user = await getUser(role, email);
  return !!user;
};