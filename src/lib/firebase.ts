import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getDatabase, ref, set, onValue, push, serverTimestamp, update, remove } from 'firebase/database';

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

// Authentication helper (anonymously or persistent custom token)
export async function initFirebaseAuth(callback?: (user: FirebaseUser | null) => void) {
  try {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        signInAnonymously(auth).catch((err) => {
          console.warn('Firebase anonymous sign in notice:', err);
        });
      }
      if (callback) callback(user);
    });
  } catch (error) {
    console.warn('Firebase auth initialization warning:', error);
  }
}

// Realtime Database listeners with error handling
export function subscribeToSquadMessages(groupId: string, callback: (data: any) => void) {
  try {
    const messagesRef = ref(db, `squads/${groupId}/messages`);
    return onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      }
    }, (error) => {
      console.warn('Realtime sync fallback to local store:', error);
    });
  } catch (e) {
    console.warn('Realtime database subscription error:', e);
    return () => {};
  }
}

export function subscribeToSquadSessions(groupId: string, callback: (data: any) => void) {
  try {
    const sessionsRef = ref(db, `squads/${groupId}/sessions`);
    return onValue(sessionsRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
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
    console.warn('Push message to Firebase RTDB fallback:', error);
    return null;
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
    console.warn('Push session to Firebase RTDB fallback:', error);
    return null;
  }
}
