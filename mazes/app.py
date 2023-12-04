from flask import Flask, render_template, request, session, redirect, url_for, flash
from sqlalchemy import Column, Integer, String, Sequence
from sqlalchemy.orm import sessionmaker
import uuid
from helpers import create_maze
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError

app = Flask(__name__, template_folder='templates')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///your_database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model):
    id =db.Column(db.String(36), primary_key=True, default=str(uuid.uuid4()))
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)

@app.route('/' , methods=["GET"])
def index():
    return render_template("index.html")

@app.route('/create_account', methods=["GET", "POST"])
def create_account():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        # Check if the username or email already exists
        if User.query.filter_by(username=username).first() or User.query.filter_by(password=password).first():
            flash('Username or email already exists. Please choose another.', 'error')
        else:
            # Create a new user
            new_user = User(username=username, password=password)
            db.session.add(new_user)
            db.session.commit()

            flash('Account created successfully! You can now log in.', 'success')
            return redirect(url_for('login'))  # Assuming you have a login route

    return render_template("create_account.html")

@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        # Replace with your actual authentication logic (e.g., querying the database)
        user = User.query.filter_by(username=username, password=password).first()

        if user:
            # Store user information in the session
            session['user_id'] = user.id
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Login failed. Please check your username and password.', 'error')
    return render_template("login.html")

@app.route('/play' , methods=["GET", "POST"])
def play():
    if(request.method == "POST"):
        difficulty = request.form.get("difficulty")
        print(f"maze-{difficulty}.html")
        maze = create_maze(difficulty)
        return render_template(f"maze_{difficulty}.html", maze=maze)
    else:
        return "error"

if __name__ == "__main__":
   print("reached")
   app.run(port=5000)
