import { 
    collection,
    getDocs,
    getDoc,
    doc, 
    setDoc,
    updateDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    deleteDoc
} from 'firebase/firestore'
import 'firebase/storage';
import { signInWithEmailAndPassword, sendEmailVerification, createUserWithEmailAndPassword, signOut, updatePassword, updateProfile } from "firebase/auth"
import { db, auth } from '@/firebase/config'
import { sendPasswordResetEmail, fetchSignInMethodsForEmail, getIdToken } from "firebase/auth";
import { authenticationAPIErrorsFirebase } from '@/service/authenticationAPIErrorsFirebase';

export const createDocument = async (path, uid, data) => {
    return  await setDoc(doc(db, path, uid), data)   
}

export const signInUserWithEmailAndPassword = async (email, password) => { 
    let signIn
                
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const token = await getIdToken(user);

        signIn = {
            isSuccess: true,
            errorMessage: '',
            uid: user.uid,
            token: token
        }
    })
    .catch((err) => { 
        let errorMessage = authenticationAPIErrorsFirebase(err.code)
        signIn = {
            isSuccess: false,
            errorMessage,
            //user: [],
            uid: 0,
            token: ''
        }
    })

    return signIn
}
  
export const signOutUser = async () => { 
    const result = { isSuccess: true, errorMessage: '' }

    await signOut(auth).then(() => {
        
      }).catch((err) => {
        result.isSuccess = false
        result.errorMessage = 'An error occurred: ' + err
      });

      return result
};

export const currentUser = () => {
    const user = auth.currentUser
    if (user === null) {
        return false
    }

    return user
}

export const disableUser = async (user) => {
    try {
      // Aquí puedes establecer un campo en el perfil del usuario que indique que está inhabilitado
      await updateProfile(user, {
        disabled: true // Este campo no existe en Firebase, es solo un ejemplo
      });

      return true;
    } catch (error) {}
};

export const verifyUserEmail = async () => {    
    const user = auth.currentUser;

    sendEmailVerification(user)
    .then((object) => {});
}

export const checkEmailExists = async (email) => {
  const signInMethods = await fetchSignInMethodsForEmail(auth, email);
  return signInMethods.length > 0; // Si hay métodos de inicio de sesión, el correo ya está en uso
};

export const createNewUser = async (email, password) => {
    const result = { isSuccess: true, response: null, errorCode: 0, errorMessage: '', userId: 0 }
        
    await createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        const user = userCredential.user;
        result.response = userCredential;
        result.userId = userCredential.user.uid;

        await sendEmailVerification(user);
    }).catch(err => {
        result.errorMessage = authenticationAPIErrorsFirebase(err.code);
        result.isSuccess = false;
    })

    return result;
}

export const updateDocumentCollection = async (path, uid, data) => {    
    const result = {isSuccess: true, response: null, errorCode: 0, errorMessage: ''}
    try {       
        await updateDoc(doc(db, path, uid), data)     
    } catch (error) {
        result.errorCode = 1
        result.errorMessage = error.message
        result.isSuccess = false
    }

    return result
}

export const updateProfileUser = async(data) => {
    const result = {isSuccess: true, response: null, errorCode: 0, errorMessage: ''}
    try {
         updateProfile(auth.currentUser, {
            displayName: data.displayName, 
            phoneNumber: data.phoneNumber
        }).then(() => {            
        }).catch((error) => {
        });
    } catch (error) {
        result.errorCode = 1
        result.isSuccess = false
        result.errorMessage = error
    }

    return result
}

export const changePassword = async (currentPassword, newPassword, userId) => {
    const status = false;

    try {
      await reauthenticate(currentPassword);

      const user = auth.currentUser;
      await user.updatePassword(newPassword);
      await updateDocumentCollection('users', userId, { password: newPassword })
      status = true;
    } catch (error) {}

    return status;
};

export const updateProfilePhoto = async(data) => {    
    updateProfile(auth.currentUser, {
        displayName: data.displayName, photoURL: data.photoURL
    }).then(() => {
       
    }).catch((error) => {
        
    });

    return true
}

