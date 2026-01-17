# Conduit Automation

![Cypress](https://img.shields.io/badge/-cypress-%23E5E5E5?style=for-the-badge&logo=cypress&logoColor=058a5e)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

## Overview

This repository contains a comprehensive test automation suite for the **Conduit (RealWorld App)** platform. It demonstrates a modern approach to Quality Assurance by combining **UI interactions** with **API manipulation** to create fast, reliable, and flaky-resistant tests.

## Tech Stack

- **Automation Tool:** Cypress (v13+)
- **Language:** TypeScript
- **Design Pattern:** Page Object Model (POM)
- **CI/CD:** GitHub Actions (Ready)

## Test Scenarios Coverage

### Sign In

**Sign In Page - Positive Cases**

- Should be able to Sign In with valid credentials

**Sign In Page - Negative Cases**

- Should not be able to Sign In with Email or Password invalid
- Should not be able to click Sign In button when email is blank
- Should not be able to click Sign In button when password is blank

### Home

**Home Page - Guest State**

- Should display 'Sign in' and 'Sign up' buttons in Navbar
- Should display 'Global Feed' tab by default
- Should redirect to Registration page when clicking 'Favorite' (Heart) button
- Should redirect to Login page when clicking 'Sign in' link
- Should clear tag filter when clicking 'Global Feed' tab again

**Home Page - Authenticated State**

- Should display User Profile and 'New Article' buttons in Navbar
- Should allow user to toggle 'Favorite' (Add Favorite)
- Should allow user to toggle 'Favorite' (Remove Favorite)
- Should navigate to Article Detail page when clicking an article title
- Should display 'No articles are here... yet.' when feed is empty

**Home Page - Functional Logic**

- Should filter article list by Popular Tags
- Should display pagination when article count exceeds the limit (10 items)
- Should load the next set of articles when clicking pagination numbers

### Editor

**Editor Page - Positive Cases**

- Verify user can publish article with complete valid data
- Verify user can publish article without Tags (Optional field)

**Editor Page - Negative Cases (Validation)**

- Verify system rejects submission when Title is empty
- Verify system rejects submission when Body is empty
- Verify article creation behavior with duplicate Title

### Article

**Reader Perspective (Interaction)**

- Verify navigation to author profile when clicking Author Name
- Verify user can Follow/Unfollow author
- Verify user can Favorite/Unfavorite article
- Verify user can post a comment
- Verify user can delete their own comment

**Author Perspective (Ownership)**

- Verify 'Edit' and 'Delete' article buttons are VISIBLE for the author
- Verify 'Edit' and 'Delete' article buttons are HIDDEN for non-authors

### Profile

**Profile Page - My Profile View**

- Should display correct user information (Username, Bio, Image)
- Should display 'Edit Profile Settings' button
- Should navigate to Settings page when clicking 'Edit Profile Settings'
- Should default to 'My Articles' tab and display created articles
- Should switch to 'Favorited Articles' tab and display liked articles

**Profile Page - Other Author View**

- Should display 'Follow' button instead of 'Edit Profile'
- Should allow user to Follow an author
- Should allow user to Unfollow an author

### Settings

**Settings Page - Functional Update**

- Verify user can update Profile Picture
- Verify user can update Username
- Verify user can update Bio

**Settings Page - Session Management**

- Verify user is redirected to Home page after Logout

### User Journey

**User Journeys**

- The Author's Lifecycle (Create > Verify in Feed > Edit > Delete)
- The Fan Interaction
- Identity & Security Update

## What I Learned

### Hybrid Testing Strategy

Relying 100% on UI interactions turned out to be too flaky. I refactored the code to handle prerequisites (auth, data creation) via API, so the UI tests can focus solely on user behavior. The result is a much snappier and stable test suite

### Asynchronous Nature

Understanding Cypress's non-blocking architecture was a challenge. I learned that variables cannot be returned synchronously. Mastering `.then()`, aliases (`.as`), and understanding that **aliases reset between tests** were crucial moments in stabilizing my test suite.

### Reset on Start over Cleanup

I stopped relying on teardown scripts because they often fail to run when a test crashes. Instead, I use a 'Reset on Start' approach. By forcing the app into a clean state via API before a test begins, to guarantee a fresh environment every single time

## Resources & Credits

This project tests the open-source **Conduit** application created by [GoThinkster](https://github.com/gothinkster).

- **Application Under Test (Web):** [https://conduit.realworld.io](https://conduit.bondaracademy.com)
- **API Documentation:** [RealWorld API Specs](https://realworld-docs.netlify.app/specifications/backend/introduction/)
