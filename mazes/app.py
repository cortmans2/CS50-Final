from flask import Flask, render_template, request, session, redirect
from sqlalchemy import create_engine, Column, Integer, String, Sequence
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import uuid

app = Flask(__name__, template_folder='templates')

def generate_uuid():
    return str(uuid.uuid4())


@app.route('/' , methods=["GET"])
def index():
    return render_template("index.html")

@app.route('/login', methods=["GET", "POST"])
def login():
    #session.clear()
    # User reached route via POST (as by submitting a form via POST)
    #if request.method == "POST":
        # Ensure username was submitted
        #if not request.form.get("username"):
            #return "error"

        # Ensure password was submitted
        #elif not request.form.get("password"):
            #return "error"

        # Query database for username
        #rows = db.execute(
        #    "SELECT * FROM users WHERE username = ?", request.form.get("username")
        #)

        # Ensure username exists and password is correct
        #if len(rows) != 1 or not check_password_hash(
        #    rows[0]["hash"], request.form.get("password")
        #):
        #    return "error"

        # Remember which user has logged in
        #session["user_id"] = rows[0]["id"]

        # Redirect user to home page

    # User reached route via GET (as by clicking a link or via redirect)
    return render_template("login.html")

@app.route('/play/small')
def small():
    return render_template("maze-small.html")

@app.route('/play/medium')
def small():
    return render_template("maze-medium.html")

@app.route('/play/large')
def small():
    return render_template("maze-large.html")

if __name__ == "__main__":
   print("reached")
   app.run(port=5000)
