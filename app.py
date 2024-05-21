from flask import Flask, flash, jsonify, render_template, request, redirect, url_for, session
import mysql.connector
from flask_bcrypt import Bcrypt
import smtplib
import jwt
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import secrets


connection = mysql.connector.connect(host='localhost',port='3306',database='typifast',user='root',password='')
Cursor = connection.cursor()

app = Flask(__name__)

bcrypt = Bcrypt(app)

app.secret_key = "typifastsecretkey"
ADMIN_EMAIL = 'admin@root.root'
ADMIN_PASSWORD = 'admin123'

EMAIL_ADDRESS = 'smtp.gmail.com'
EMAIL_PASSWORD = 'smtp12333321'  
SECRET_KEY = secrets.token_urlsafe(32)
payload = {'some': 'payload'}


@app.route('/')
def index():
    if 'pseudo' in session:
        return render_template('index.html', logged_in=True)
    else:
        return render_template('index.html', logged_in=False)
   
   
   
@app.route('/forgetpass', methods=['GET', 'POST'])
def forgetpass():
    if request.method == 'POST':
        email = request.form.get('email')
        print(f'Received email: {email}')  # Debug statement
        if not email:
            flash('Please enter your email address', 'error')
            return redirect(url_for('forgetpass'))

        Cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = Cursor.fetchone()
        if user:
            print(f'User found: {user}')  # Debug statement
            token = jwt.encode({
                'user_id': user[0],
                'exp': datetime.utcnow() + timedelta(hours=1)
            }, SECRET_KEY, algorithm='HS256')

            reset_link = url_for('reset_password', token=token, _external=True)
            print(f'Reset link: {reset_link}')  # Debug statement

            msg = MIMEMultipart()
            msg['From'] = EMAIL_ADDRESS
            msg['To'] = email
            msg['Subject'] = 'Password Reset Request'

            body = f'Click the link to reset your password: {reset_link}'
            msg.attach(MIMEText(body, 'plain'))

            try:
                with smtplib.SMTP('louati773.gmail.com', 587) as server:
                    server.starttls()
                    server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
                    server.sendmail(EMAIL_ADDRESS, email, msg.as_string())
                flash('Password reset link has been sent to your email address', 'success')
            except Exception as e:
                flash(f'Error sending email: {str(e)}', 'error')

            return render_template('passforget/confirmation.html', email=email)
        else:
            flash('No account found with that email address', 'error')
            return redirect(url_for('forgetpass'))
    return render_template('passforget/forgetpass.html')

