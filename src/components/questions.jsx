// import React, { useState, useEffect } from 'react';

// function QuestionsPage() {
//   const [questions, setQuestions] = useState([]);
//   const [error, setError] = useState(null);
//   const serviceName = "boarding"; // or fetch dynamically if needed

//   useEffect(() => {
//     async function fetchQuestions() {
//       const url = `https://hibow.in/api/Booking/GetTheListofQuestions?serviceName=${serviceName}`;

//       try {
//         const response = await fetch(url);
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         setQuestions(data); // Assuming API returns an array of questions
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError('Failed to load questions. Please try again later.');
//       }
//     }

//     fetchQuestions();
//   }, [serviceName]);

//   return (
//     <div>
//       <h1>Questions for {serviceName}</h1>
//       {error ? (
//         <p>{error}</p>
//       ) : (
//         <ul>
//           {questions.map((question, index) => (
//             <li key={index}>{question}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default QuestionsPage;
