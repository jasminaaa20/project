# Emoji Story Translator

A FastAPI-based web application that translates emoji sequences into creative story narratives. Users can create, share, and like emoji stories with automatic translation powered by predefined rules and patterns.

## Features

- **Create Emoji Stories**: Transform emoji sequences into narrative stories
- **Story Management**: View, edit, and delete emoji stories
- **Community Features**: Like stories and view popular stories
- **Translation Preview**: Get instant translation previews without saving
- **RESTful API**: Complete CRUD operations for emoji stories
- **Web Interface**: Simple HTML frontend for story interaction

## Tech Stack

- **Backend**: FastAPI (Python)
- **Database**: SQLAlchemy with SQLite
- **Frontend**: HTML, CSS, JavaScript with Jinja2 templates
- **Package Management**: UV (Python package manager)

## Project Structure

```text
.
├── app/
│   ├── main.py              # FastAPI application and routes
│   ├── models.py            # SQLAlchemy database models
│   ├── schemas.py           # Pydantic schemas for API
│   ├── database.py          # Database configuration
│   └── translation_service.py # Emoji translation logic
├── static/
│   ├── style.css           # Frontend styles
│   └── script.js           # Frontend JavaScript
├── templates/
│   └── index.html          # HTML template
├── pyproject.toml          # Project dependencies and configuration
├── uv.lock                # Lock file for dependencies
└── README.md              # This file
```

## Prerequisites

- Python 3.12 or higher
- UV package manager (recommended) or pip

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/jasminaaa20/project.git
cd project
```

### 2. Install Dependencies

#### Using UV (Recommended)

```bash
# Install UV if you haven't already
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install project dependencies
uv sync
```

#### Using pip

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi jinja2 python-multipart sqlalchemy uvicorn
```

### 3. Database Setup

The application uses SQLite with SQLAlchemy. The database will be automatically created when you first run the application.

## Running the Application

### Using UV

```bash
# Run the development server
uv run python -m app.main
```

### Using Python directly

```bash
# If using virtual environment, activate it first
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Run the application
python -m app.main
```

### Using Uvicorn directly

```bash
# Run with uvicorn for more control
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The application will be available at:

- **Web Interface**: <http://localhost:8000>
- **API Documentation**: <http://localhost:8000/docs>
- **Alternative API Docs**: <http://localhost:8000/redoc>

## API Endpoints

### Stories

- `GET /api/stories` - Get all stories (supports pagination and popular sorting)
- `GET /api/stories/{story_id}` - Get a specific story
- `POST /api/stories` - Create a new emoji story
- `PUT /api/stories/{story_id}` - Update an existing story
- `DELETE /api/stories/{story_id}` - Delete a story

### Interactions

- `POST /api/stories/{story_id}/like` - Like a story
- `POST /api/translate-preview` - Preview translation without saving

### Query Parameters

- `skip`: Number of stories to skip (pagination)
- `limit`: Maximum number of stories to return (default: 20)
- `popular`: Sort by likes instead of creation date (true/false)

## Usage Examples

### Create a Story

```bash
curl -X POST "http://localhost:8000/api/stories" \
     -H "Content-Type: application/json" \
     -d '{
       "emoji_sequence": ["🐱", "🐟", "😋"],
       "author_nickname": "EmojiMaster"
     }'
```

### Get Popular Stories

```bash
curl "http://localhost:8000/api/stories?popular=true&limit=10"
```

### Preview Translation

```bash
curl -X POST "http://localhost:8000/api/translate-preview" \
     -H "Content-Type: application/json" \
     -d '["🌟", "🎭", "💖"]'
```
