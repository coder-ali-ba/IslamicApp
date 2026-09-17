export type ClassDetails = {
  whatYouWillLearn: string[];
  topics: string[];
  requirements: string[];
};

export const classDetails: Record<string, ClassDetails> = {
  "quran-reading-live": {
    whatYouWillLearn: [
      "Improve Quran reading fluency",
      "Correct common Arabic pronunciation mistakes",
      "Learn proper letter articulation",
      "Practice reading selected Quranic verses",
      "Get live feedback from the instructor",
    ],
    topics: [
      "Arabic letters and pronunciation",
      "Connecting Arabic letters",
      "Basic reading rules",
      "Common reading mistakes",
      "Practical Quran reading",
    ],
    requirements: [
      "Basic knowledge of Arabic letters",
      "Quran or Quran reading material",
      "Stable internet connection",
    ],
  },

  "tajweed-live-session": {
    whatYouWillLearn: [
      "Improve your Tajweed pronunciation",
      "Identify and correct common Tajweed mistakes",
      "Understand important rules of Quran recitation",
      "Practice verses with instructor feedback",
      "Build confidence in Quran recitation",
    ],
    topics: [
      "Makharij al-Huruf",
      "Noon Saakin and Tanween",
      "Meem Saakin",
      "Madd rules",
      "Qalqalah",
      "Practical Tajweed correction",
    ],
    requirements: [
      "Ability to read the Quran",
      "Basic understanding of Arabic letters",
      "Quran with Tajweed markings",
    ],
  },

  "arabic-speaking-class": {
    whatYouWillLearn: [
      "Build confidence in spoken Arabic",
      "Learn useful everyday expressions",
      "Practice basic conversations",
      "Improve Arabic vocabulary",
      "Interact with the instructor through speaking exercises",
    ],
    topics: [
      "Daily greetings and introductions",
      "Everyday Arabic vocabulary",
      "Basic questions and answers",
      "Simple conversations",
      "Common Arabic expressions",
    ],
    requirements: [
      "Basic Arabic alphabet knowledge",
      "Willingness to participate",
      "Notebook for vocabulary practice",
    ],
  },

  "hadith-study-circle": {
    whatYouWillLearn: [
      "Understand selected authentic Ahadith",
      "Learn the context and meaning of narrations",
      "Explore practical lessons from Hadith",
      "Ask questions during the live session",
      "Connect Hadith teachings with daily life",
    ],
    topics: [
      "Introduction to Hadith",
      "Understanding Hadith terminology",
      "Selected authentic narrations",
      "Lessons and practical guidance",
      "Questions and discussion",
    ],
    requirements: [
      "Basic Islamic knowledge",
      "Hadith reading material if available",
      "Willingness to participate in discussion",
    ],
  },

  "fiqh-for-everyday-life": {
    whatYouWillLearn: [
      "Understand common everyday Fiqh matters",
      "Learn practical Islamic rulings",
      "Understand basic principles of Fiqh",
      "Ask questions about everyday situations",
      "Apply Islamic guidance in daily life",
    ],
    topics: [
      "Purification",
      "Prayer-related matters",
      "Fasting basics",
      "Daily transactions",
      "Common everyday questions",
    ],
    requirements: [
      "Basic Islamic knowledge",
      "Notebook for important points",
      "Questions you would like to discuss",
    ],
  },

  "advanced-tajweed-workshop": {
    whatYouWillLearn: [
      "Improve advanced Quran recitation",
      "Refine pronunciation and articulation",
      "Practice advanced Tajweed rules",
      "Identify subtle recitation mistakes",
      "Receive detailed instructor feedback",
    ],
    topics: [
      "Advanced Makharij",
      "Advanced Madd rules",
      "Rules of stopping and starting",
      "Detailed pronunciation correction",
      "Advanced recitation practice",
    ],
    requirements: [
      "Strong Quran reading ability",
      "Basic to intermediate Tajweed knowledge",
      "Quran with Tajweed markings",
    ],
  },
};