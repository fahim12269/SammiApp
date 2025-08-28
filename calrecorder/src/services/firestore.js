import { db } from './firebase';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

const USER_ID = 'demo-user-1';

export async function saveDay(dateKey, meals) {
  const ref = doc(db, 'users', USER_ID, 'meals', dateKey);
  await setDoc(ref, { meals }, { merge: true });
}

export async function getDay(dateKey) {
  const ref = doc(db, 'users', USER_ID, 'meals', dateKey);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : { meals: [] };
}

export async function saveGoals(goals) {
  const ref = doc(db, 'users', USER_ID, 'goals', 'default');
  await setDoc(ref, goals, { merge: true });
}

export async function getGoalsRemote() {
  const ref = doc(db, 'users', USER_ID, 'goals', 'default');
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function listAllDays() {
  const colRef = collection(db, 'users', USER_ID, 'meals');
  const snaps = await getDocs(colRef);
  const result = {};
  snaps.forEach(d => {
    result[d.id] = d.data();
  });
  return result;
}
