// // Period Tracker Onboarding Component
// import React, { useState, useEffect } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import './PeriodTrackerOnboarding.css';

// const PeriodTrackerOnboarding = () => {
//   // State management for form data
//   const [formData, setFormData] = useState({
//     lastPeriodStartDate: null,
//     previousPeriodStartDate: null,
//     lastPeriodDuration: 5, // Default duration in days
//     previousPeriodDuration: 5, // Default duration in days
//     isUnsureLastPeriod: false,
//     isUnsurePreviousPeriod: false,
//   });

//   // Error state
//   const [errors, setErrors] = useState({});
  
//   // Validation function
//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.lastPeriodStartDate && !formData.isUnsureLastPeriod) {
//       newErrors.lastPeriodStartDate = "Please select your last period start date or check 'Not sure'";
//     }
    
//     if (formData.previousPeriodStartDate && formData.lastPeriodStartDate) {
//       // Ensure previous period is before last period
//       if (new Date(formData.previousPeriodStartDate) >= new Date(formData.lastPeriodStartDate)) {
//         newErrors.previousPeriodStartDate = "Previous period must be before your last period";
//       }
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle date selection for last period
//   const handleLastPeriodDateChange = (date) => {
//     setFormData({
//       ...formData,
//       lastPeriodStartDate: date,
//       isUnsureLastPeriod: false,
//     });
//   };

//   // Handle date selection for previous period
//   const handlePreviousPeriodDateChange = (date) => {
//     setFormData({
//       ...formData,
//       previousPeriodStartDate: date,
//       isUnsurePreviousPeriod: false,
//     });
//   };

//   // Handle duration changes
//   const handleDurationChange = (event, periodType) => {
//     const value = parseInt(event.target.value);
//     setFormData({
//       ...formData,
//       [periodType]: value,
//     });
//   };

//   // Handle "Not sure" checkbox for last period
//   const handleUnsureLastPeriod = (event) => {
//     const checked = event.target.checked;
//     setFormData({
//       ...formData,
//       isUnsureLastPeriod: checked,
//       lastPeriodStartDate: checked ? null : formData.lastPeriodStartDate,
//     });
//   };

//   // Handle "Not sure" checkbox for previous period
//   const handleUnsurePreviousPeriod = (event) => {
//     const checked = event.target.checked;
//     setFormData({
//       ...formData,
//       isUnsurePreviousPeriod: checked,
//       previousPeriodStartDate: checked ? null : formData.previousPeriodStartDate,
//     });
//   };

//   // Form submission handler
//   const handleSubmit = (event) => {
//     event.preventDefault();
    
//     if (validateForm()) {
//       // Calculate prediction range based on data
//       const predictions = calculatePredictions(formData);
      
//       // Here you would typically:
//       // 1. Save the user's data to your database
//       // 2. Navigate to the next step or dashboard
//       // 3. Display their predicted next period
      
//       console.log("Form submitted successfully:", formData);
//       console.log("Predictions:", predictions);
      
//       // Example of calling an API to save data
//       // saveUserData(formData);
      
//       // Example of navigating to next screen
//       // history.push('/dashboard', { predictions });
//     }
//   };

//   // Function to calculate predictions based on provided data
//   const calculatePredictions = (data) => {
//     let cycleLength = 28; // Default cycle length
//     let predictionRange = 3; // Default range in days (±3 days)
    
//     // If we have both period start dates, calculate the cycle length
//     if (data.lastPeriodStartDate && data.previousPeriodStartDate) {
//       const lastDate = new Date(data.lastPeriodStartDate);
//       const prevDate = new Date(data.previousPeriodStartDate);
//       const diffTime = Math.abs(lastDate - prevDate);
//       cycleLength = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     }
    
//     // If user is unsure about dates, increase the prediction range
//     if (data.isUnsureLastPeriod || data.isUnsurePreviousPeriod) {
//       predictionRange = 5; // Wider range for uncertainty
//     }
    
