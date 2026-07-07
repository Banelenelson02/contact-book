# Modern Contact Book

A robust, modular CRUD application built with vanilla JavaScript. This project serves as a demonstration of professional frontend architecture, focusing on separation of concerns, defensive programming, and modern ES6 module patterns.

## Architectural Highlights
Unlike traditional monolithic scripts, this application is architected for maintainability:
* **Modular Design:** Logic is split into distinct services (`storage.js`, `ui.js`, `app.js`), enabling independent testing and cleaner debugging.
* **Defensive Programming:** Implements input sanitization to prevent XSS (Cross-Site Scripting) and robust error handling for local storage operations.
* **State Management:** Follows a clean pattern where the UI reacts to data changes, rather than tightly coupling business logic with DOM manipulation.

##  Key Features
- **Persistent Storage:** Seamlessly saves and loads contacts via browser localStorage.
- **Form Validation:** Strict validation for phone numbers and email formats with real-time feedback.
- **User-Centric UI:** Includes intuitive modals for adding/editing and a "Confirmation" layer to prevent accidental deletions.
- **Accessibility:** Built with semantic HTML and ARIA labels for inclusive user interaction.

## 🛠️ Technical Stack
- **Language:** ES6+ JavaScript
- **Styling:** CSS3 (Flexbox/Grid, Responsive Design)
- **Icons:** FontAwesome
- **Architecture:** ES6 Modules (`import/export`)

##  Project Structure
```text
js/
├── app.js      # Central orchestrator (Controller)
├── storage.js  # Persistence layer (Data Service)
└── ui.js       # DOM manipulation & rendering (View)
css/
└── styles.css  # Responsive component-based styles