@app.route('/reset-password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = decoded_token['user_id']
    except jwt.ExpiredSignatureError:
        flash('The token has expired', 'error')
        return redirect(url_for('forgetpass'))
    except jwt.InvalidTokenError:
        flash('Invalid token', 'error')
        return redirect(url_for('forgetpass'))

    if request.method == 'POST':
        new_password = request.form.get('password')
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')

        Cursor.execute("UPDATE users SET password = %s WHERE id = %s", (hashed_password, user_id))
        connection.commit()

        flash('Your password has been updated', 'success')
        return redirect(url_for('connexion'))

    return render_template('passforget/reset_password.html', logged_in=False)
@app.route('/jeu', methods=['GET', 'POST'])
def testvit():
    pseudo = session.get('pseudo', None)
    if request.method == 'POST':
        if 'pseudo' in session:
            data = request.json
            user_pseudo = session['pseudo']
            
            # Fetch user_id from users table
            Cursor.execute("SELECT id FROM users WHERE pseudo = %s", (user_pseudo,))
            user_id = Cursor.fetchone()[0]
            
            wpm = data.get('wpm')
            accuracy = data.get('accuracy')  # assuming accuracy is passed in the JSON
            
            try:
                Cursor.execute("INSERT INTO jeu (user_id, user_pseudo, wpm, accuracy) VALUES (%s, %s, %s, %s)", (user_id, user_pseudo, wpm, accuracy))
                connection.commit()
                return jsonify({"message": "Game data saved successfully"}), 201
            except mysql.connector.Error as error:
                return jsonify({"error": str(error)}), 500
        else:
            return jsonify({"error": "User not authenticated"}), 401

    return render_template('testvitesse.html', pseudo=pseudo, logged_in= True)
@app.route('/save_game_data', methods=['POST'])
def save_game_data():
    if 'pseudo' in session:
        data = request.json
        user_pseudo = session['pseudo']
        
        Cursor.execute("SELECT id FROM users WHERE pseudo = %s", (user_pseudo,))
        user_id = Cursor.fetchone()[0]
        
        wpm = data.get('wpm')
        accuracy = data.get('accuracy') 
        
        try:
            Cursor.execute("INSERT INTO game (user_id, user_pseudo, wpm, accuracy) VALUES (%s, %s, %s, %s)", (user_id, user_pseudo, wpm, accuracy))
            connection.commit()
            return jsonify({"message": "Game data saved successfully"}), 201
        except mysql.connector.Error as error:
            return jsonify({"error": str(error)}), 500
    else:
        return jsonify({"error": "User not authenticated"}), 401


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        nom = request.form['nom']
        prenom = request.form['prenom']
        pseudo = request.form['pseudo']
        email = request.form['email']
        password = request.form['password']
        
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        
        Cursor.execute("SELECT * FROM users WHERE pseudo = %s", (pseudo,))
        existing_user = Cursor.fetchone()
        if existing_user:
            return "Pseudo already exists! Please choose a different one."
        else:
            Cursor.execute("INSERT INTO users (nom, prenom, pseudo, email, password) VALUES (%s, %s, %s, %s, %s)", (nom, prenom, pseudo, email, hashed_password))
            connection.commit()
            return redirect(url_for('connexion'))
    return render_template('inscription.html', logged_in=False)

@app.route('/connexion', methods=['GET', 'POST'])
def connexion():
    if request.method == 'POST':
        pseudo = request.form['pseudo']
        password = request.form['password']
        if pseudo == ADMIN_EMAIL and bcrypt.check_password_hash(bcrypt.generate_password_hash(ADMIN_PASSWORD), password):
            session['pseudo'] = pseudo
            session['admin'] = True
            flash('You have been logged in as admin.', 'success')
            return redirect(url_for('admin_dashboard'))
        else:
            Cursor.execute("SELECT * FROM users WHERE pseudo = %s", (pseudo,))
            user = Cursor.fetchone()
            if user:
                hashed_password = user[5] 
                if bcrypt.check_password_hash(hashed_password, password):
                    session['pseudo'] = pseudo
                    flash('You have been successfully logged in.', 'success')
                    return redirect(url_for('index')) 
                else:
                    flash('Invalid password! Please try again.', 'error')
            else:
                flash('User does not exist! Please register.', 'error')

    return render_template('connexion.html', logged_in=False)

@app.route('/dashboard')
def admin_dashboard():
    if 'admin' not in session:
        flash('You need to log in as admin to access this page.', 'error')
        return redirect(url_for('connexion'))

    return render_template('dashboard.html', logged_in=True)

@app.route('/login_success')
def login_success():
    if 'pseudo' in session:
        current_level = 3
        advancement_percentage = 75  
        highest_speed = 80  
        moyen_speed = 60  

        return render_template('loginsuccess.html', current_level=current_level, advancement_percentage=advancement_percentage, highest_speed=highest_speed, moyen_speed=moyen_speed, logged_in=True)
    else:
        return redirect(url_for('connexion'))

@app.route('/testrapid')
def test_vitesse_clavier():
    return render_template('testrapide.html')

@app.route('/contact')
def contact():
    if 'pseudo' in session:
        return render_template('contactus.html', logged_in=True)
    else:
        return render_template('contactus.html', logged_in=False)

@app.route('/view-responses')
def view_responses():
    if 'pseudo' not in session:
        flash('You need to log in to access this page.', 'error')
        return redirect(url_for('connexion'))

    # Get the user's email from their session pseudo
    Cursor.execute("SELECT email FROM users WHERE pseudo = %s", (session['pseudo'],))
    user_email = Cursor.fetchone()[0]
    
    Cursor.execute("SELECT subject, response, created_at FROM response WHERE email = %s ORDER BY created_at DESC", (user_email,))
    responses = Cursor.fetchall()

    return render_template('view_responses.html', responses=responses, logged_in=True)


@app.route('/info')
def info():
     return render_template('coursinfo.html', logged_in=True)


def fetch_user_performance(pseudo, level):
    try:
        Cursor.execute("SELECT accuracy FROM user_performance WHERE pseudo = %s AND level = %s", (pseudo, level))
        user_performance = Cursor.fetchone()
        if user_performance:
            return user_performance[0] 
        else:
            return None
    except mysql.connector.Error as error:
        print("Error fetching user performance:", error)
        return None



@app.route('/level')
def level():
    return render_template('level.html')

@app.route('/test')
def test():
    return render_template('testcertif.html', logged_in= True)
@app.route('/save-stats', methods=['POST'])
def save_stats():
    if 'pseudo' in session:
        data = request.json
        wpm = data['wpm']
        cpm = data['cpm']
        accuracy = data['accuracy']
        duration_seconds = data['duration_seconds']
        weak_characters = data['weak_characters']

        try:
            Cursor.execute("INSERT INTO stats (pseudo, wpm, cpm, accuracy, duration_seconds, weak_characters) VALUES (%s, %s, %s, %s, %s, %s)",
                           (session['pseudo'], wpm, cpm, accuracy, duration_seconds, ','.join(weak_characters)))
            connection.commit()
            return jsonify({'message': 'Stats saved successfully'}), 200
        except mysql.connector.Error as error:
            return jsonify({'error': str(error)}), 500
    else:
        return jsonify({'error': 'User not authenticated'}), 401
    

@app.route('/save_test_data', methods=['POST'])
def save_test_data():
    if 'pseudo' in session:
        data = request.json
        wpm = data['wpm']
        accuracy = data['accuracy']

        Cursor.execute("SELECT id FROM users WHERE pseudo = %s", (session['pseudo'],))
        user_id = Cursor.fetchone()[0]  
        
        try:
            Cursor.execute("INSERT INTO TEST (id_user, wpm, accuracy) VALUES (%s, %s, %s)", (user_id, wpm, accuracy))
            connection.commit()
            return jsonify({'message': 'Test data saved successfully'}), 200
        except mysql.connector.Error as error:
            return jsonify({'error': str(error)}), 500
    else:
        return jsonify({'error': 'User not authenticated'}), 401



@app.route('/save-performance', methods=['POST'])
def save_performance():
    if 'pseudo' in session:
        data = request.json
        wpm = data['wpm']
        accuracy = data['accuracy']
        duration_seconds = data['duration_seconds']
        try:
            Cursor.execute("INSERT INTO stats (pseudo, wpm, accuracy, duration_seconds) VALUES (%s, %s, %s, %s)",
                           (session['pseudo'], wpm, accuracy, duration_seconds))
            connection.commit()
            return jsonify({'message': 'Performance data saved successfully'}), 200
        except mysql.connector.Error as error:
            return jsonify({'error': str(error)}), 500
    else:
        return jsonify({'error': 'User not authenticated'}), 401


@app.route('/logout')
def logout():
    session.pop('pseudo', None)
    return redirect(url_for('connexion'))


@app.route('/profile')
def profile():
    if 'pseudo' not in session:
        return redirect(url_for('connexion'))
    Cursor.execute("SELECT nom, prenom, pseudo, email FROM users WHERE pseudo = %s", (session['pseudo'],))
    user_data = Cursor.fetchone()
    return render_template('profil.html', user=user_data, logged_in=True)

@app.route('/modifyprofile', methods=['GET', 'POST'])
def modifyprofile():
    if 'pseudo' not in session:
        return redirect(url_for('connexion'))
    
    Cursor.execute("SELECT nom, prenom, pseudo, email FROM users WHERE pseudo = %s", (session['pseudo'],))
    user_data = Cursor.fetchone()
    
    if request.method == 'POST':
        # Get form data
        nom = request.form['nom']
        prenom = request.form['prenom']
        pseudo = request.form['pseudo']
        Cursor.execute("UPDATE users SET nom = %s, prenom = %s, pseudo = %s WHERE pseudo = %s", (nom, prenom, pseudo, session['pseudo']))
        connection.commit()
        session['pseudo'] = pseudo    
        return redirect(url_for('profile'))
    return render_template('modifyprofile.html', user=user_data, logged_in=True)

@app.route('/typing_course')
def typing_course():
    return render_template('typing_cours.html', logged_in=True)

@app.route('/save-statistics', methods=['POST'])
def save_statistics():
    if 'pseudo' in session:
        data = request.json
        wpm = data['wpm']
        cpm = data['cpm']
        accuracy = data['accuracy']
        mistakes = data['mistakes']
        
        # Retrieve user's ID from the session
        Cursor.execute("SELECT id FROM users WHERE pseudo = %s", (session['pseudo'],))
        user_id = Cursor.fetchone()[0]
        
        try:
            Cursor.execute("INSERT INTO stats (user_id, wpm, cpm, accuracy, nb_mistakes) VALUES (%s, %s, %s, %s, %s)",
                           (user_id, wpm, cpm, accuracy, mistakes))
            connection.commit()
            return jsonify({"message": "Statistics saved successfully"}), 200
        except Exception as e:
            print(e)
            connection.rollback()
            return jsonify({"error": "Failed to save statistics"}), 500
    return jsonify({"error": "User not logged in"}), 401


@app.route('/get-users')
def get_users():
    try:
        Cursor.execute("SELECT nom, prenom FROM users")
        users = Cursor.fetchall()
        user_list = [{'nom': user[0], 'prenom': user[1]} for user in users]
        return jsonify({'users': user_list}), 200
    except mysql.connector.Error as error:
        return jsonify({'error': str(error)}), 500

@app.route('/get-platform-stats')
def get_platform_stats():
    try:
        Cursor.execute("SELECT COUNT(*) FROM users")
        total_users = Cursor.fetchone()[0]        
        return jsonify({'total_users': total_users}), 200
    except mysql.connector.Error as error:
        return jsonify({'error': str(error)}), 500

@app.route('/add-admin', methods=['POST'])
def add_admin():
    data = request.get_json()
    email = data.get('admin-email')
    password = data.get('admin-password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    try:
        Cursor.execute("INSERT INTO admins (email, password) VALUES (%s, %s)", (email, hashed_password))
        connection.commit()
        return jsonify({'message': 'Admin added successfully'}), 200
    except mysql.connector.Error as error:
        return jsonify({'error': str(error)}), 500


@app.route('/submit-message', methods=['POST'])
def submit_message():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('message')

    if not name or not email or not subject or not message:
        return jsonify({'error': 'All fields are required'}), 400

    try:
        Cursor.execute("INSERT INTO messages (name, email, subject, message) VALUES (%s, %s, %s, %s)",
                       (name, email, subject, message))
        connection.commit()
        return jsonify({'message': 'Message submitted successfully'}), 200
    except mysql.connector.Error as error:
        return jsonify({'error': str(error)}), 500

@app.route('/get-messages', methods=['GET'])
def get_messages():
    try:
        Cursor.execute("SELECT name, email, subject, message, created_at FROM messages ORDER BY created_at DESC")
        messages = Cursor.fetchall()
        messages_list = []
        for message in messages:
            messages_list.append({
                'name': message[0],
                'email': message[1],
                'subject': message[2],
                'message': message[3],
                'created_at': message[4].strftime('%Y-%m-%d %H:%M:%S')
            })
        return jsonify({'messages': messages_list})
    except mysql.connector.Error as error:
        return jsonify({'error': str(error)}), 500

@app.route('/save-response', methods=['POST'])
def save_response():
    try:
        data = request.json
        email = data['email']
        subject = data['subject']
        response = data['response']
        Cursor.execute("INSERT INTO response (email, subject, response) VALUES (%s, %s, %s)", (email, subject, response))
        connection.commit()
        return jsonify({'message': 'Votre reponse est envoyé'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

