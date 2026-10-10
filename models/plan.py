from datetime import datetime
from models import db


class KPI(db.Model):
    __tablename__ = "kpi"

    id = db.Column(db.Integer, primary_key=True)

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

    code = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)

    measurement_unit = db.Column(db.String(50), nullable=False)
    measurement_type = db.Column(
        db.String(50),
        nullable=False,
        default="Count"
    )

    calculation_method = db.Column(db.String(100))

    tracks_monthly = db.Column(db.Boolean, default=True)
    tracks_cumulative = db.Column(db.Boolean, default=True)
    evidence_required = db.Column(db.Boolean, default=True)

    source_sheet = db.Column(db.String(150))
    status = db.Column(db.String(30), default="Active")

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    targets = db.relationship(
        "PlanTarget",
        backref="kpi",
        lazy=True
    )