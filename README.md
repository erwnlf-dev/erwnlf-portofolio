# Erwin Alifiansyah — Professional Portfolio (`erwnlf.dev`)

Welcome to the GitHub repository for my professional portfolio website, hosted at [erwnlf.dev](https://erwnlf.dev). 

This project is a high-performance, dark-themed responsive single-page application built to showcase my expertise as an **IT Service Resilience Manager**. It features modern frontend design patterns, search engine optimization (SEO), and an interactive infrastructure resilience sandbox.

---

## 🚀 Key Highlights & Features

### 1. Interactive Resilience & Automation Lab
An interactive, client-side sandbox simulation demonstrating enterprise outage scenarios and automated recoveries:
* **Outage Simulation**: Triggers a simulated failure on VMware hosts and production databases, reflecting SLA alerts and status shifts.
* **Continuous Data Protection (CDP) Failover**: Simulates a Zerto disaster recovery pipeline recovery process (0.8s RPO / near-zero data loss).
* **Self-Healing Automation Gateway**: Visualizes an automated recovery flow orchestrated via **n8n workflows**.
* **AI Operations Agent**: Simulates an automated alert audit check.

### 2. High-Tech UX & Dynamic Visuals
* **Particle Network Canvas**: A custom HTML5 canvas particle connector background animation symbolizing unified system networks.
* **Theme Manager**: Light/Dark mode state management featuring instant storage persistence (`localStorage`) to prevent style flashes on reload.
* **Compact Visual Style**: Built using compact visual containers, clean card sections, and hover-triggered micro-interactions for a premium developer dashboard feel.

### 3. SEO & Structured Metadata
* **JSON-LD Schema Markup**: Embedded JSON-LD schema matching Google's guidelines to index biography, core skills, employment organization (`PT Datacomm Diangraha`), and social URLs.
* **OpenGraph & Twitter Card Meta Tags**: Optimized sharing cards for Twitter, LinkedIn, and Facebook, including page descriptions and image link preloads.
* **Critical Path Preloading**: Font preloading and non-blocking CSS loaders to achieve optimized performance metrics.

---

## 🛠️ Technology Stack

* **Structure**: HTML5 (Semantic, SEO-ready layout structure).
* **Logic**: Vanilla ES6+ JavaScript (State machine simulation, particle background, scroll-indicators, viewport triggers).
* **Styling**: Pure CSS3 variables (responsive grids, fluid layout tokens, dark/light theme properties).
* **Hosting Configuration**: Integrated edge-rewrite rules inside `vercel.json` for custom domain mappings.

---

## 📂 Project Structure

```text
portofolio/
├── assets/                    # Image assets, logo, icons, and favicon
├── css/
│   ├── style.css              # Custom styling sheet (theme tokens, layouts, responsive queries)
│   └── all.min.css            # Localized FontAwesome icons library
├── js/
│   └── script.js              # Simulation state machine and interactivity logic
├── webfonts/                  # Locally served icon font files
├── index.html                 # Main entry point with structured metadata
├── vercel.json                # Vercel deployment edge routing settings
├── Erwin_Alifiansyah_CV.pdf   # Career CV download attachment
└── README.md                  # Project documentation
```

---

## ⚙️ How to Deploy & Develop Locally

### Local Development
Since the project is built using native web technologies with zero build dependencies, you can open and edit it directly in any browser:
1. Clone the repository:
   ```bash
   git clone git@github.com:erwnlf-dev/erwnlf-portofolio.git
   ```
2. Open `index.html` in your browser, or spin up a local development server:
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Using Node.js (npx)
   npx serve .
   ```

### Deploying to Vercel
This project includes a `vercel.json` routing configuration template. To deploy instantly on Vercel:
1. Install the Vercel CLI: `npm install -g vercel`
2. Run `vercel` from the root directory and follow the prompt.

---

## 👤 Author
**Erwin Alifiansyah**  
*IT Service Resilience Manager // PT Datacomm Diangraha*  
* **LinkedIn**: [in/erwinalif](https://www.linkedin.com/in/erwinalif)  
* **GitHub**: [@erwnlf-dev](https://github.com/erwnlf-dev)  