//     // Calculate the predicted next period start date
//     const nextPeriodDate = new Date(data.lastPeriodStartDate);
//     nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);
    
//     // Calculate range dates
//     const earliestDate = new Date(nextPeriodDate);
//     earliestDate.setDate(earliestDate.getDate() - predictionRange);
    
//     const latestDate = new Date(nextPeriodDate);
//     latestDate.setDate(latestDate.getDate() + predictionRange);
    
//     return {
//       predictedDate: nextPeriodDate,
//       earliestDate: earliestDate,
//       latestDate: latestDate,
//       cycleLength: cycleLength,
//       predictionRange: predictionRange
//     };
//   };

//   // Format date to display to user
//   const formatDate = (date) => {
//     if (!date) return "";
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   return (
//     <div className="period-tracker-onboarding">
//       <h1>Welcome to Your Period Tracker</h1>
//       <p className="description">
//         Let's set up your personalized tracking. The more information you provide,
//         the more accurate your predictions will be.
//       </p>
      
//       <form onSubmit={handleSubmit}>
//         {/* Last Period Section */}
//         <div className="form-section">
//           <h2>When did your last period start?</h2>
//           <p className="required-field">* Required</p>
          
//           <div className="calendar-container">
//             {!formData.isUnsureLastPeriod && (
//               <>
//                 <Calendar
//                   onChange={handleLastPeriodDateChange}
//                   value={formData.lastPeriodStartDate}
//                   maxDate={new Date()} // Can't select future dates
//                   className={errors.lastPeriodStartDate ? "error-calendar" : ""}
//                 />
//                 {formData.lastPeriodStartDate && (
//                   <p className="selected-date">
//                     Selected: {formatDate(formData.lastPeriodStartDate)}
//                   </p>
//                 )}
//               </>
//             )}
            
//             <div className="checkbox-container">
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={formData.isUnsureLastPeriod}
//                   onChange={handleUnsureLastPeriod}
//                 />
//                 I'm not sure about the exact date
//               </label>
//             </div>
            
//             {errors.lastPeriodStartDate && (
//               <p className="error-message">{errors.lastPeriodStartDate}</p>
//             )}
//           </div>
          
//           <div className="duration-container">
//             <label htmlFor="lastPeriodDuration">
//               How many days did it last?
//             </label>
//             <select
//               id="lastPeriodDuration"
//               value={formData.lastPeriodDuration}
//               onChange={(e) => handleDurationChange(e, 'lastPeriodDuration')}
//             >
//               {[...Array(10)].map((_, i) => (
//                 <option key={i + 1} value={i + 1}>
//                   {i + 1} {i === 0 ? 'day' : 'days'}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
        
//         {/* Previous Period Section */}
//         <div className="form-section">
//           <h2>When did your period before that start?</h2>
//           <p>(Optional, but helps with more accurate predictions)</p>
          
//           <div className="calendar-container">
//             {!formData.isUnsurePreviousPeriod && (
//               <>
//                 <Calendar
//                   onChange={handlePreviousPeriodDateChange}
//                   value={formData.previousPeriodStartDate}
//                   maxDate={formData.lastPeriodStartDate || new Date()} // Can't be after last period
//                   className={errors.previousPeriodStartDate ? "error-calendar" : ""}
//                 />
//                 {formData.previousPeriodStartDate && (
//                   <p className="selected-date">
//                     Selected: {formatDate(formData.previousPeriodStartDate)}
//                   </p>
//                 )}
//               </>
//             )}
            
//             <div className="checkbox-container">
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={formData.isUnsurePreviousPeriod}
//                   onChange={handleUnsurePreviousPeriod}
//                 />
//                 I'm not sure about the exact date
//               </label>
//             </div>
            
//             {errors.previousPeriodStartDate && (
//               <p className="error-message">{errors.previousPeriodStartDate}</p>
//             )}
//           </div>
          
//           <div className="duration-container">
//             <label htmlFor="previousPeriodDuration">
//               How many days did it last?
//             </label>
//             <select
//               id="previousPeriodDuration"
//               value={formData.previousPeriodDuration}
//               onChange={(e) => handleDurationChange(e, 'previousPeriodDuration')}
//             >
//               {[...Array(10)].map((_, i) => (
//                 <option key={i + 1} value={i + 1}>
//                   {i + 1} {i === 0 ? 'day' : 'days'}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
        
//         <div className="button-container">
//           <button type="submit" className="submit-button">
//             Complete Setup
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };
// /* PeriodTrackerOnboarding.css */
// .period-tracker-onboarding {
//     max-width: 800px;
//     margin: 0 auto;
//     padding: 20px;
//     font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//     color: #333;
//   }
  
