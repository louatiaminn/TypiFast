#from curses import flash
#import dbm
from flask import Flask, render_template, request, redirect, url_for
from flask_bcrypt import Bcrypt

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://username:password@localhost/db_name'
bcrypt = Bcrypt(app)

#class User(db.Model):
  #  id = db.Column(db.Integer, primary_key=True)
   # username = db.Column(db.String(80), unique=True, nullable=False)
    #password = db.Column(db.String(120), nullable=False)

# db.create_all()

platform_info = {
    'platform_name': 'TYPIFAST',
    'platform_description': 'An attractive and informative platform.',
    # Other platform information...
}

@app.route('/')
def accueil():
    return render_template('index.html', platform_info=platform_info)




@app.route('/test')
def test_vitesse_clavier():
    return render_template('testrapide.html')

@app.route('/contact')
def contact():
    return render_template('contactus.html', platform_info=platform_info)

@app.route('/connexion', methods=['GET', 'POST'])
def connexion():
  #  if request.method == 'POST':
  #      username = request.form['username']
   #     password = request.form['password']

        # Retrieve the user from the database based on the provided username
       # user = User.query.filter_by(username=username).first()

       # if user and bcrypt.check_password_hash(user.password, password):
            # Successful login
            # Redirect the user to the dashboard or another page   return redirect(url_for('dashboard'))
       # else:
            # Incorrect username or password
        #    flash('Invalid username or password', 'error')
#
    # Render the login template
    return render_template('connexion.html')

@app.route('/inscription', methods=['GET', 'POST'])
def inscription():
    #if request.method == 'POST':
     #   username = request.form['username']
     #   password = bcrypt.generate_password_hash(request.form['password']'])
#def inscription():
    #if request.method == 'POST':
       # username = request.form['username']
     #   password = bcrypt.generate_password_hash(request.form['password']).decode('utf-8')

        # Create a new user and save it to the database
     #   new_user = User(username=username, password=password)
      #  dbm.session.add(new_user)
       # db.session.commit()

        # Reddecodeirect the user to the login page
    return render_template('inscription.html')



     #   new_user = User(username=username, password=password)
      #  db.session.add(new_user)
      #  db.session.commit()
 #   return render_template('inscription.html')

#@app.route('/dashboard')
#def dashboard        # Redirect theashboard()
    # Retrieve the user from the database based on the current user to the login session
   # user = User.query.filter_by(username=session[' page
 #   return redirect(url_for('connexion'))

    # Render the registrationusername']).first()

    # Render template
  #  return render_template('inscription.html')

#@app. the dashboard templateroute('/dashboard')
#def dashboard():
    # Retrieve the user from the
 #   return render_template('dashboard.html', user=user, platform_info=platform_info)

#if __name__ == ' database based on the current__main__':
#   app.run(debug=True)
 #session
#    user = User.query.```

#This code defines a Flask application with a SQLite database,filter_by(username=session['username']).first()

    # Render the dashboard template a simple user authentication system, and several routes for the platform. The `User` model is used to represent the users in the database,
 #   return render_ and the `bcrypt` library is used to hash the passwords before storing them in the database.

#The `platform_info` dictionary is used to store information about the platform, such as its name and description. This information can be usedtemplate('dashboard.html', in user=user, platform_info=platform_info)

if __name__ == '__main__':
    app.run(debug=True)