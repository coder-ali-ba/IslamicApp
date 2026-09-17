export type CourseLesson = {
  id: string;
  title: string;
  duration: string;
};

export type CourseDetails = {
  whatYouLearn: string[];
  requirements: string[];
  curriculum: CourseLesson[];
};

export const courseDetails: Record<string, CourseDetails> = {
  "quran-reading": {
    whatYouLearn: [
      "Learn Arabic letters and their correct pronunciation",
      "Read Quranic words and sentences confidently",
      "Understand basic Quran reading rules",
      "Improve fluency through guided practice",
      "Build a consistent Quran reading routine",
    ],
    requirements: [
      "No previous Quran reading experience required",
      "A willingness to practice regularly",
      "Basic understanding of Arabic letters is helpful but not required",
    ],
    curriculum: [
      {
        id: "1",
        title: "Introduction to Quran Reading",
        duration: "18 min",
      },
      {
        id: "2",
        title: "Arabic Letters & Pronunciation",
        duration: "32 min",
      },
      {
        id: "3",
        title: "Connecting Arabic Letters",
        duration: "28 min",
      },
      {
        id: "4",
        title: "Reading Basic Quranic Words",
        duration: "35 min",
      },
      {
        id: "5",
        title: "Common Reading Rules",
        duration: "31 min",
      },
      {
        id: "6",
        title: "Practice with Short Surahs",
        duration: "42 min",
      },
      {
        id: "7",
        title: "Improving Reading Fluency",
        duration: "36 min",
      },
      {
        id: "8",
        title: "Final Reading Practice",
        duration: "40 min",
      },
    ],
  },

  "quran-tajweed": {
    whatYouLearn: [
      "Understand the fundamental rules of Tajweed",
      "Improve pronunciation of Quranic letters",
      "Learn rules of Noon Sakinah and Tanween",
      "Understand Meem Sakinah and Qalqalah",
      "Apply Tajweed rules while reciting Quran",
    ],
    requirements: [
      "Ability to read the Quran at a basic level",
      "Commitment to regular practice",
    ],
    curriculum: [
      {
        id: "1",
        title: "Introduction to Tajweed",
        duration: "24 min",
      },
      {
        id: "2",
        title: "Makharij al-Huruf",
        duration: "38 min",
      },
      {
        id: "3",
        title: "Noon Sakinah & Tanween",
        duration: "35 min",
      },
      {
        id: "4",
        title: "Meem Sakinah",
        duration: "29 min",
      },
      {
        id: "5",
        title: "Qalqalah Rules",
        duration: "27 min",
      },
      {
        id: "6",
        title: "Madd & Its Types",
        duration: "34 min",
      },
      {
        id: "7",
        title: "Waqf & Ibtida",
        duration: "31 min",
      },
      {
        id: "8",
        title: "Practical Tajweed Recitation",
        duration: "45 min",
      },
    ],
  },

  "understanding-hadith": {
    whatYouLearn: [
      "Understand the role of Hadith in Islam",
      "Learn how major Hadith collections are organized",
      "Understand basic Hadith terminology",
      "Explore selected authentic narrations",
      "Develop a practical connection with the Sunnah",
    ],
    requirements: [
      "No advanced Islamic studies required",
      "Basic familiarity with Islamic teachings",
    ],
    curriculum: [
      {
        id: "1",
        title: "Introduction to Hadith",
        duration: "25 min",
      },
      {
        id: "2",
        title: "Hadith & Sunnah",
        duration: "30 min",
      },
      {
        id: "3",
        title: "Understanding Hadith Terminology",
        duration: "34 min",
      },
      {
        id: "4",
        title: "Major Hadith Collections",
        duration: "28 min",
      },
      {
        id: "5",
        title: "Understanding Authenticity",
        duration: "36 min",
      },
      {
        id: "6",
        title: "Selected Prophetic Teachings",
        duration: "40 min",
      },
    ],
  },

  "arabic-basics": {
    whatYouLearn: [
      "Learn essential Arabic vocabulary",
      "Understand basic Arabic sentence structure",
      "Build everyday Islamic vocabulary",
      "Read and understand simple Arabic sentences",
      "Develop a foundation for further Arabic study",
    ],
    requirements: [
      "No previous Arabic knowledge required",
      "Regular vocabulary practice is recommended",
    ],
    curriculum: [
      {
        id: "1",
        title: "Introduction to Arabic",
        duration: "22 min",
      },
      {
        id: "2",
        title: "Arabic Alphabet Review",
        duration: "30 min",
      },
      {
        id: "3",
        title: "Essential Vocabulary",
        duration: "35 min",
      },
      {
        id: "4",
        title: "Nouns & Pronouns",
        duration: "32 min",
      },
      {
        id: "5",
        title: "Basic Sentence Structure",
        duration: "38 min",
      },
      {
        id: "6",
        title: "Common Verbs",
        duration: "36 min",
      },
      {
        id: "7",
        title: "Reading Simple Arabic",
        duration: "40 min",
      },
      {
        id: "8",
        title: "Practical Arabic Exercises",
        duration: "35 min",
      },
    ],
  },

  "daily-fiqh": {
    whatYouLearn: [
      "Understand essential everyday Fiqh topics",
      "Learn about purification and prayer",
      "Understand basic fasting rules",
      "Learn practical Islamic guidelines",
      "Build confidence in everyday religious practice",
    ],
    requirements: [
      "No previous Fiqh studies required",
      "Basic knowledge of Islamic practices",
    ],
    curriculum: [
      {
        id: "1",
        title: "Introduction to Fiqh",
        duration: "25 min",
      },
      {
        id: "2",
        title: "Purification",
        duration: "38 min",
      },
      {
        id: "3",
        title: "Prayer",
        duration: "42 min",
      },
      {
        id: "4",
        title: "Fasting",
        duration: "35 min",
      },
      {
        id: "5",
        title: "Zakat Basics",
        duration: "30 min",
      },
      {
        id: "6",
        title: "Everyday Islamic Matters",
        duration: "40 min",
      },
    ],
  },

  "seerah-prophet": {
    whatYouLearn: [
      "Explore the life of Prophet Muhammad ﷺ",
      "Understand major events from the Prophetic biography",
      "Learn lessons from the Makkan period",
      "Study the Madinan period",
      "Discover practical lessons from the Seerah",
    ],
    requirements: [
      "No previous Seerah studies required",
      "Interest in learning about the life of the Prophet ﷺ",
    ],
    curriculum: [
      {
        id: "1",
        title: "Introduction to the Seerah",
        duration: "28 min",
      },
      {
        id: "2",
        title: "Early Life of the Prophet ﷺ",
        duration: "35 min",
      },
      {
        id: "3",
        title: "Beginning of Revelation",
        duration: "40 min",
      },
      {
        id: "4",
        title: "The Makkan Period",
        duration: "42 min",
      },
      {
        id: "5",
        title: "The Hijrah",
        duration: "36 min",
      },
      {
        id: "6",
        title: "Life in Madinah",
        duration: "44 min",
      },
      {
        id: "7",
        title: "Major Events & Lessons",
        duration: "40 min",
      },
      {
        id: "8",
        title: "The Final Years",
        duration: "35 min",
      },
    ],
  },

  "islamic-foundations": {
    whatYouLearn: [
      "Understand the fundamental concepts of Islam",
      "Learn the five pillars of Islam",
      "Understand basic Islamic beliefs",
      "Explore worship and everyday practice",
      "Build a strong foundation for further learning",
    ],
    requirements: [
      "No previous Islamic studies required",
      "Open to beginners",
    ],
    curriculum: [
      {
        id: "1",
        title: "What is Islam?",
        duration: "25 min",
      },
      {
        id: "2",
        title: "Articles of Faith",
        duration: "34 min",
      },
      {
        id: "3",
        title: "The Five Pillars",
        duration: "38 min",
      },
      {
        id: "4",
        title: "Prayer & Worship",
        duration: "35 min",
      },
      {
        id: "5",
        title: "Character & Conduct",
        duration: "32 min",
      },
      {
        id: "6",
        title: "Living Islam",
        duration: "40 min",
      },
    ],
  },

  "advanced-tafsir": {
    whatYouLearn: [
      "Understand the purpose and methodology of Tafsir",
      "Explore classical and contemporary approaches",
      "Study selected Quranic passages in depth",
      "Understand context and linguistic considerations",
      "Develop a structured approach to Quranic study",
    ],
    requirements: [
      "Basic familiarity with Quranic Arabic is recommended",
      "Previous exposure to Islamic studies is helpful",
    ],
    curriculum: [
      {
        id: "1",
        title: "Introduction to Tafsir",
        duration: "30 min",
      },
      {
        id: "2",
        title: "Sources of Tafsir",
        duration: "38 min",
      },
      {
        id: "3",
        title: "Classical Tafsir Methodology",
        duration: "42 min",
      },
      {
        id: "4",
        title: "Understanding Context",
        duration: "35 min",
      },
      {
        id: "5",
        title: "Linguistic Analysis",
        duration: "44 min",
      },
      {
        id: "6",
        title: "Practical Tafsir Study",
        duration: "48 min",
      },
    ],
  },
};