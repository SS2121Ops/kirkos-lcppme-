from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate

db = SQLAlchemy()
login_manager = LoginManager()
migrate = Migrate()

login_manager.login_view = "auth.login"
login_manager.login_message = "እባክዎ መጀመሪያ ይግቡ።"
login_manager.login_message_category = "warning"


def init_extensions(app):
    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)
from models.user import User
from models.process import WorkProcess
from models.team import Team
from models.kpi import KPI
from models.plan import Plan, PlanTarget
from models.performance import Performance