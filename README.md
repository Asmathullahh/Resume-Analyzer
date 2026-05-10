# 📄 ElevateCV: AI Resume Analyzer & Scorer

ElevateCV is a professional, browser-based web application designed to act as an expert HR Recruiter and ATS (Applicant Tracking System) Specialist. By securely connecting to the Google Gemini API directly from your browser, it analyzes your resume against target job descriptions to identify gaps and rewrite your bullet points into powerful, metric-driven statements.

## ✨ Features

*   **100% Serverless & Private:** The application runs entirely in your web browser. No backend servers, no databases, and your resume data is sent directly to the Gemini API without being stored anywhere else.
*   **ATS Compatibility Scoring:** Uses advanced prompt engineering to evaluate your resume structure and keyword density, generating a score out of 100.
*   **Critical Gap Analysis:** Identifies missing hard skills, weak phrasing, and lack of metrics—heavily weighing its analysis against your target job description.
*   **Human-Friendly Rewrites:** Automatically selects your weakest bullet points and rewrites them into highly professional "Before & After" examples.
*   **Instant API Validation:** Visual feedback instantly confirms if your Gemini API key is valid.

## 🚀 How to Run the Application

Because this is a completely static web application (Vanilla HTML, CSS, JavaScript), you do not need to install Node.js, Python, or any heavy frameworks. 

### Method 1: The Quick Way (Direct File Access)
The easiest way to run the app is to simply double-click the file!
1. Open the `ResumeAnalyzer` folder on your computer.
2. Double-click the `index.html` file. 
3. It will open directly in your default web browser (Chrome, Safari, Edge) and work perfectly.

### Method 2: Running a Local Web Server (Recommended)
If you want to run it like a true web server (which is best practice for `fetch` API requests), you can start a lightweight local server.

**If you are on a Mac:**
1. Open your Terminal.
2. Navigate to the folder:
   ```bash
   cd "/Users/asmathullahshaik/Public/AntiGravity Music Tesing/ResumeAnalyzer"
   ```
3. Start the built-in Ruby server:
   ```bash
   ruby -run -e httpd . -p 8002
   ```
4. Open your web browser and go to: `http://localhost:8002`

*(If you prefer Python, you can use `python3 -m http.server 8002` instead).*

## 🔑 How to Get a Free Gemini API Key
To use the AI features, you will need a free API key from Google.
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **Create API Key**.
4. Copy the key, open the ElevateCV app, and paste it into the top-right settings input. 
5. The indicator dot will turn **Green** if successful!

## 🛠️ Tech Stack
*   **HTML5 & CSS3:** Custom styling featuring a premium corporate aesthetic and glassmorphic elements.
*   **Vanilla JavaScript (ES6+):** Handles DOM manipulation and async API calls.
*   **Google Gemini API:** `gemini-1.5-pro-latest` for natural language processing.
*   **Marked.js:** A lightweight markdown parser to render the AI's response beautifully.

## 📝 License
Created by ElevateCV / Azu_Co-producer.
