I want to build a **complete Learning Management System (LMS)**.

### Tech Stack (FIXED)

* **Frontend:** Next.js 16 (App Router, `src/`)
* **Backend:** Node.js + Express.js
* **Database:** MongoDB (Mongoose)
* **Language:** JavaScript
* **State Management:** Zustand (only where justified)
* **Auth:** JWT + HTTP-only cookies
* **Containerization:** Docker (full project)
* **CI/CD:** GitHub Actions
* **Documentation:** Maintained throughout the project

---

## CORE FUNCTIONAL REQUIREMENTS

### Authentication & Roles

* Login / Registration
* Role-based access control:

  * Public (default)
  * Student 
  * Instructor
  * Admin
* During registration:

  * User chooses **Student** or **Instructor**
* Secure auth (JWT, refresh tokens, protected routes)

---

### Course System

* Multiple courses
* Multiple categories
* All courses are **free**
* Enroll button shows **price = 0**
* No payment gateway

#### Enrollment Rules

* A student can enroll in **only ONE course at a time**
* A student can enroll in a new course only if:

  * No active course OR
  * Certificate of the current course is obtained

---

### Course Structure

Each course has:

* Multiple **Modules**

  * Module Number
  * Module Name
* Each module contains **Sub-Modules**:

  1. Documentation (Markdown)
  2. Video Tutorial (YouTube embed)
  3. MCQ Test (with cheating detection)
  4. Module Summary (Markdown)
  5. Practice Project (Markdown + GitHub repo submission)

---

### Module Locking Logic

* Only **first module unlocked** by default
* Next module unlocks **only after completing the previous one**
* Each module has a **“Mark as Completed”** button

---

### MCQ Test System (Important)

* Question types:

  * Multiple choice
  * Multiple select
  * Fill in the blanks
  * Short answer
  * Screenshot-based questions
* **Cheating Detection**

  * Clipboard contains answer → mark as cheated
  * Tab switch / window blur → mark as cheated
* Cheating is tracked:

  * Per course
  * Per module

---

### Progress Tracking

* Track:

  * Course progress %
  * Module completion
  * Test status
* Visible in student dashboard

---

### Certificate System

* Auto-generated certificate
* Conditions:

  * Course fully completed
  * User enrolled **at least 7 days ago**
* Certificate data reused for:

  * CV generation
  * Dashboard stats

---

### Feedback & Interaction

* Course feedback (only by students who completed the course)
* Comment system

---

### Forum & Blog System

* Forum and Blog are separate
* CRUD for posts
* Comments & replies
* Markdown support (code blocks allowed)

---

### Gamification & Leaderboard

* Points system:

  * Completing modules
  * Completing courses
  * Other activities
* Leaderboard:

  * Global student ranking
* Points can be used to:

  * Buy PDFs
  * Unlock premium resources

---

### Dashboards

* Separate dashboards for:

  * Student
  * Instructor
  * Admin
* Sidebar-based navigation
* Clean, professional, responsive UI

---

### Admin Panel

Admin can:

* Manage users
* Manage courses
* Manage categories
* Manage modules
* Manage MCQs
* Manage certificates
* Moderate forum/blog
* Control leaderboard & points

---

## PROJECT STRUCTURE (BACKEND — FIXED)

```
src/
│── config/
│── db/
│── lib/
│── middlewares/
│── modules/
│   └── course/
│       ├── course.controller.js
│       ├── course.service.js
│       ├── course.route.js
│── routes/
│── types/
│── utils/
│── app.js
│── server.js
```

* Each module must follow **Controller → Service → Route**
* You may suggest improvements but must explain clearly

---

## FRONTEND REQUIREMENTS

* Next.js 16
* App Router
* `src/` directory
* Clean UI (Tailwind / modern CSS)
* Responsive
* Professional design
* Animations will be added **later**
* Zustand only where global state is truly needed
