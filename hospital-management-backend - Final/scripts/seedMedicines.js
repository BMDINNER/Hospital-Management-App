const connectDB = require('../config/database');
require('../model/index');

const Medicine = require('../model/Medicine');

require('dotenv').config();

/**
 * Medicine Database Seeding Script
 * 
 * Populates the medicine collection with common pharmaceutical products.
 * This data is used for prescription generation in the hospital management system.
 * 
 * @function seedMedicines
 * @async
 * @throws {Error} If database connection or insertion fails
 * 
 * @example
 * // Run from command line:
 * // node scripts/seedMedicines.js
 * // or add to package.json scripts
 * 
 * @note Clears existing medicines before seeding
 * @warning Contains sample data only - verify accuracy for clinical use
 * @see Prescription generation uses this medicine data
 */
const seedMedicines = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    await Medicine.deleteMany({});
    console.log('Cleared existing medicines');

    const medicines = await Medicine.insertMany([
      {
        name: 'Amoxicillin',
        genericName: 'Amoxicillin',
        dosageForms: ['capsule', 'syrup'],
        strengths: ['250mg', '500mg'],
        category: 'antibiotic',
        commonUses: ['Bacterial infections', 'Respiratory infections'],
        sideEffects: ['Nausea', 'Diarrhea', 'Rash'],
        isActive: true
      },
      {
        name: 'Ibuprofen',
        genericName: 'Ibuprofen',
        dosageForms: ['tablet', 'capsule'],
        strengths: ['200mg', '400mg', '600mg'],
        category: 'analgesic',
        commonUses: ['Pain relief', 'Fever reduction', 'Inflammation'],
        sideEffects: ['Stomach upset', 'Heartburn', 'Dizziness'],
        isActive: true
      },
      {
        name: 'Lisinopril',
        genericName: 'Lisinopril',
        dosageForms: ['tablet'],
        strengths: ['5mg', '10mg', '20mg'],
        category: 'cardiovascular',
        commonUses: ['High blood pressure', 'Heart failure'],
        sideEffects: ['Cough', 'Dizziness', 'Headache'],
        isActive: true
      },
      {
        name: 'Metformin',
        genericName: 'Metformin',
        dosageForms: ['tablet'],
        strengths: ['500mg', '850mg', '1000mg'],
        category: 'endocrine',
        commonUses: ['Type 2 diabetes'],
        sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset'],
        isActive: true
      },
      {
        name: 'Atorvastatin',
        genericName: 'Atorvastatin',
        dosageForms: ['tablet'],
        strengths: ['10mg', '20mg', '40mg'],
        category: 'cardiovascular',
        commonUses: ['High cholesterol'],
        sideEffects: ['Muscle pain', 'Headache', 'Nausea'],
        isActive: true
      },
      {
        name: 'Levothyroxine',
        genericName: 'Levothyroxine',
        dosageForms: ['tablet'],
        strengths: ['25mcg', '50mcg', '100mcg'],
        category: 'endocrine',
        commonUses: ['Hypothyroidism'],
        sideEffects: ['Headache', 'Insomnia', 'Increased appetite'],
        isActive: true
      },
      {
        name: 'Albuterol',
        genericName: 'Albuterol',
        dosageForms: ['inhaler'],
        strengths: ['90mcg'],
        category: 'respiratory',
        commonUses: ['Asthma', 'Bronchospasm'],
        sideEffects: ['Nervousness', 'Shaking', 'Headache'],
        isActive: true
      },
      {
        name: 'Omeprazole',
        genericName: 'Omeprazole',
        dosageForms: ['capsule'],
        strengths: ['20mg', '40mg'],
        category: 'gastrointestinal',
        commonUses: ['Acid reflux', 'Ulcers'],
        sideEffects: ['Headache', 'Diarrhea', 'Stomach pain'],
        isActive: true
      },
      {
        name: 'Sertraline',
        genericName: 'Sertraline',
        dosageForms: ['tablet'],
        strengths: ['25mg', '50mg', '100mg'],
        category: 'other',
        commonUses: ['Depression', 'Anxiety'],
        sideEffects: ['Nausea', 'Insomnia', 'Dry mouth'],
        isActive: true
      },
      {
        name: 'Simvastatin',
        genericName: 'Simvastatin',
        dosageForms: ['tablet'],
        strengths: ['10mg', '20mg', '40mg'],
        category: 'cardiovascular',
        commonUses: ['High cholesterol'],
        sideEffects: ['Headache', 'Nausea', 'Muscle pain'],
        isActive: true
      },
      {
        name: 'Losartan',
        genericName: 'Losartan',
        dosageForms: ['tablet'],
        strengths: ['25mg', '50mg', '100mg'],
        category: 'cardiovascular',
        commonUses: ['High blood pressure'],
        sideEffects: ['Dizziness', 'Back pain', 'Low blood pressure'],
        isActive: true
      },
      {
        name: 'Gabapentin',
        genericName: 'Gabapentin',
        dosageForms: ['capsule'],
        strengths: ['100mg', '300mg', '400mg'],
        category: 'analgesic',
        commonUses: ['Nerve pain', 'Seizures'],
        sideEffects: ['Dizziness', 'Fatigue', 'Swelling'],
        isActive: true
      },
      {
        name: 'Hydrochlorothiazide',
        genericName: 'Hydrochlorothiazide',
        dosageForms: ['tablet'],
        strengths: ['12.5mg', '25mg'],
        category: 'cardiovascular',
        commonUses: ['High blood pressure', 'Edema'],
        sideEffects: ['Dizziness', 'Low potassium', 'Increased urination'],
        isActive: true
      },
      {
        name: 'Metoprolol',
        genericName: 'Metoprolol',
        dosageForms: ['tablet'],
        strengths: ['25mg', '50mg', '100mg'],
        category: 'cardiovascular',
        commonUses: ['High blood pressure', 'Angina'],
        sideEffects: ['Tiredness', 'Dizziness', 'Slow heart rate'],
        isActive: true
      },
      {
        name: 'Pantoprazole',
        genericName: 'Pantoprazole',
        dosageForms: ['tablet'],
        strengths: ['20mg', '40mg'],
        category: 'gastrointestinal',
        commonUses: ['Acid reflux', 'GERD'],
        sideEffects: ['Headache', 'Diarrhea', 'Nausea'],
        isActive: true
      },
      {
        name: 'Amlodipine',
        genericName: 'Amlodipine',
        dosageForms: ['tablet'],
        strengths: ['5mg', '10mg'],
        category: 'cardiovascular',
        commonUses: ['High blood pressure', 'Angina'],
        sideEffects: ['Swelling', 'Headache', 'Dizziness'],
        isActive: true
      },
      {
        name: 'Fluoxetine',
        genericName: 'Fluoxetine',
        dosageForms: ['capsule'],
        strengths: ['10mg', '20mg', '40mg'],
        category: 'other',
        commonUses: ['Depression', 'OCD'],
        sideEffects: ['Nausea', 'Headache', 'Insomnia'],
        isActive: true
      },
      {
        name: 'Tramadol',
        genericName: 'Tramadol',
        dosageForms: ['tablet'],
        strengths: ['50mg'],
        category: 'analgesic',
        commonUses: ['Moderate to severe pain'],
        sideEffects: ['Nausea', 'Dizziness', 'Constipation'],
        isActive: true
      },
      {
        name: 'Citalopram',
        genericName: 'Citalopram',
        dosageForms: ['tablet'],
        strengths: ['10mg', '20mg', '40mg'],
        category: 'other',
        commonUses: ['Depression'],
        sideEffects: ['Nausea', 'Dry mouth', 'Drowsiness'],
        isActive: true
      },
      {
        name: 'Warfarin',
        genericName: 'Warfarin',
        dosageForms: ['tablet'],
        strengths: ['1mg', '2mg', '5mg'],
        category: 'cardiovascular',
        commonUses: ['Blood clots', 'Stroke prevention'],
        sideEffects: ['Bleeding', 'Bruising', 'Hair loss'],
        isActive: true
      },
      {
        name: 'Prednisone',
        genericName: 'Prednisone',
        dosageForms: ['tablet'],
        strengths: ['5mg', '10mg', '20mg'],
        category: 'anti-inflammatory',
        commonUses: ['Inflammation', 'Allergies'],
        sideEffects: ['Increased appetite', 'Insomnia', 'Mood changes'],
        isActive: true
      },
      {
        name: 'Diazepam',
        genericName: 'Diazepam',
        dosageForms: ['tablet'],
        strengths: ['2mg', '5mg', '10mg'],
        category: 'other',
        commonUses: ['Anxiety', 'Muscle spasms'],
        sideEffects: ['Drowsiness', 'Dizziness', 'Fatigue'],
        isActive: true
      },
      {
        name: 'Furosemide',
        genericName: 'Furosemide',
        dosageForms: ['tablet'],
        strengths: ['20mg', '40mg'],
        category: 'cardiovascular',
        commonUses: ['Edema', 'High blood pressure'],
        sideEffects: ['Dehydration', 'Dizziness', 'Low potassium'],
        isActive: true
      },
      {
        name: 'Clonazepam',
        genericName: 'Clonazepam',
        dosageForms: ['tablet'],
        strengths: ['0.5mg', '1mg', '2mg'],
        category: 'other',
        commonUses: ['Seizures', 'Panic attacks'],
        sideEffects: ['Drowsiness', 'Dizziness', 'Coordination problems'],
        isActive: true
      },
      {
        name: 'Cephalexin',
        genericName: 'Cephalexin',
        dosageForms: ['capsule'],
        strengths: ['250mg', '500mg'],
        category: 'antibiotic',
        commonUses: ['Bacterial infections'],
        sideEffects: ['Diarrhea', 'Nausea', 'Stomach pain'],
        isActive: true
      },
      {
        name: 'Tamsulosin',
        genericName: 'Tamsulosin',
        dosageForms: ['capsule'],
        strengths: ['0.4mg'],
        category: 'other',
        commonUses: ['Enlarged prostate'],
        sideEffects: ['Dizziness', 'Abnormal ejaculation', 'Headache'],
        isActive: true
      },
      {
        name: 'Allopurinol',
        genericName: 'Allopurinol',
        dosageForms: ['tablet'],
        strengths: ['100mg', '300mg'],
        category: 'other',
        commonUses: ['Gout'],
        sideEffects: ['Rash', 'Nausea', 'Liver problems'],
        isActive: true
      },
      {
        name: 'Spironolactone',
        genericName: 'Spironolactone',
        dosageForms: ['tablet'],
        strengths: ['25mg', '50mg', '100mg'],
        category: 'cardiovascular',
        commonUses: ['High blood pressure', 'Edema'],
        sideEffects: ['High potassium', 'Breast tenderness', 'Dizziness'],
        isActive: true
      },
      {
        name: 'Montelukast',
        genericName: 'Montelukast',
        dosageForms: ['tablet'],
        strengths: ['10mg'],
        category: 'respiratory',
        commonUses: ['Asthma', 'Allergies'],
        sideEffects: ['Headache', 'Stomach pain', 'Dizziness'],
        isActive: true
      },
      {
        name: 'Vitamin D3',
        genericName: 'Cholecalciferol',
        dosageForms: ['capsule'],
        strengths: ['1000IU', '2000IU', '5000IU'],
        category: 'vitamin',
        commonUses: ['Vitamin D deficiency'],
        sideEffects: ['Nausea', 'Constipation', 'Weakness'],
        isActive: true
      }
    ]);

    console.log(`${medicines.length} medicines created`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding medicines:', err);
    process.exit(1);
  }
};

seedMedicines();