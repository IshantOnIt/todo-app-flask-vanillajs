# My First Flask Todo App

This is a simple Todo application built using Flask for the backend and plain HTML, CSS, and JavaScript for the frontend.

## Features (MVP)

- Add new todo items
- Display a list of todos
- Mark todos as complete/incomplete
- Delete todo items
- Edit todo item text

## Tech Stack

- **Backend:** Python (Flask) with SQLite database
- **Frontend:** HTML, CSS, Vanilla JavaScript

## Getting Started

Follow these steps to get the application up and running on your local machine.

### Prerequisites

- Python 3.x installed
- `pip` (Python package installer)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/IshantOnIt/todo-app-flask-vanillajs.git](https://github.com/IshantOnIt/todo-app-flask-vanillajs.git)
    cd todo-app-flask-vanillajs
    ```
2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    # On macOS/Linux:
    source venv/bin/activate
    # On Windows (PowerShell):
    .\venv\Scripts\activate
    ```
3.  **Install the required Python packages:**
    ```bash
    pip install -r requirements.txt
    ```

### Running the Application

1.  **Start the Flask backend:**

    ```bash
    python app.py
    ```

    The server will typically run on `http://127.0.0.1:5000/`.

2.  **Access the frontend:**
    Open your web browser and navigate to `http://127.0.0.1:5000/`.

## Project Status

Currently building out the core MVP features.

## What I Learned (or Plan to Learn)

- Setting up a Flask application
- Basic routing and templating with Flask
- Interacting with a SQLite database
- Connecting frontend (HTML/JS) to a Flask backend
- Git for version control and project management
