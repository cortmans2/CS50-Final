from flask import Flask, render_template, request, session, redirect, url_for, flash, jsonify
from sqlalchemy import Column, Integer, String, Sequence
import uuid
from helpers import create_maze
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash

# Configure flask application
app = Flask(__name__, template_folder='templates')
app.secret_key = '1cd3c5393aa34f93909f4b047246f6dd'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///main.db'
app.config['SQLALCHEMY_BINDS'] = {
    'users': 'sqlite:///users.db',
    'leaderboard': 'sqlite:///leaderboard.db'
}
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize flask app
db= SQLAlchemy(app)

# Set user database model
class User(db.Model):
    __bind_key__= 'users'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(1000), nullable=False)

# Set leaderboard database model
class Leaderboard(db.Model):
    __bind_key__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    maze_type = db.Column(db.String(50), nullable=False)
    time = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref='leaderboard_entries')

    def __repr__(self):
        return f"LeaderboardEntry(maze_type={self.maze_type}, time={self.time}, user_id={self.user_id})"

# Exclusively post route to add data to the leaderboard
@app.route('/add_to_leaderboard', methods=['POST'])
def add_to_leaderboard():
    maze_type = request.form.get('maze_type')
    time = request.form.get('time')

    user_id = session.get('user_id')

    # Create a new entry in the leaderboard
    new_entry = Leaderboard(maze_type=maze_type, time=time, user_id=user_id)
    db.session.add(new_entry)
    db.session.commit()

    return jsonify(success=True)

# Homepage
@app.route('/' , methods=["GET"])
def index():
    fastest_times = {}
    maze_types = ["small", "medium", "large"]

    # Query for fastest times for each maze size
    for maze_type in maze_types:
        entries = Leaderboard.query.filter_by(maze_type=maze_type).order_by(Leaderboard.time).limit(10).all()
        fastest_times[maze_type] = entries

    # If the current user is logged in, display the name, otherwise Guest
    if 'user_id' in session:
        return render_template("index.html", current_user=User.query.filter_by(id=session['user_id']).first(), fastest_times=fastest_times)
    return render_template("index.html", fastest_times=fastest_times)

# Account creation
@app.route('/create_account', methods=["GET", "POST"])
def create_account():
    error_message = None
    session.clear()
    if request.method == 'POST':
        
        # Get the username and password
        username = request.form.get('username')
        password = request.form.get('password')

        # Check if the username already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            error_message = "Username already in use"
            return render_template("create_account.html", error_message=error_message)
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

            return redirect(url_for('login'))

    return render_template("create_account.html")

# Login 
@app.route('/login', methods=["GET", "POST"])
def login():

    error_message = None
    session.clear()

    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        # Query the user by username
        user = User.query.filter_by(username=username).first()

        if user:
            # If user with the provided username exists
            if check_password_hash(user.password, password):
                # If passwords match, log in the user
                session['user_id'] = user.id
                flash('Login successful!', 'success')
                return redirect("/")
            else:
                error_message = 'Invalid password'
                return render_template("login.html", error_message=error_message)
        else:
            # If user with the provided username does not exist, let the user know
            error_message = 'User not found'
            return render_template("login.html", error_message=error_message)
    return render_template("login.html", error_message=error_message)

# Log out
@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

# Play a maze
@app.route('/play' , methods=["GET", "POST"])
def play():
    # Request should be a post request, choosing a difficult type
    if(request.method == "POST"):
        difficulty = request.form.get("difficulty")
        print(f"maze-{difficulty}.html")
        maze = create_maze(difficulty)
        # Render maze with the proper difficulty
        return render_template(f"maze_{difficulty}.html", maze=maze)
    else:
        return "error"

# Run the app on port 5000
if __name__ == "__main__":
   app.run(port=5000)
