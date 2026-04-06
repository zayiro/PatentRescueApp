import { NameCollection } from "@/enums/NameCollection";
import { db } from "@/firebase/config";
import { arrayRemove, doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

interface Disease {
  id: string;
  name: any;
}

// Si no tienes el hook
export const useMedicalHistory = (userId: string) => {
  const [diseasesList, setDiseasesList] = useState<Disease[]>([]);
  
  useEffect(() => {
    if (userId) {

        const unsubscribe = onSnapshot(doc(db, NameCollection.MedicalHistory, userId), (snap) => {
          setDiseasesList(snap.data()?.underlyingDiseases || []);
        });
        return unsubscribe;
    }
  }, [userId]);

  const removeFromMedicalHistory = async (userId: string, diseaseId: string) => {
    try {
        const diseaseToRemove = diseasesList.find(d => d.id === diseaseId);
        if (!diseaseToRemove) {
            console.log('Disease no encontrada:', diseaseId);
            return;
        }

    await updateDoc(doc(db, NameCollection.MedicalHistory, userId), {
        underlyingDiseases: arrayRemove(diseaseToRemove),
        updatedAt: serverTimestamp(),
    });
    } catch (error) {
      console.error('Error remove:', error);
    }
  };

  return { diseasesList, removeFromMedicalHistory };
};