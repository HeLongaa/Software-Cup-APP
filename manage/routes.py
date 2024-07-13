from flask import render_template, request, redirect, url_for, flash, session
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Length
from werkzeug.security import generate_password_hash, check_password_hash
import json
from . import manage_bp
from config import configurations


class LoginForm(FlaskForm):
    username = StringField('用户名', validators=[DataRequired(), Length(min=2, max=20)])
    password = PasswordField('密码', validators=[DataRequired()])
    submit = SubmitField('登录')


def load_users():
    with open('users.json', 'r') as f:
        return json.load(f)


def save_users(users):
    with open('users.json', 'w') as f:
        json.dump(users, f)


@manage_bp.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        users = load_users()
        username = form.username.data
        password = form.password.data
        if username in users and check_password_hash(users[username], password):
            session['username'] = username
            flash('登录成功', 'success')
            return redirect(url_for('manage.index'))
        else:
            flash('用户名或密码错误', 'danger')
    return render_template('login.html', form=form)


@manage_bp.route('/logout')
def logout():
    session.pop('username', None)
    flash('您已退出登录', 'info')
    return redirect(url_for('manage.login'))


@manage_bp.route('/')
def index():
    if 'username' not in session:
        return redirect(url_for('manage.login'))
    return render_template('man_index.html', configurations=configurations)


@manage_bp.route('/view/<config_name>')
def view_config(config_name):
    if 'username' not in session:
        return redirect(url_for('manage.login'))
    config = configurations.get(config_name)
    if not config:
        flash('配置项不存在', 'danger')
        return redirect(url_for('manage.index'))
    return render_template('view_config.html', config_name=config_name, config=config)


@manage_bp.route('/edit/<config_name>', methods=['GET', 'POST'])
def edit_config(config_name):
    if 'username' not in session:
        return redirect(url_for('manage.login'))
    config = configurations.get(config_name)
    if not config:
        flash('配置项不存在', 'danger')
        return redirect(url_for('manage.index'))

    if request.method == 'POST':
        for key in config:
            config[key] = request.form.get(key)
        flash('配置项已更新', 'success')
        return redirect(url_for('manage.view_config', config_name=config_name))

    return render_template('edit_config.html', config_name=config_name, config=config)
