from datetime import datetime
from models import db


class Team(db.Model):
    __tablename__ = "team"

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

    process_id = db.Column(
        db.Integer,
        db.ForeignKey("work_process.id"),
        nullable=False
    )

    team_leader = db.Column(
        db.String(150),
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
        return f"<Team {self.code}: {self.name}>"