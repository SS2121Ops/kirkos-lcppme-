from datetime import datetime
from models import db


class Performance(db.Model):
    __tablename__ = "performance"

    id = db.Column(db.Integer, primary_key=True)

    target_id = db.Column(
        db.Integer,
        db.ForeignKey("plan_target.id"),
        nullable=False
    )

    # የዚህ ወር እውነተኛ አፈጻጸም
    monthly_actual = db.Column(
        db.Float,
        nullable=False,
        default=0
    )

    # ከሐምሌ ጀምሮ ያለው ድምር አፈጻጸም
    cumulative_actual = db.Column(
        db.Float,
        nullable=False,
        default=0
    )

    # የወሩ ዕቅድ አፈጻጸም መቶኛ
    achievement_percent = db.Column(
        db.Float,
        nullable=False,
        default=0
    )

    # የድምር አፈጻጸም መቶኛ
    cumulative_achievement_percent = db.Column(
        db.Float,
        nullable=False,
        default=0
    )

    performance_date = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    month = db.Column(db.Integer, nullable=False)
    fiscal_year = db.Column(db.String(20), nullable=False)

    comment = db.Column(db.Text)

    source_sheet = db.Column(db.String(150))
    status = db.Column(
        db.String(30),
        nullable=False,
        default="Draft"
    )

    entered_by = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )

    submitted_by = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=True
    )

    submitted_at = db.Column(db.DateTime, nullable=True)

    reviewed_by = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=True
    )

    reviewed_at = db.Column(db.DateTime, nullable=True)

    approved_by = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=True
    )

    approved_at = db.Column(db.DateTime, nullable=True)

    review_comment = db.Column(db.Text, nullable=True)

    target = db.relationship(
        "PlanTarget",
        backref=db.backref("performances", lazy=True)
    )

    entered_user = db.relationship(
        "User",
        foreign_keys=[entered_by]
    )

    submitted_user = db.relationship(
        "User",
        foreign_keys=[submitted_by]
    )

    reviewed_user = db.relationship(
        "User",
        foreign_keys=[reviewed_by]
    )

    approved_user = db.relationship(
        "User",
        foreign_keys=[approved_by]
    )