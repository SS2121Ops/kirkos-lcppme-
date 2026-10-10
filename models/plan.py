from datetime import datetime
from models import db


class Plan(db.Model):
    __tablename__ = "plan"

    id = db.Column(db.Integer, primary_key=True)

    fiscal_year = db.Column(
        db.String(20),
        nullable=False
    )

    process_id = db.Column(
        db.Integer,
        db.ForeignKey("work_process.id"),
        nullable=False
    )

    team_id = db.Column(
        db.Integer,
        db.ForeignKey("team.id"),
        nullable=True
    )

    title = db.Column(
        db.String(255),
        nullable=False
    )

    objective = db.Column(db.Text)

    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)

    status = db.Column(
        db.String(30),
        nullable=False,
        default="Draft"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    targets = db.relationship(
        "PlanTarget",
        backref="plan",
        cascade="all, delete-orphan",
        lazy=True
    )


class PlanTarget(db.Model):
    __tablename__ = "plan_target"

    id = db.Column(db.Integer, primary_key=True)

    plan_id = db.Column(
        db.Integer,
        db.ForeignKey("plan.id"),
        nullable=False
    )

    kpi_id = db.Column(
        db.Integer,
        db.ForeignKey("kpi.id"),
        nullable=False
    )

    period = db.Column(
        db.String(30),
        nullable=False
    )

    month = db.Column(db.Integer)

    quarter = db.Column(db.String(10))

    target_value = db.Column(
        db.Float,
        nullable=False,
        default=0
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    performances = db.relationship(
        "Performance",
        backref="target",
        lazy=True
    )