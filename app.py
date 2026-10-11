import os

from flask import Flask, render_template_string
from models import db, init_extensions
from models import Plan, PlanTarget, KPI, Performance


def create_app():
    app = Flask(__name__)
app.config.from_object("config.Config")
    # Application configuration
    app.config["SECRET_KEY"] = os.environ.get(
        "SECRET_KEY",
        "change-this-before-production"
    )

    database_url = os.environ.get("DATABASE_URL")

    if database_url:
        # Compatibility with PostgreSQL URLs provided by some hosts.
        if database_url.startswith("postgres://"):
            database_url = database_url.replace(
                "postgres://",
                "postgresql://",
                1
            )

        app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    else:
        # Local development database.
        app.config["SQLALCHEMY_DATABASE_URI"] = (
            "sqlite:///kirkos_lcppme.db"
        )

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    init_extensions(app)

    HTML = """
    <!DOCTYPE html>
    <html lang="am">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport"
              content="width=device-width, initial-scale=1.0">

        <title>Kirkos-LCPPME Dashboard</title>

        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f1f5f9;
                margin: 0;
                color: #1e293b;
            }

            header {
                background: #12345a;
                color: white;
                padding: 22px 16px;
            }

            header h2 {
                margin: 0 0 8px;
            }

            main {
                padding: 18px;
                max-width: 1000px;
                margin: auto;
            }

            .card {
                background: white;
                padding: 20px;
                margin-bottom: 16px;
                border-radius: 12px;
                box-shadow: 0 2px 8px #00000012;
            }

            .stats {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
            }

            .number {
                font-size: 28px;
                font-weight: bold;
                color: #12345a;
            }

            a {
                display: inline-block;
                background: #12345a;
                color: white;
                padding: 12px 16px;
                text-decoration: none;
                border-radius: 8px;
                margin: 4px 0;
            }

            @media (max-width: 480px) {
                .stats {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    </head>

    <body>
        <header>
            <h2>Kirkos-LCPPME</h2>

            <div>
                Legal Compliance Planning, Monitoring
                &amp; Evaluation System
            </div>

            <p>Kirkos Sub-City Small Taxpayers Sub-Office</p>
        </header>

        <main>
            <div class="card">
                <h3>Dashboard | ዋና ገጽ</h3>
                <p>
                    የዕቅድ፣ የክንውንና የግምገማ አስተዳደር
                </p>
            </div>

            <div class="stats">
                <div class="card">
                    <div>Total Plans | ጠቅላላ ዕቅዶች</div>
                    <div class="number">{{ total_plans }}</div>
                </div>

                <div class="card">
                    <div>Performance | አፈጻጸም</div>
                    <div class="number">
                        {{ "%.1f"|format(performance_percent) }}%
                    </div>
                </div>

                <div class="card">
                    <div>Recorded KPIs | የተመዘገቡ KPIዎች</div>
                    <div class="number">{{ total_kpis }}</div>
                </div>

                <div class="card">
                    <div>Performance Records | የክንውን መዝገቦች</div>
                    <div class="number">{{ total_performances }}</div>
                </div>
            </div>

            <div class="card">
                <h3>System Modules | የስርዓቱ ክፍሎች</h3>

                <a href="/plans">Annual Plans / ዕቅድ</a>
                <a href="/performance">
                    Monthly Performance / ክንውን
                </a>
                <a href="/reports">Reports / ሪፖርት</a>
            </div>
        </main>
    </body>
    </html>
    """

    @app.route("/")
    def dashboard():
        total_plans = Plan.query.count()
        total_kpis = KPI.query.count()
        total_performances = Performance.query.count()

        approved_records = Performance.query.filter_by(
            status="Approved"
        ).all()

        total_actual = sum(
            record.monthly_actual
            for record in approved_records
        )

        total_target = sum(
            record.target.target_value
            for record in approved_records
            if record.target is not None
        )

        if total_target > 0:
            performance_percent = (
                total_actual / total_target
            ) * 100
        else:
            performance_percent = 0

        return render_template_string(
            HTML,
            total_plans=total_plans,
            total_kpis=total_kpis,
            total_performances=total_performances,
            performance_percent=performance_percent
        )

    @app.route("/plans")
    def plans():
        plans_list = Plan.query.order_by(
            Plan.id.desc()
        ).all()

        rows = ""

        for plan in plans_list:
            rows += f"""
            <tr>
                <td>{plan.fiscal_year}</td>
                <td>{plan.title}</td>
                <td>{plan.status}</td>
            </tr>
            """

        return f"""
        <h2>Annual Plans | ዓመታዊ ዕቅዶች</h2>

        <table border="1" cellpadding="8" cellspacing="0">
            <tr>
                <th>Fiscal Year</th>
                <th>Plan Title</th>
                <th>Status</th>
            </tr>
            {rows}
        </table>

        <p><a href="/">Back to Dashboard</a></p>
        """

    @app.route("/performance")
    def performance():
        records = Performance.query.order_by(
            Performance.id.desc()
        ).limit(100).all()

        rows = ""

        for record in records:
            rows += f"""
            <tr>
                <td>{record.fiscal_year}</td>
                <td>{record.month}</td>
                <td>{record.monthly_actual}</td>
                <td>{record.status}</td>
            </tr>
            """

        return f"""
        <h2>Monthly Performance | ወርሃዊ ክንውን</h2>

        <table border="1" cellpadding="8" cellspacing="0">
            <tr>
                <th>Fiscal Year</th>
                <th>Month</th>
                <th>Actual</th>
                <th>Status</th>
            </tr>
            {rows}
        </table>

        <p><a href="/">Back to Dashboard</a></p>
        """

    @app.route("/reports")
    def reports():
        total_plans = Plan.query.count()
        total_kpis = KPI.query.count()
        total_performances = Performance.query.count()

        return f"""
        <h2>Reports | ሪፖርት</h2>

        <p>Total Plans: {total_plans}</p>
        <p>Total KPIs: {total_kpis}</p>
        <p>Total Performance Records: {total_performances}</p>

        <p><a href="/">Back to Dashboard</a></p>
        """

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=False)