import { collection, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

// Получить все события на модерации
export const getPendingEvents = async () => {
  try {
    const q = query(
      collection(db, 'events'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
      createdAt: doc.data().createdAt.toDate(),
    }));
  } catch (error) {
    console.error('Error fetching pending events:', error);
    throw error;
  }
};

// Одобрить событие
export const approveEvent = async (eventId: string) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      status: 'approved'
    });
  } catch (error) {
    console.error('Error approving event:', error);
    throw error;
  }
};

// Отклонить событие
export const rejectEvent = async (eventId: string) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      status: 'rejected'
    });
  } catch (error) {
    console.error('Error rejecting event:', error);
    throw error;
  }
};
