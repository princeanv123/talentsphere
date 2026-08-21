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
