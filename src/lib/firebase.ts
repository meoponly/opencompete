import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getDatabase,
  ref,
  set,
  get,
  onValue,
  push,
  update,
  remove,
} from 'firebase/database';
import { User } from '../types';

const firebaseConfig = {
  apiKey: 'AIzaSyDvyIQNVjXPnVnYQWIcPrr5lrEAKbGr54k',
  authDomain: 'ewtube-b3413.firebaseapp.com',
  databaseURL: 'https://ewtube-b3413-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'ewtube-b3413',
  storageBucket: 'ewtube-b3413.firebasestorage.app',
  messagingSenderId: '67454816410',
  appId: '1:67454816410:web:27d326bf9668e5c64fcf23'
};

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

// Auth Service
export async function signUpUser(email: string, pass: string): Promise<FirebaseUser> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  return cred.user;
}

export async function signInUser(email: string, pass: string): Promise<FirebaseUser> {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return cred.user;
}

export async function signInWithGoogle(): Promise<FirebaseUser> {
  const cred = await signInWithPopup(auth, googleProvider);
  return cred.user;
}

export async function logOutUser(): Promise<void> {
  await signOut(auth);
}

// User Profile Database Service
export async function saveUserProfile(user: User): Promise<void> {
  try {
    const userRef = ref(db, `users/${user.id}`);
    await set(userRef, {
      id: user.id,
      email: user.email || '',
      username: user.username,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl || '',
      bio: user.bio || '',
      themePreference: user.themePreference || 'dark',
      streakDays: user.streakDays || 0,
      isOnline: true,
      isStudying: user.isStudying || false,
      currentTask: user.currentTask || '',
      currentCategory: user.currentCategory || '',
      updatedAt: new Date().toISOString(),
      createdAt: user.createdAt || new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Firebase saveUserProfile warning:', err);
  }
}

export async function fetchUserProfile(uid: string): Promise<User | null> {
  try {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val() as User;
    }
    return null;
  } catch (err) {
    console.warn('Firebase fetchUserProfile warning:', err);
    return null;
  }
}

export function subscribeToAllUsers(callback: (users: User[]) => void) {
  try {
    const usersRef = ref(db, 'users');
    return onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const list: User[] = Object.values(val);
        callback(list);
      } else {
        callback([]);
      }
    }, (error) => {
      console.warn('Users realtime sync warning:', error);
    });
  } catch (e) {
    return () => {};
  }
}

// Realtime Discussions & Sessions
export function subscribeToSquadMessages(groupId: string, callback: (data: any) => void) {
  try {
    const messagesRef = ref(db, `squads/${groupId}/messages`);
    return onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        callback({});
      }
    }, (error) => {
      console.warn('Realtime sync fallback:', error);
    });
  } catch (e) {
    return () => {};
  }
}

export function subscribeToSquadSessions(groupId: string, callback: (data: any) => void) {
  try {
    const sessionsRef = ref(db, `squads/${groupId}/sessions`);
    return onValue(sessionsRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        callback({});
      }
    }, (error) => {
      console.warn('Sessions sync fallback:', error);
    });
  } catch (e) {
    return () => {};
  }
}

export async function pushRealtimeMessage(groupId: string, message: any) {
  try {
    const messagesRef = ref(db, `squads/${groupId}/messages`);
    const newMsgRef = push(messagesRef);
    await set(newMsgRef, {
      ...message,
      id: newMsgRef.key,
      createdAt: new Date().toISOString(),
    });
    return newMsgRef.key;
  } catch (error) {
    console.warn('Push message fallback:', error);
    return null;
  }
}

export async function updateRealtimeMessage(groupId: string, messageId: string, updates: any) {
  try {
    const msgRef = ref(db, `squads/${groupId}/messages/${messageId}`);
    await update(msgRef, updates);
  } catch (error) {
    console.warn('Update message fallback:', error);
  }
}

export async function pushRealtimeSession(groupId: string, session: any) {
  try {
    const sessionsRef = ref(db, `squads/${groupId}/sessions`);
    const newSessionRef = push(sessionsRef);
    await set(newSessionRef, {
      ...session,
      id: newSessionRef.key,
      endedAt: new Date().toISOString(),
    });
    return newSessionRef.key;
  } catch (error) {
    console.warn('Push session fallback:', error);
    return null;
  }
}

export async function pushRealtimeResource(groupId: string, resource: any) {
  try {
    const resourcesRef = ref(db, `squads/${groupId}/resources`);
    const newResRef = push(resourcesRef);
    await set(newResRef, {
      ...resource,
      id: newResRef.key,
      createdAt: new Date().toISOString(),
    });
    return newResRef.key;
  } catch (error) {
    console.warn('Push resource fallback:', error);
    return null;
  }
}

export function subscribeToSquadResources(groupId: string, callback: (data: any) => void) {
  try {
    const resourcesRef = ref(db, `squads/${groupId}/resources`);
    return onValue(resourcesRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        callback({});
      }
    }, (error) => {
      console.warn('Resources sync fallback:', error);
    });
  } catch (e) {
    return () => {};
  }
}
