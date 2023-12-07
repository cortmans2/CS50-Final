from flask import Flask, render_template, request, session, redirect, url_for, flash
from sqlalchemy import Column, Integer, String, Sequence
import uuid
from helpers import create_maze
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__, template_folder='templates')
app.secret_key = '1cd3c5393aa34f93909f4b047246f6dd'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model):
    id =db.Column(db.String(36), primary_key=True, default=str(uuid.uuid4()))
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(1000), nullable=False)

@app.route('/' , methods=["GET"])
def index():
    if 'user_id' in session:
        return render_template("index.html", current_user=User.query.filter_by(id=session['user_id']).first())
    return render_template("index.html")

@app.route('/create_account', methods=["GET", "POST"])
def create_account():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        # Check if the username already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash('Username already exists. Please choose another.', 'error')
            return "Username already exists"
        else:
            # Hash the password before storing it
            hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

            # Create a new user
            new_user = User(username=username, password=hashed_password)
            db.session.add(new_user)
            db.session.commit()

            # Print username and hashed password safely
            print(new_user.username)
            if hasattr(new_user, 'password'):
                print(new_user.password)

            flash('Account created successfully! You can now log in.', 'success')
            return redirect(url_for('login'))

    return render_template("create_account.html")

@app.route('/login', methods=["GET", "POST"])
def login():
    session.clear()
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        # Query the user by username
        user = User.query.filter_by(username=username).first()
        print("Entered Password:", password)
        print("Hashed Password in Database:", user.password)

        if not check_password_hash(user.password, password):
            print("hello")

        if user and check_password_hash(user.password, password):
            # Passwords match, log in the user
            session['user_id'] = user.id
            print('Login successful!', 'success')
            return redirect("/")
        else:
            return "invalid password"

    return render_template("login.html")

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

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
