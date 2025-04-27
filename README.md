
# Health Management System

## Description

This system helps doctor to  manage health records for individuals 

---

## Features

- Search Clients
- Register Clients
- View Enrollments
- Manage Health Programs
- Client Profiles
- API Access

---

## Installation

### Backend (Django)

1.  `git clone https://github.com/Sheeba193/health_system.git`
2.  `cd health_system/backend`
3.  `python3 -m venv venv`
4.  `source venv/bin/activate`  # Linux/macOS
    `venv\Scripts\activate`    # Windows
5.  `pip install -r requirements.txt`
6.  `python manage.py migrate`
7.  `python manage.py createsuperuser`
8.  `python manage.py runserver`

Backend runs on `http://127.0.0.1:8000/`.

### Frontend (React)

1.  `cd ../frontend`
2.  `npm install`
3.  `npm start`

Frontend runs on `http://localhost:3000/`.

---

## Usage

Open `http://localhost:3000/` in your browser. Use the interface to manage health records. The API is at `http://127.0.0.1:8000/`.
