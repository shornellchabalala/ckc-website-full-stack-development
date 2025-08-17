from flask import Flask, render_template, request, jsonify # type: ignore
import sqlite3

app = Flask(__name__)

# ---------- DATABASE SETUP ----------
def init_db():
    conn = sqlite3.connect("messages.db")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    phone TEXT,
                    service TEXT,
                    message TEXT NOT NULL
                )''')
    conn.commit()
    conn.close()

# Initialize database
init_db()


# ---------- ROUTES ----------
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/submit", methods=["POST"])
def submit():
    try:
        name = request.form["name"]
        email = request.form["email"]
        phone = request.form.get("phone", "")
        service = request.form.get("service", "")
        message = request.form["message"]

        # Save to database
        conn = sqlite3.connect("messages.db")
        c = conn.cursor()
        c.execute("INSERT INTO messages (name, email, phone, service, message) VALUES (?, ?, ?, ?, ?)",
                  (name, email, phone, service, message))
        conn.commit()
        conn.close()

        return jsonify({
            "status": "success",
            "message": "Thank you! Your message has been sent. We'll get back to you soon!"
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Something went wrong: {str(e)}"
        })


@app.route("/admin/messages")
def view_messages():
    conn = sqlite3.connect("messages.db")
    c = conn.cursor()
    c.execute("SELECT * FROM messages ORDER BY id DESC")
    messages = c.fetchall()
    conn.close()

    # Simple display of messages
    html = "<h2>Messages Received</h2><ul>"
    for m in messages:
        html += f"<li><strong>{m[1]}</strong> ({m[2]}) - {m[4]} <br> {m[5]}</li><br>"
    html += "</ul>"
    return html


if __name__ == "__main__":
    app.run(debug=True)