export const updateUserPassword = async(newPassword) => {
    const result = {isSuccess: true, response: null, errorCode: 0, errorMessage: ''}
    const user = auth.currentUser;

    try {
        updatePassword(user, newPassword).then(() => {
            // Update successful.
        }).catch((error) => {
            result.errorCode = 1
            result.isSuccess = false
            result.errorMessage = error
        });
    } catch (error) {
        result.errorCode = 1
        result.isSuccess = false
        result.errorMessage = error
    }

    return result
}

export const registerTokenNotification = async (uid) => {
    let result = null;   
    
    try {
        const docSnap = await getDoc(doc(db, 'users', uid));
        if (docSnap.exists()) {
            result = docSnap.data();      
        }
    } catch (err) {
        handleEmail("Error", "Error on registerTokenNotification firebase: ", err)
    }       

    return result;
}

export const getUserData = async (userId) => {
    let collectionData;
    try {
        const colRef = collection(db, "users")
        const q = query(colRef, where("userId", "==", userId));
        const Snapshot = await getDocs(q)

        Snapshot.forEach(doc => {
            collectionData = doc.data()
        })
    } catch (err) {
        handleEmail("Error", "Error on getUserData firebase: ", err);
    }

    return collectionData;
}

export const getMedicalHistoryData = async (userId) => {
    let collectionData;
    try {
        const colRef = collection(db, "MedicalHistory")
        const q = query(colRef, where("userId", "==", userId));
        const Snapshot = await getDocs(q)

        Snapshot.forEach(doc => {
            collectionData = doc.data()
        })
    } catch (err) {
        handleEmail("Error", "Error on getMedicalHistoryData firebase: ", err);
    }

    return collectionData;
}

export const getMedicationData = async (userId) => {
    let collectionData;
    try {
        const colRef = collection(db, "Medication")
        const q = query(colRef, where("userId", "==", userId));
        const Snapshot = await getDocs(q)

        Snapshot.forEach(doc => {
            collectionData = doc.data()
        })
    } catch (err) {
        handleEmail("Error", "Error on getMedicationData firebase: ", err);
    }

    return collectionData;
}

export const getAppoinments = async (id) => {
    let collectionData;
    try {
        const colRef = collection(db, "appointments")
        const q = query(colRef, where("id", "==", id));
        const Snapshot = await getDocs(q)

        Snapshot.forEach(doc => {
            collectionData = doc.data()
        })
    } catch (err) {
        handleEmail("Error", "Error on getAppoinments firebase: ", err);
    }

    return collectionData;
}

export const userAsyncFunction = async (item) => {
    const docRefUser = doc(db, "users", item.userId);
    const docSnap = await getDoc(docRefUser);

    if (docSnap.exists()) {
        let info = {
            creationDate: item.creationDate,
            name: docSnap.data().name,
            countryCode: docSnap.data().countryCode,
            photoURL: docSnap.data().photoURL,
            userId: item.userId,
        }

        return info            
    }

    return;
}

export const uploadImageUser = async (image, userId) => {
    message = 'Imagen de perfil subida correctamente';    
    await updateDoc(doc(db, "users", userId), { "photoURL": image });

    return message;
}

export const sendPasswordReset = async (email) => {
    let result;
    try {
      await sendPasswordResetEmail(auth, email);
      result = 'Password reset email sent!';
    } catch (error) {
      result = 'Error sending password reset email: ', error.message;
    }

    return result;
};

export const getCountNotifications = async (userId) => {
    let count = 0
    try {
        const colRef = collection(db, "userNotifications")
        const q = query(colRef, where("userId", "==", userId));
        const Snapshot = await getDocs(q)
        
        Snapshot.forEach(doc => {
            count++
        })
    } catch (err) {
        handleEmail("Error", "Error on getCountNotifications firebase: ", err)
    }       

    return count;
}

export const getConfiguration = async (userId) => {
    let collectionData;
    try {
        const colRef = collection(db, "configuration")
        const q = query(colRef);
        const Snapshot = await getDocs(q)

        Snapshot.forEach(doc => {
            collectionData = doc.data()
        })
    } catch (err) {
        handleEmail("Error", "Error on getConfiguration firebase: ", err);
    }

    return collectionData;
}
