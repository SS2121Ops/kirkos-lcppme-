from datetime import datetime
from models import db


class WorkProcess(db.Model):
    __tablename__ = "work_process"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    code = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )

    name = db.Column(
        db.String(200),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=True
    )

    responsible_role = db.Column(
        db.String(100),
        nullable=True
    )

    status = db.Column(
        db.String(30),
        nullable=False,
        default="Active"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    def __repr__(self):
        return f"<WorkProcess {self.code}: {self.name}>"