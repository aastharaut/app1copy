// // src/firebase/services.js
// import { 
//     collection, 
//     doc, 
//     getDocs, 
//     getDoc, 
//     addDoc, 
//     updateDoc, 
//     query, 
//     where,
//     serverTimestamp 
//   } from 'firebase/firestore';
//   import { db, auth } from '../FirebaseConfig';
  
//   // Doctor services
//   export const getDoctors = async () => {
//     try {
//       const doctorsRef = collection(db, 'doctors');
//       const snapshot = await getDocs(doctorsRef);
//       return snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//     } catch (error) {
//       console.error("Error getting doctors:", error);
//       throw error;
//     }
//   };
  
//   export const getDoctorById = async (doctorId) => {
//     try {
//       const doctorRef = doc(db, 'doctors', doctorId);
//       const doctorSnap = await getDoc(doctorRef);
      
//       if (doctorSnap.exists()) {
//         return {
//           id: doctorSnap.id,
//           ...doctorSnap.data()
//         };
//       } else {
//         throw new Error("Doctor not found");
//       }
//     } catch (error) {
//       console.error("Error getting doctor:", error);
//       throw error;
//     }
//   };
  
//   // Appointment services
//   export const getAvailableSlots = async (doctorId, date) => {
//     try {
//       // Get doctor's general availability
//       const doctor = await getDoctorById(doctorId);
      
//       // Get the day of the week from the date
//       const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
      
//       // Get all slots for that day from doctor's availability
//       const allSlots = doctor.availability[dayOfWeek] || [];
      
//       // Get booked appointments for that doctor and date
//       const appointmentsRef = collection(db, 'appointments');
//       const q = query(
//         appointmentsRef, 
//         where("doctorId", "==", doctorId),
//         where("date", "==", date),
//         where("status", "==", "booked")
//       );
      
//       const bookedAppointments = await getDocs(q);
//       const bookedSlots = bookedAppointments.docs.map(doc => doc.data().timeSlot);
      
//       // Filter out booked slots
//       return allSlots.filter(slot => !bookedSlots.includes(slot));
//     } catch (error) {
//       console.error("Error getting available slots:", error);
//       throw error;
//     }
//   };
  
//   export const bookAppointment = async (appointmentData) => {
//     try {
//       // Verify the user is authenticated
//       const user = auth.currentUser;
//       if (!user) {
//         throw new Error("User not authenticated");
//       }
      
//       // First check if the slot is still available
//       const availableSlots = await getAvailableSlots(
//         appointmentData.doctorId, 
//         appointmentData.date
//       );
      
//       if (!availableSlots.includes(appointmentData.timeSlot)) {
//         throw new Error("This time slot is no longer available");
//       }
      
//       // Create the appointment
//       const appointmentsRef = collection(db, 'appointments');
//       const newAppointment = {
//         ...appointmentData,
//         userId: user.uid,
//         status: "booked",
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp()
//       };
      
//       const docRef = await addDoc(appointmentsRef, newAppointment);
//       return { id: docRef.id, ...newAppointment };
//     } catch (error) {
//       console.error("Error booking appointment:", error);
//       throw error;
//     }
//   };
  
//   export const updateAppointmentStatus = async (appointmentId, status) => {
//     try {
//       const appointmentRef = doc(db, 'appointments', appointmentId);
//       await updateDoc(appointmentRef, {
//         status: status,
//         updatedAt: serverTimestamp()
//       });
//       return true;
//     } catch (error) {
//       console.error("Error updating appointment:", error);
//       throw error;
//     }
//   };
  
//   export const getUserAppointments = async () => {
//     try {
//       const user = auth.currentUser;
//       if (!user) {
//         throw new Error("User not authenticated");
//       }
      
//       const appointmentsRef = collection(db, 'appointments');
//       const q = query(appointmentsRef, where("userId", "==", user.uid));
//       const snapshot = await getDocs(q);
      
//       return snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//     } catch (error) {
//       console.error("Error getting user appointments:", error);
//       throw error;
//     }
//   };