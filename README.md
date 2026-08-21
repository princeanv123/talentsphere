# 🎯 TalentSphere

## AI-Powered Talent Intelligence Platform

TalentSphere is an AI-enabled talent intelligence platform designed to simplify resume intelligence, candidate discovery, semantic search, and candidate–job matching.

The product combines structured resume parsing, AI-powered candidate discovery, semantic search, and intelligent matching to help recruiters identify relevant candidates faster.

---

## 🚀 Product Vision

Traditional recruiting workflows often require recruiters to manually review resumes, search across candidate databases, and compare candidates against job requirements.

TalentSphere aims to transform this workflow into an intelligence-driven experience where recruiters can:

- Understand candidate profiles quickly
- Discover relevant candidates using natural language
- Search candidates based on skills and experience
- Match candidates against job requirements
- Surface relevant candidates from the internal talent database
- Use AI to support recruiting decisions

---

## 🎯 Product Capabilities

### 📄 Resume Intelligence

TalentSphere processes candidate resumes and converts unstructured resume content into structured candidate information.

Key capabilities include:

- Resume upload
- Resume text extraction
- AI-powered resume parsing
- Candidate profile creation
- Structured education and experience information
- Skills and certification extraction

---

### 🔎 Semantic Candidate Search

Recruiters can search the candidate database using natural-language requirements rather than relying only on exact keyword matching.

Example:

> "Find senior Java developers with cloud experience and strong banking domain experience."

TalentSphere interprets the search intent and identifies relevant candidates from the available talent pool.

---

### 🤖 AI-Powered Candidate Matching

TalentSphere evaluates candidates against job requirements and generates matching insights.

The matching workflow considers factors such as:

- Skills
- Experience
- Job requirements
- Candidate profile information
- Relevant qualifications

The goal is to help recruiters move from **searching resumes → understanding candidate relevance**.

---

### 👥 Candidate Discovery

TalentSphere provides recruiter-oriented candidate discovery capabilities to identify potentially relevant candidates from the internal database.

The product supports:

- Candidate discovery
- Candidate filtering
- Candidate matching
- Candidate recommendations
- Match analysis

---

### 📊 Matching Intelligence

The platform is designed to provide insights into candidate–job fit and help recruiters understand why a candidate may be relevant.

This creates a foundation for future capabilities such as:

- Match scoring
- Match explanations
- Candidate ranking
- Recruiting analytics
- Talent intelligence dashboards

---

## 🧠 AI Product Architecture

TalentSphere uses AI as a product capability rather than simply as a chatbot.

### AI is applied across the product lifecycle:

**Resume → Extraction → AI Parsing → Structured Candidate Profile → Search → Matching → Recruiter Insight**

Google Gemini is integrated into the backend to support AI-powered resume intelligence and matching workflows.

---

---

## 🎯 Product Management Approach

TalentSphere was built by applying a product-led approach to a real recruiting workflow problem.

### 👥 Target Users

- Recruiters
- Talent acquisition teams
- Hiring managers

### 🔍 Core Problem

Recruiters often spend significant time manually reviewing resumes,
searching candidate databases, interpreting candidate experience,
and comparing candidates against job requirements.

TalentSphere addresses this problem by combining structured candidate
intelligence, semantic search, and AI-powered candidate-job matching.

### 💡 Product Strategy

The product focuses on reducing recruiter effort across three key stages:

1. **Understand** — Convert unstructured resumes into structured candidate intelligence.
2. **Discover** — Find relevant candidates using semantic search and AI-assisted discovery.
3. **Match** — Compare candidates against job requirements and surface the strongest matches.

### 🧭 Key Product Decisions

- Structured resume parsing instead of relying only on keyword search
- Semantic candidate discovery instead of exact keyword matching
- AI-assisted candidate-job matching to support recruiter decision-making
- Modular backend services to allow matching capabilities to evolve independently
- Human-in-the-loop workflows so AI supports recruiter decisions rather than replacing them

### 📊 Product Success Measures

Potential product KPIs include:

- Time to identify qualified candidates
- Candidate search relevance
- Candidate-job match quality
- Recruiter workflow completion time
- Search-to-shortlist conversion

---

## 🔄 Key Product Workflows

TalentSphere is designed around an end-to-end recruiter workflow.

### 1. 📄 Resume Intelligence

**Resume Upload → Text Extraction → AI Parsing → Structured Candidate Profile**

Resumes are processed and transformed into structured candidate information such as:

- Personal and professional details
- Skills
- Experience
- Education
- Certifications
- Career information

This structured representation enables downstream search and matching capabilities.

### 2. 🔎 Candidate Discovery

**Recruiter Search → Semantic Understanding → Candidate Retrieval → Relevant Results**

Recruiters can search for candidates using natural language rather than relying only on exact keyword matches.

The discovery workflow is designed to identify candidates based on the meaning and context of the search criteria.

### 3. 🎯 Candidate–Job Matching

**Job Requirements → Candidate Analysis → Match Evaluation → Ranked Candidates**

TalentSphere evaluates candidate profiles against job requirements to identify relevant matches.

The matching workflow considers candidate attributes and experience to support more informed recruiter decisions.

### 4. 🤖 AI-Assisted Match Analysis

**Candidate + Job → AI Analysis → Match Insights**

AI is used to generate additional interpretation around the candidate-job relationship, helping recruiters understand why a candidate may be relevant rather than relying only on a numerical match score.

### 5. 👤 Recruiter Decision Support

**Search → Discover → Compare → Evaluate → Shortlist**

The final decision remains with the recruiter.

TalentSphere is designed as a decision-support product where AI reduces information-processing effort while keeping the recruiter in control of the hiring decision.

## 🏗️ Product Architecture

```text
                    ┌───────────────────────┐
                    │       Recruiter       │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   React.js Frontend   │
                    │      + Vite            │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │    Node.js / Express  │
                    │        Backend        │
                    └───────────┬───────────┘
                                │
                 ┌──────────────┼──────────────┐
                 ▼              ▼              ▼
          ┌────────────┐ ┌────────────┐ ┌────────────┐
          │  Gemini AI │ │  Supabase  │ │ Candidate  │
          │            │ │ PostgreSQL │ │  Matching  │
          └────────────┘ └────────────┘ └────────────┘
                 │              │              │
                 └──────────────┼──────────────┘
                                ▼
                    ┌───────────────────────┐
                    │ Recruiter Intelligence│
                    │       & Insights      │
                    └───────────────────────┘
