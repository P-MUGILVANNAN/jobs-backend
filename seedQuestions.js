const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Question = require("./models/Question");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected for Seeding"))
  .catch(err => console.log("❌ DB Error:", err));

const questions = [
  // General Knowledge Questions (25 questions)
  {
    question: "Which company developed Java?",
    options: ["Sun Microsystems", "Microsoft", "IBM", "Google"],
    correctAnswer: "Sun Microsystems"
  },
  {
    question: "Which HTML tag is used to define an internal style sheet?",
    options: ["<script>", "<style>", "<css>", "<link>"],
    correctAnswer: "<style>"
  },
  {
    question: "Which protocol is used by the web?",
    options: ["HTTP", "FTP", "SMTP", "SNMP"],
    correctAnswer: "HTTP"
  },
  {
    question: "What does CPU stand for?",
    options: ["Central Processing Unit", "Computer Personal Unit", "Central Processor Unit", "Central Process Unit"],
    correctAnswer: "Central Processing Unit"
  },
  {
    question: "Which of these is not a programming language?",
    options: ["Python", "Java", "HTML", "C++"],
    correctAnswer: "HTML"
  },
  {
    question: "What does URL stand for?",
    options: ["Uniform Resource Locator", "Universal Resource Locator", "Uniform Resource Link", "Universal Resource Link"],
    correctAnswer: "Uniform Resource Locator"
  },
  {
    question: "Which company developed the Windows operating system?",
    options: ["Microsoft", "Apple", "IBM", "Google"],
    correctAnswer: "Microsoft"
  },
  {
    question: "What does RAM stand for?",
    options: ["Random Access Memory", "Read Access Memory", "Random Available Memory", "Read Available Memory"],
    correctAnswer: "Random Access Memory"
  },
  {
    question: "Which of these is a database management system?",
    options: ["MySQL", "Java", "Python", "HTML"],
    correctAnswer: "MySQL"
  },
  {
    question: "What does VPN stand for?",
    options: ["Virtual Private Network", "Virtual Public Network", "Verified Private Network", "Virtual Personal Network"],
    correctAnswer: "Virtual Private Network"
  },
  {
    question: "Which programming language is known as the 'language of the web'?",
    options: ["JavaScript", "Python", "Java", "C#"],
    correctAnswer: "JavaScript"
  },
  {
    question: "What does API stand for?",
    options: ["Application Programming Interface", "Application Program Interface", "Advanced Programming Interface", "Application Process Interface"],
    correctAnswer: "Application Programming Interface"
  },
  {
    question: "Which company owns Android operating system?",
    options: ["Google", "Microsoft", "Apple", "Samsung"],
    correctAnswer: "Google"
  },
  {
    question: "What does SSD stand for in computing?",
    options: ["Solid State Drive", "Super Speed Drive", "Solid Storage Device", "Super Storage Device"],
    correctAnswer: "Solid State Drive"
  },
  {
    question: "Which of these is a version control system?",
    options: ["Git", "Java", "Python", "MySQL"],
    correctAnswer: "Git"
  },
  {
    question: "What does IoT stand for?",
    options: ["Internet of Things", "Internet of Technology", "Interface of Things", "Internet of Thinking"],
    correctAnswer: "Internet of Things"
  },
  {
    question: "Which protocol is used for secure web browsing?",
    options: ["HTTPS", "HTTP", "FTP", "SMTP"],
    correctAnswer: "HTTPS"
  },
  {
    question: "What does CSS stand for?",
    options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
    correctAnswer: "Cascading Style Sheets"
  },
  {
    question: "Which company developed the React library?",
    options: ["Facebook", "Google", "Microsoft", "Apple"],
    correctAnswer: "Facebook"
  },
  {
    question: "What does SQL stand for?",
    options: ["Structured Query Language", "Simple Query Language", "Sequential Query Language", "Structured Question Language"],
    correctAnswer: "Structured Query Language"
  },
  {
    question: "Which of these is a NoSQL database?",
    options: ["MongoDB", "MySQL", "PostgreSQL", "SQLite"],
    correctAnswer: "MongoDB"
  },
  {
    question: "What does OS stand for?",
    options: ["Operating System", "Operating Software", "Office System", "Online System"],
    correctAnswer: "Operating System"
  },
  {
    question: "Which programming language is used for Android app development?",
    options: ["Kotlin", "Swift", "C#", "PHP"],
    correctAnswer: "Kotlin"
  },
  {
    question: "What does XML stand for?",
    options: ["eXtensible Markup Language", "Example Markup Language", "Extra Markup Language", "Extended Markup Language"],
    correctAnswer: "eXtensible Markup Language"
  },
  {
    question: "Which company developed the Python programming language?",
    options: ["Not specific company - by Guido van Rossum", "Google", "Microsoft", "IBM"],
    correctAnswer: "Not specific company - by Guido van Rossum"
  },

  // Technical Aptitude Questions (25 questions)
  {
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
    correctAnswer: "O(log n)"
  },
  {
    question: "Which data structure uses LIFO (Last In First Out) principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: "Stack"
  },
  {
    question: "What is the time complexity of accessing an element in an array by index?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
    correctAnswer: "O(1)"
  },
  {
    question: "Which sorting algorithm has the worst-case time complexity of O(n^2)?",
    options: ["Bubble Sort", "Merge Sort", "Quick Sort", "Heap Sort"],
    correctAnswer: "Bubble Sort"
  },
  {
    question: "What does DNS stand for?",
    options: ["Domain Name System", "Domain Network System", "Digital Name System", "Domain Name Server"],
    correctAnswer: "Domain Name System"
  },
  {
    question: "Which of these is not a JavaScript framework?",
    options: ["Django", "React", "Angular", "Vue"],
    correctAnswer: "Django"
  },
  {
    question: "What is the default port for HTTP?",
    options: ["80", "443", "8080", "21"],
    correctAnswer: "80"
  },
  {
    question: "Which data structure is used for implementing recursion?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    correctAnswer: "Stack"
  },
  {
    question: "What does MVC stand for in software architecture?",
    options: ["Model View Controller", "Model View Component", "Main View Controller", "Model Visual Controller"],
    correctAnswer: "Model View Controller"
  },
  {
    question: "Which protocol is used for sending emails?",
    options: ["SMTP", "HTTP", "FTP", "TCP"],
    correctAnswer: "SMTP"
  },
  {
    question: "What is the time complexity of merge sort?",
    options: ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"],
    correctAnswer: "O(n log n)"
  },
  {
    question: "Which of these is a relational database?",
    options: ["MySQL", "MongoDB", "Redis", "Cassandra"],
    correctAnswer: "MySQL"
  },
  {
    question: "What does JSON stand for?",
    options: ["JavaScript Object Notation", "JavaScript Object Network", "Java Object Notation", "JavaScript Online Notation"],
    correctAnswer: "JavaScript Object Notation"
  },
  {
    question: "Which data structure uses FIFO (First In First Out) principle?",
    options: ["Queue", "Stack", "Array", "Tree"],
    correctAnswer: "Queue"
  },
  {
    question: "What is the main purpose of an index in a database?",
    options: ["To improve query performance", "To store data", "To backup data", "To encrypt data"],
    correctAnswer: "To improve query performance"
  },
  {
    question: "Which of these is not a primitive data type in JavaScript?",
    options: ["Array", "String", "Number", "Boolean"],
    correctAnswer: "Array"
  },
  {
    question: "What does REST stand for in API development?",
    options: ["Representational State Transfer", "Remote State Transfer", "Representational System Transfer", "Remote System Transfer"],
    correctAnswer: "Representational State Transfer"
  },
  {
    question: "Which algorithm is used for shortest path finding?",
    options: ["Dijkstra's Algorithm", "Bubble Sort", "Binary Search", "Quick Sort"],
    correctAnswer: "Dijkstra's Algorithm"
  },
  {
    question: "What is the purpose of a foreign key in a database?",
    options: ["To establish relationship between tables", "To uniquely identify records", "To improve performance", "To encrypt data"],
    correctAnswer: "To establish relationship between tables"
  },
  {
    question: "Which of these is a compiled language?",
    options: ["C++", "Python", "JavaScript", "PHP"],
    correctAnswer: "C++"
  },
  {
    question: "What does CRUD stand for in database operations?",
    options: ["Create Read Update Delete", "Create Retrieve Update Delete", "Create Read Upload Delete", "Create Read Update Destroy"],
    correctAnswer: "Create Read Update Delete"
  },
  {
    question: "Which protocol is used for file transfer?",
    options: ["FTP", "HTTP", "SMTP", "TCP"],
    correctAnswer: "FTP"
  },
  {
    question: "What is the time complexity of linear search?",
    options: ["O(n)", "O(1)", "O(log n)", "O(n^2)"],
    correctAnswer: "O(n)"
  },
  {
    question: "Which of these is a non-linear data structure?",
    options: ["Tree", "Array", "Linked List", "Stack"],
    correctAnswer: "Tree"
  },
  {
    question: "What does IDE stand for?",
    options: ["Integrated Development Environment", "Integrated Development Engine", "International Development Environment", "Integrated Design Environment"],
    correctAnswer: "Integrated Development Environment"
  },

  // HR Aptitude Questions (25 questions)
  {
    question: "Which of the following is an example of intrinsic motivation?",
    options: ["Salary increase", "Recognition", "Personal growth", "Job security"],
    correctAnswer: "Personal growth"
  },
  {
    question: "What does HRM stand for?",
    options: ["Human Resource Management", "Human Resource Module", "Human Resource Method", "Human Resource Model"],
    correctAnswer: "Human Resource Management"
  },
  {
    question: "Which of the following is a function of HRM?",
    options: ["Recruitment", "Training and Development", "Performance Appraisal", "All of the above"],
    correctAnswer: "All of the above"
  },
  {
    question: "What is the first step in the recruitment process?",
    options: ["Job analysis", "Interview", "Selection", "Training"],
    correctAnswer: "Job analysis"
  },
  {
    question: "Which type of interview involves multiple interviewers?",
    options: ["Panel interview", "Group interview", "Stress interview", "Structured interview"],
    correctAnswer: "Panel interview"
  },
  {
    question: "What does KPI stand for in performance management?",
    options: ["Key Performance Indicator", "Key Process Indicator", "Key Performance Index", "Key Process Index"],
    correctAnswer: "Key Performance Indicator"
  },
  {
    question: "Which of these is a type of organizational structure?",
    options: ["Functional", "Geographical", "Matrix", "All of the above"],
    correctAnswer: "All of the above"
  },
  {
    question: "What is the purpose of a 360-degree feedback?",
    options: ["Comprehensive performance evaluation", "Salary determination", "Promotion decision", "Training needs analysis"],
    correctAnswer: "Comprehensive performance evaluation"
  },
  {
    question: "Which theory is associated with Maslow's Hierarchy of Needs?",
    options: ["Motivation theory", "Leadership theory", "Communication theory", "Learning theory"],
    correctAnswer: "Motivation theory"
  },
  {
    question: "What does SWOT analysis stand for?",
    options: ["Strengths, Weaknesses, Opportunities, Threats", "Strengths, Weaknesses, Objectives, Threats", "Strengths, Weaknesses, Opportunities, Tasks", "Strengths, Weaknesses, Objectives, Tasks"],
    correctAnswer: "Strengths, Weaknesses, Opportunities, Threats"
  },
  {
    question: "Which of these is a type of leadership style?",
    options: ["Autocratic", "Democratic", "Laissez-faire", "All of the above"],
    correctAnswer: "All of the above"
  },
  {
    question: "What is the main purpose of performance appraisal?",
    options: ["Employee development and evaluation", "Salary reduction", "Employee termination", "Workload increase"],
    correctAnswer: "Employee development and evaluation"
  },
  {
    question: "Which of these is a method of training?",
    options: ["On-the-job training", "Classroom training", "E-learning", "All of the above"],
    correctAnswer: "All of the above"
  },
  {
    question: "What does ROI stand for in HR context?",
    options: ["Return on Investment", "Return on Innovation", "Rate of Investment", "Return on Intelligence"],
    correctAnswer: "Return on Investment"
  },
  {
    question: "Which of these is a type of conflict resolution strategy?",
    options: ["Collaboration", "Avoidance", "Compromise", "All of the above"],
    correctAnswer: "All of the above"
  },
  {
    question: "What is the purpose of job description?",
    options: ["To outline job responsibilities and requirements", "To set salary", "To determine working hours", "To assign tasks"],
    correctAnswer: "To outline job responsibilities and requirements"
  },
  {
    question: "Which of these is a type of organizational culture?",
    options: ["Clan culture", "Adhocracy culture", "Market culture", "All of the above"],
    correctAnswer: "All of the above"
  },
  {
    question: "What does FMLA stand for?",
    options: ["Family and Medical Leave Act", "Family and Medical Labor Act", "Federal Medical Leave Act", "Family Medical Labor Act"],
    correctAnswer: "Family and Medical Leave Act"
  },
  {
    question: "Which of these is a method of employee engagement?",
    options: ["Regular feedback", "Career development opportunities", "Work-life balance", "All of the above"],
    correctAnswer: "All of the above"
  },
  {
    question: "What is the main purpose of succession planning?",
    options: ["To identify and develop future leaders", "To reduce workforce", "To increase salaries", "To change organizational structure"],
    correctAnswer: "To identify and develop future leaders"
  },
  {
    question: "Which of these is a type of compensation?",
    options: ["Base salary", "Bonuses", "Benefits", "All of the above"],
    correctAnswer: "All of the above"
  },
  {
    question: "What does EEO stand for?",
    options: ["Equal Employment Opportunity", "Equal Employment Organization", "Employee Employment Opportunity", "Equal Employee Opportunity"],
    correctAnswer: "Equal Employment Opportunity"
  },
  {
    question: "Which of these is a stage in the employee life cycle?",
    options: ["Recruitment", "Onboarding", "Development", "All of the above"],
    correctAnswer: "All of the above"
  },
  {
    question: "What is the purpose of exit interview?",
    options: ["To understand reasons for employee departure", "To finalize salary", "To complete paperwork", "To assign new tasks"],
    correctAnswer: "To understand reasons for employee departure"
  },
  {
    question: "Which of these is a type of workplace diversity?",
    options: ["Gender diversity", "Cultural diversity", "Age diversity", "All of the above"],
    correctAnswer: "All of the above"
  },

  // Aptitude Questions (25 questions)
  {
    question: "If a train travels 300 km in 5 hours, what is its speed?",
    options: ["60 km/h", "50 km/h", "65 km/h", "55 km/h"],
    correctAnswer: "60 km/h"
  },
  {
    question: "What is 25% of 200?",
    options: ["50", "25", "100", "75"],
    correctAnswer: "50"
  },
  {
    question: "If x = 3 and y = 4, what is the value of 2x + 3y?",
    options: ["18", "17", "19", "20"],
    correctAnswer: "18"
  },
  {
    question: "A shop offers 20% discount on a $50 item. What is the final price?",
    options: ["$40", "$45", "$35", "$30"],
    correctAnswer: "$40"
  },
  {
    question: "What is the next number in the sequence: 2, 4, 8, 16, ...?",
    options: ["32", "24", "20", "30"],
    correctAnswer: "32"
  },
  {
    question: "If 5 workers complete a task in 10 days, how many days will 10 workers take?",
    options: ["5 days", "10 days", "15 days", "20 days"],
    correctAnswer: "5 days"
  },
  {
    question: "What is the average of 10, 20, 30, 40, and 50?",
    options: ["30", "25", "35", "40"],
    correctAnswer: "30"
  },
  {
    question: "If a rectangle has length 8 cm and width 5 cm, what is its area?",
    options: ["40 cm²", "35 cm²", "45 cm²", "50 cm²"],
    correctAnswer: "40 cm²"
  },
  {
    question: "What is 15% of 500?",
    options: ["75", "50", "100", "25"],
    correctAnswer: "75"
  },
  {
    question: "If 3x - 7 = 14, what is the value of x?",
    options: ["7", "8", "9", "10"],
    correctAnswer: "7"
  },
  {
    question: "A car travels 240 km in 4 hours. What is its average speed?",
    options: ["60 km/h", "50 km/h", "70 km/h", "80 km/h"],
    correctAnswer: "60 km/h"
  },
  {
    question: "What is the square root of 144?",
    options: ["12", "14", "16", "18"],
    correctAnswer: "12"
  },
  {
    question: "If 20% of a number is 50, what is the number?",
    options: ["250", "200", "300", "350"],
    correctAnswer: "250"
  },
  {
    question: "What is the next number in the sequence: 1, 4, 9, 16, 25, ...?",
    options: ["36", "30", "35", "40"],
    correctAnswer: "36"
  },
  {
    question: "If a product costs $80 after 20% discount, what was its original price?",
    options: ["$100", "$90", "$110", "$120"],
    correctAnswer: "$100"
  },
  {
    question: "What is 3/4 of 200?",
    options: ["150", "100", "175", "125"],
    correctAnswer: "150"
  },
  {
    question: "If 2x + 5 = 17, what is the value of x?",
    options: ["6", "7", "8", "9"],
    correctAnswer: "6"
  },
  {
    question: "A triangle has base 10 cm and height 6 cm. What is its area?",
    options: ["30 cm²", "25 cm²", "35 cm²", "40 cm²"],
    correctAnswer: "30 cm²"
  },
  {
    question: "What is 12.5% of 400?",
    options: ["50", "75", "100", "25"],
    correctAnswer: "50"
  },
  {
    question: "If 8 workers can build a wall in 6 days, how many days will 12 workers take?",
    options: ["4 days", "5 days", "6 days", "7 days"],
    correctAnswer: "4 days"
  },
  {
    question: "What is the average of first 10 natural numbers?",
    options: ["5.5", "6", "5", "4.5"],
    correctAnswer: "5.5"
  },
  {
    question: "If 40% of a number is 120, what is the number?",
    options: ["300", "250", "350", "400"],
    correctAnswer: "300"
  },
  {
    question: "What is the next number in the sequence: 5, 10, 20, 40, ...?",
    options: ["80", "60", "70", "90"],
    correctAnswer: "80"
  },
  {
    question: "A person buys a book for $15 and sells it for $18. What is the profit percentage?",
    options: ["20%", "15%", "25%", "30%"],
    correctAnswer: "20%"
  },
  {
    question: "What is 7 × 8 + 15 ÷ 3?",
    options: ["61", "60", "59", "58"],
    correctAnswer: "61"
  }
];

(async () => {
  try {
    await Question.deleteMany({});
    await Question.insertMany(questions);
    console.log("✅ 100 Sample questions inserted!");
    mongoose.connection.close();
  } catch (err) {
    console.log("❌ Error inserting questions:", err.message);
    mongoose.connection.close();
  }
})();