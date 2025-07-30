from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

DATABASE = 'todo.db'

# Database helper functions
def get_db_connection():
    # Connect to the database
    conn = sqlite3.connect(DATABASE)
    # Configure row_factory to return rows as dictionary-like objects
    # This makes it easier to access columns by name (e.g., row['title'])
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    with conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                completed BOOLEAN NOT NULL DEFAULT 0
            );
        ''')
    print('Database initialized or already exists.')

with app.app_context():
    init_db()

@app.route("/")
def home():
    return render_template('index.html')

# Get all todos
@app.route("/api/todos", methods=['GET'])
def get_todos():
    conn = get_db_connection()
    todos = conn.execute('SELECT * FROM todos').fetchall()
    conn.close()
    return jsonify([dict(todo) for todo in todos])

# Add a new todo
@app.route("/api/todos", methods=['POST'])
def add_todo():
    data = request.get_json()
    title = data.get('title')

    if not title:
        return jsonify({'error': 'Title is required'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO todos (title) VALUES (?)', (title,))
    conn.commit()
    todo_id = cursor.lastrowid
    conn.close()
    return jsonify({'message': 'Todo added successfully', 'id': todo_id, 'title': title, 'completed': False}), 201

# Update a todo
@app.route("/api/todos/<int:todo_id>", methods=['PUT'])
def update_todo(todo_id):
    data = request.get_json()
    title = data.get('title')
    completed = data.get('completed')

    conn = get_db_connection()
    cursor = conn.cursor()
    update_fields = []
    params = []

    if title is not None:
        update_fields.append('title = ?')
        params.append(title)

    if completed is not None:
        update_fields.append('completed = ?')
        params.append(1 if completed else 0)

    if not update_fields:
        conn.close()
        return jsonify({'error': 'No update data provided'}), 400
    
    params.append(todo_id)
    query = f'UPDATE TODOS SET {", ".join(update_fields)} WHERE id = ?'

    cursor.execute(query, tuple(params))
    conn.commit()

    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'error': 'Todo not found'}), 404

    conn.close()
    return jsonify({'message': 'Todo updated successfully', 'id': todo_id, 'title': title, 'completed': completed}), 200

# Delete a todo
@app.route("/api/todos/<int:todo_id>", methods=['DELETE'])
def delete_todo(todo_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM todos WHERE id = ?', (todo_id,))
    conn.commit()

    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'error': 'Todo not found'}), 404

    conn.close()
    return jsonify({'message': 'Todo deleted successfully'}), 200

if __name__ == "__main__":
    app.run(debug=True)
