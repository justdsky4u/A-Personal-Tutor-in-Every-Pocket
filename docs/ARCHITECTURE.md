# Architecture Overview

## Vision
A Personal Tutor in Every Pocket is designed as an education infrastructure for underserved communities. It combines a cross-platform app, offline AI-enabled tutoring, and lightweight backend sync to deliver personalized learning.

## Core components

### Mobile App
- React Native + Expo for cross-platform support
- Local storage via AsyncStorage for offline chat history and lesson content
- Voice output using Expo Speech
- Simple, low-data UI optimized for low-RAM devices
- Starter learning engine with story-mode analogies and local-context prompts

### Backend Sync Server
- Node.js + Express backend for optional cloud sync
- Stores user progress and device updates
- Supports offline-first devices that sync when connected

### AI Strategy
- On-device lightweight response generation for basic tutoring
- Placeholder integration for future hybrid mode with external AI APIs
- Local analogy mode for culturally aware explanations
- Audio-first support for low literacy learners

## MVP capabilities
- Chat-based tutor
- 3 starter subjects: Math, Science, Language
- Offline lessons + stored history
- Motivation banner and daily streak model
- Simple voice-based feedback

## Future roadmap
1. Add real local language and dialect support
2. Build a curriculum flow engine with adaptive lesson paths
3. Add vocation-focused learning and micro-business guidance
4. Support user profiles, class grouping, and community learning hubs
