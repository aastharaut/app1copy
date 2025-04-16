// import { useEffect } from "react";
// import { collection, setDoc, doc } from "firebase/firestore";
// import { db } from "../FirebaseConfig";

// export default function SeedDoctors() {
//   useEffect(() => {
//     const seedDoctors = async () => {
//       const doctors = [
//         {
//           id: "dr_anita_sharma",
//           name: "Dr. Anita Sharma",
//           specialization: "OBGYN",
//           location: "Thapathali, Kathmandu",
//           rating: 4.9,
//           photoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
//           available: true,
//         },
//         {
//           id: "dr_kamala_bhattrai",
//           name: "Dr. Kamala Bhattrai",
//           specialization: "Gynecologist",
//           location: "Naxal, Kathmandu",
//           rating: 4.8,
//           photoUrl: "https://randomuser.me/api/portraits/women/68.jpg",
//           available: true,
//         },
//         {
//           id: "dr_isha_adhikari",
//           name: "Dr. Isha Adhikari",
//           specialization: "OBGYN",
//           location: "Budhanilkantha, Kathmandu",
//           rating: 4.7,
//           photoUrl: "https://randomuser.me/api/portraits/women/21.jpg",
//           available: false,
//         },
//         {
//           id: "dr_sophia_chaudhary",
//           name: "Dr. Sophia Chaudhary",
//           specialization: "Gynecologist",
//           location: "Patan, Lalitpur",
//           rating: 4.8,
//           photoUrl: "https://randomuser.me/api/portraits/women/30.jpg",
//           available: true,
//         },
//         {
//           id: "dr_meera_khan",
//           name: "Dr. Meera Khan",
//           specialization: "OBGYN",
//           location: "Kaushaltar, Bhaktapur",
//           rating: 4.9,
//           photoUrl: "https://randomuser.me/api/portraits/women/52.jpg",
//           available: true,
//         }
//       ];

//       for (const docData of doctors) {
//         await setDoc(doc(db, "doctors", docData.id), docData);
//       }

//       console.log("Doctors added successfully!");
//     };

//     seedDoctors();
//   }, []);

//   return null;
// }
