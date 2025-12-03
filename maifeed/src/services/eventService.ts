import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface Event {
  id?: string;
  title: string;
  description: string;
  fullDescription?: string;
  date: Date;
  time: string;
  endTime?: string;
  location: string;
  category?: string;
  institute?: string;
  course?: string;
  studentGroup?: string;
  organizerId: string;
  organizerName: string;
  organizerUsername: string;
  groupId: string;
  registrationLink?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export const createEvent = async (event: Omit<Event, 'id' | 'createdAt' | 'status'>) => {
  try {
    // Удаляем поля с undefined значениями (Firestore их не поддерживает)
    const cleanEvent = Object.fromEntries(
      Object.entries({
        ...event,
        fullDescription: event.fullDescription || event.description,
        date: Timestamp.fromDate(event.date),
        status: 'pending',
        createdAt: Timestamp.now(),
      }).filter(([_, value]) => value !== undefined)
    );

    const docRef = await addDoc(collection(db, 'events'), cleanEvent);
    return docRef.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const getEventsByGroup = async (groupId: string, startDate: Date, endDate: Date) => {
  try {
    const q = query(
      collection(db, 'events'),
      where('groupId', '==', groupId),
      where('status', '==', 'approved'),
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate)),
      orderBy('date', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
      createdAt: doc.data().createdAt.toDate(),
    })) as Event[];
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};