//   .period-tracker-onboarding h1 {
//     text-align: center;
//     color: #d23f72;
//     margin-bottom: 10px;
//   }
  
//   .description {
//     text-align: center;
//     margin-bottom: 30px;
//     color: #666;
//   }
  
//   .form-section {
//     background-color: #fff;
//     border-radius: 12px;
//     padding: 20px;
//     margin-bottom: 25px;
//     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//   }
  
//   .form-section h2 {
//     color: #d23f72;
//     margin-top: 0;
//     font-size: 1.3em;
//   }
  
//   .required-field {
//     color: #d23f72;
//     font-size: 0.9em;
//     margin-top: -10px;
//     margin-bottom: 15px;
//   }
  
//   .calendar-container {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     margin-bottom: 20px;
//   }
  
//   /* Customize the calendar appearance */
//   .react-calendar {
//     width: 350px;
//     max-width: 100%;
//     border: none;
//     border-radius: 8px;
//     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//   }
  
//   .react-calendar__tile--active {
//     background: #d23f72;
//     color: white;
//   }
  
//   .react-calendar__tile--active:enabled:hover,
//   .react-calendar__tile--active:enabled:focus {
//     background: #b22e5e;
//   }
  
//   .error-calendar {
//     border: 2px solid #ff3860;
//   }
  
//   .selected-date {
//     margin-top: 10px;
//     font-weight: bold;
//     color: #d23f72;
//   }
  
//   .checkbox-container {
//     margin: 15px 0;
//     display: flex;
//     align-items: center;
//   }
  
//   .checkbox-container input[type="checkbox"] {
//     margin-right: 10px;
//     transform: scale(1.2);
//   }
  
//   .duration-container {
//     margin: 15px 0;
//     text-align: center;
//   }
  
//   .duration-container label {
//     display: block;
//     margin-bottom: 8px;
//     font-weight: 500;
//   }
  
//   .duration-container select {
//     padding: 8px 12px;
//     border: 1px solid #ddd;
//     border-radius: 6px;
//     font-size: 1em;
//     background-color: white;
//     cursor: pointer;
//   }
  
//   .error-message {
//     color: #ff3860;
//     font-size: 0.9em;
//     margin-top: 5px;
//   }
  
//   .button-container {
//     display: flex;
//     justify-content: center;
//     margin-top: 30px;
//   }
  
//   .submit-button {
//     background-color: #d23f72;
//     color: white;
//     border: none;
//     border-radius: 30px;
//     padding: 12px 40px;
//     font-size: 1.1em;
//     font-weight: bold;
//     cursor: pointer;
//     transition: background-color 0.3s;
//   }
  
//   .submit-button:hover {
//     background-color: #b22e5e;
//   }
  
//   /* Responsive adjustments */
//   @media (max-width: 600px) {
//     .period-tracker-onboarding {
//       padding: 15px;
//     }
    
//     .form-section {
//       padding: 15px;
//     }
    
//     .react-calendar {
//       width: 300px;
//     }
    
//     .submit-button {
//       width: 100%;
//     }
//   }

// export default PeriodTrackerOnboarding;