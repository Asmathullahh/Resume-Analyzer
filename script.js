document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('gemini-api-key');
    const apiStatus = document.getElementById('api-status');
    const targetJobInput = document.getElementById('target-job');
    const resumeTextInput = document.getElementById('resume-text');
    const analyzeBtn = document.getElementById('analyze-btn');
    const loadingSection = document.getElementById('loading-section');
    const resultsSection = document.getElementById('results-section');

    // Instant API Key Validation
    apiKeyInput.addEventListener('blur', async (e) => {
        const key = e.target.value.trim();
        if (!key) {
            apiStatus.className = 'status-indicator';
            return;
        }
        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
            if (res.ok) {
                apiStatus.className = 'status-indicator success';
            } else {
                apiStatus.className = 'status-indicator error';
            }
        } catch(err) {
            apiStatus.className = 'status-indicator error';
        }
    });

    // Check if ready to analyze
    function checkReady() {
        if (resumeTextInput.value.trim().length > 50 && apiKeyInput.value.trim().length > 0) {
            analyzeBtn.disabled = false;
        } else {
            analyzeBtn.disabled = true;
        }
    }

    resumeTextInput.addEventListener('input', checkReady);
    apiKeyInput.addEventListener('input', checkReady);

    // File Upload Logic
    const resumeUpload = document.getElementById('resume-upload');
    const uploadStatus = document.getElementById('upload-status');

    resumeUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        uploadStatus.textContent = `Reading ${file.name}...`;

        if (file.name.endsWith('.docx')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const arrayBuffer = event.target.result;
                mammoth.extractRawText({arrayBuffer: arrayBuffer})
                    .then(function(result) {
                        resumeTextInput.value = result.value;
                        uploadStatus.textContent = `Loaded ${file.name} successfully!`;
                        checkReady();
                    })
                    .catch(function(err) {
                        uploadStatus.textContent = `Error reading .docx file.`;
                    });
            };
            reader.readAsArrayBuffer(file);
        } else if (file.name.endsWith('.txt')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                resumeTextInput.value = event.target.result;
                uploadStatus.textContent = `Loaded ${file.name} successfully!`;
                checkReady();
            };
            reader.readAsText(file);
        } else {
            uploadStatus.textContent = `Unsupported file type. Please use .docx or .txt`;
        }
    });

    // Helper function to scrape URL if provided
    async function getJobDescription(inputString) {
        if (inputString.match(/^https?:\/\//)) {
            try {
                // Use allOrigins CORS proxy to fetch the HTML
                const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(inputString)}`);
                const data = await response.json();
                
                // Very basic HTML to Text extraction (strip tags)
                const doc = new DOMParser().parseFromString(data.contents, 'text/html');
                return doc.body.textContent.replace(/\s+/g, ' ').trim();
            } catch (err) {
                return `Failed to scrape URL. Proceeding with raw URL as context: ${inputString}`;
            }
        }
        return inputString; // It's just text
    }

    analyzeBtn.addEventListener('click', async () => {
        const apiKey = apiKeyInput.value.trim();
        const resumeText = resumeTextInput.value.trim();
        const targetJob = targetJobInput.value.trim();

        // UI Transitions
        analyzeBtn.disabled = true;
        resultsSection.classList.add('hidden');
        loadingSection.classList.remove('hidden');

        // Scrape URL if necessary
        const targetJobContext = await getJobDescription(targetJob);

        // Construct the highly structured prompt
        const prompt = `You are an expert Executive Recruiter and ATS (Applicant Tracking System) Specialist.
I will provide you with a resume and optionally a target job description. 

Task: Perform a deep scope analysis, score the resume, identify critical gaps, and provide high-accuracy human-friendly rewrites.

Format your response exactly using markdown:
# 🎯 Overall ATS Compatibility Score
[Give a score out of 100 based on quantifiable metrics, action verbs, and clear formatting. Briefly explain why.]

# 🔍 Critical Gaps Identified
[List 3-5 specific gaps in the resume (e.g., missing hard skills, weak phrasing, lack of metrics). If a target job is provided, heavily base gaps on the missing requirements.]

# ✨ High-Accuracy Fixes (Before & After)
[Select 3 of the weakest bullet points from the provided resume. Write the original bullet point, and then write a powerful, metric-driven, human-friendly rewritten version that an HR recruiter would love. Format as Blockquotes.]
Example:
> **Before:** Helped the team launch a new feature.
> **After:** Spearheaded the launch of a critical user feature, collaborating with a cross-functional team of 5 to increase user retention by 15% within Q3.

# 💡 Next Steps
[1-2 actionable tips for the candidate to improve their chances.]

---
**Target Job Description:**
${targetJobContext || "No specific job provided. Score based on general industry best practices."}

**Candidate's Raw Resume:**
${resumeText}`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const data = await response.json();
            
            loadingSection.classList.add('hidden');
            resultsSection.classList.remove('hidden');

            if (data.error) {
                resultsSection.innerHTML = `<h2>⚠️ API Error</h2><p style="color: var(--danger);">${data.error.message}</p>`;
            } else {
                const answer = data.candidates[0].content.parts[0].text;
                // Use marked.js (imported via CDN) to parse markdown to HTML
                resultsSection.innerHTML = marked.parse(answer);
            }
        } catch (err) {
            loadingSection.classList.add('hidden');
            resultsSection.classList.remove('hidden');
            resultsSection.innerHTML = "<h2>⚠️ Connection Error</h2><p style="color: var(--danger);">Failed to connect to the AI service. Please check your API key and connection.</p>";
        }

        analyzeBtn.disabled = false;
        analyzeBtn.textContent = "Run Analysis Again";
    });
});
