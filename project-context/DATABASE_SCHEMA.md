# Database Schema — NEURON OS

NEURON OS supports SQLAlchemy relationships, connecting tables for accounts, chat sessions, and vector databases.

```mermaid
erDiagram
    USERS ||--o{ CONVERSATIONS : creates
    USERS ||--o{ MEMORIES : owns
    CONVERSATIONS ||--o{ MESSAGES : contains
    
    USERS {
        int id PK
        string email UNIQUE
        string hashed_password
        string full_name
        boolean is_active
        datetime created_at
    }
    
    CONVERSATIONS {
        int id PK
        int user_id FK
        string title
        datetime created_at
    }
    
    MESSAGES {
        int id PK
        int conversation_id FK
        string sender "user | assistant"
        string content
        datetime created_at
    }
    
    MEMORIES {
        int id PK
        int user_id FK
        string text
        string category "semantic | episodic | procedural"
        string tags "comma-separated"
        string embedding_data "JSON floats array"
        datetime created_at
    }
```

## ⚙️ Model Configurations

* **SQLite Fallback:** Uses `connect_args={"check_same_thread": False}`. The vector embedding is serialized into a string of floats using JSON.
* **PostgreSQL Engine:** Runs pgvector (`ankane/pgvector` docker container). When pgvector is active, database migrations map the query similarities directly.
* **Cascade Constraints:** Deleting a `Conversation` automatically cascades deletion to all child `Message` records.
