🪙 SmartSpends
SmartSpends is an intelligent, modern financial strategist and micro-allocation engine. The application empowers users by automatically ingestion dynamic 30-day transactional records, parsing them against personalized milestones, and compiling optimized asset/budget allocation matrices. It features a responsive UI dashboard alongside automated pipeline automation scripts for recurring ledger summaries.

🚀 Architectural Blueprint
The application uses a structurally decoupled Client-Server architecture to optimize build targets, allow independent service scaling, and minimize cross-origin layout latency.
Frontend Engine: Single Page Application (SPA) built using React 18+ and Vite, bundled with Tailwind CSS variables and managed layout topologies.
Backend Runtime: Node.js framework running an Express.js API cluster managing stateless JWT routing structures.
Mailing Orchestration: SMTP data streams utilizing Nodemailer connected to structured Node-Cron event configurations.

🛠️ Tech Stack & Dependencies
Layer	Technologies Used	Key Purpose
Frontend UI	React, Vite, Tailwind CSS, Lucide Icons	High-performance reactive state, fluid dashboard layouts, modular components.
Data Analytics	Recharts (Responsive Container Matrix)	Compiling visual asset macro allocation maps using dynamic SVG paths.
Core Server	Node.js, Express, MongoDB Atlas, Mongoose	JSON data persistence, analytical processing, route tracking handlers.
Security Layer	JSON Web Tokens (JWT), Bcrypt.js	Cryptographic token processing, secure state synchronization across origins.
Automations	Nodemailer, Node-Cron	Generating financial matrices and distributing periodic email digests.
💻 Local Setup & Development Environment
1. Repository Preparation
Bash
git clone https://github.com/agrima1723/smartspends.git
cd smartspends
2. Microservice Layer: Backend Setup
Open a terminal path in your server directory (e.g., /server or /backend based on your project configuration).

Install package topologies and define global runtime parameters:

Bash
npm install
touch .env
Populate .env with your secure infrastructure credentials:

Code snippet
PORT=5001
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/smartspends
JWT_SECRET=your_super_secure_jwt_secret_matrix_key
EMAIL_USER=your_verified_gmail_agent@gmail.com
EMAIL_PASS=xxxx_xxxx_xxxx_xxxx # Your 16-digit Google App Password
Start the engine locally: npm start or npm run dev

3. Application Layer: Frontend Setup
Move back into your project root/frontend module directory.

Link development modules and expose variables:

Bash
npm install
touch .env
Point your client to your local development service boundary:

Code snippet
VITE_API_BASE_URL=http://localhost:5001
Ignite the local development server: npm run dev

🌐 Production Cloud Deployments
⚡ Vercel (Client App Layer)
The user interface is hosted across Vercel’s global Edge network to achieve immediate visual hydration.

Deployment Key Step: During import initialization, scroll down to the Environment Variables panel and accurately provision the remote environment string:

Environment Variable Key	Configuration Production String
VITE_API_BASE_URL	https://smartspends-3hv9.onrender.com
⚠️ Configuration Guardrail: Do not add a trailing forward slash (/) or suffix the target string with /api. Component API requests append extensions dynamically using native template strings.

⚙️ Render (Application Server Layer)
The Node runtime cluster communicates directly via Render Web Services.
Deploy the active repository target path as an Express Web Service instance.
Bind production variables corresponding to your local database strings and email credentials.
Free-Tier Workflow Optimization: To circumvent Render’s automatic 15-minute component spindown (sleeping state)—which could delay background automated chronologies—it is advised to add an external automated heart-beat runner (e.g., cron-job.org) targeting your ping routes or configure a dedicated Render Cron Job instance.
🔒 Security & Code Compliance
This deployment handles authentication natively via bearer payload strings transmitted safely through encrypted request layers. This repo conforms directly to open development principles under the standard MIT License.

🪙 Key Features of SmartSpends
AI Financial Strategist Engine: Maps individual financial goals, monthly disposable incomes, and savings milestones against historical profiles to compute an optimized spending allocation framework.
Dynamic Analytics & Chart Matrix: Translates numerical budget distributions into highly readable visual charts using a custom-themed, responsive bar chart container layer (Recharts).
Granular Category Ledgers: Features a detailed breakdown matrix of spending architectures, displaying calculated target allocations, income multiplier percentages, and strategic tactical intents for every financial category.
State-Synchronized Session Security: Secures private financial data through stateless authentication, utilizing JSON Web Tokens (JWT) stored safely in browser storage for cross-origin server requests.
Automated Background Cron Pipeline: Runs server-side event schedulers designed to compile financial data dynamically and distribute automated, templated email reports to users regarding recurring logs or status updates.
Full-Responsive Glassmorphism UI: Built with an ultra-modern dark theme using Tailwind CSS backdrop blurs, gradients, and subtle pulse animations to deliver a premium user experience across all mobile, tablet, and desktop viewports.
