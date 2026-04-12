import { NameCollection } from "@/enums/NameCollection";
import { db } from "@/firebase/config";
import { arrayRemove, doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

interface Disease {
  id: string;
  name: any;
}

// Si no tienes el hook
export const useMedicalHistory = (userId: string, diseaseItem: string) => {
  const [diseasesList, setDiseasesList] = useState<Disease[]>([]);
  
  useEffect(() => {
    if (userId) {
      const unsubscribe = onSnapshot(doc(db, NameCollection.MedicalHistory, userId), (snap) => {
        if (diseaseItem === 'underlyingDiseases') {
          setDiseasesList(snap.data()?.underlyingDiseases || []);
        } else if (diseaseItem === 'hereditaryDiseases') {
          setDiseasesList(snap.data()?.hereditaryDiseases || []);
        }
      });
      return unsubscribe;
    }
  }, [userId, diseaseItem]);

  const removeFromMedicalHistory = async (userId: string, diseaseId: string) => {
    try {
        const diseaseToRemove = diseasesList.find(d => d.id === diseaseId);
        if (!diseaseToRemove) {         
          return;
        }

      if (diseaseItem === 'underlyingDiseases') {  
        await updateDoc(doc(db, NameCollection.MedicalHistory, userId), {
          underlyingDiseases: arrayRemove(diseaseToRemove),
          updatedAt: serverTimestamp(),
        });
      } else if (diseaseItem === 'hereditaryDiseases') {
        await updateDoc(doc(db, NameCollection.MedicalHistory, userId), {
          hereditaryDiseases: arrayRemove(diseaseToRemove),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error remove:', error);
    }
  };

  return { diseasesList, removeFromMedicalHistory };
};