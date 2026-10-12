import os
from datetime import datetime

from flask import (
    Flask,
    render_template_string,
    request,
    redirect,
    url_for,
    flash,
)

from models import (
    db,
    init_extensions,
    Plan,
    WorkProcess,
    Team,
    KPI,
    Performance,
)


def seed_initial_data():
    """Create the three processes and their nine teams if missing."""

    processes_data = [
        {
            "code": "TII",
            "name": "የታክስ ኢንተለጀንስ እና ምርመራ",
            "teams": [
                ("TII-01", "የታክስ ኢንተለጀንስ እና ኦፕሬሽን አፈፃፀም"),
                ("TII-02", "ኢንቨስትጌሽን ኦዲት"),
                ("TII-03", "የጥቆማ አቀባበል እና ወሮታ አበል ክፍያ"),
            ],
        },
        {
            "code": "TES",
            "name": "የታክስ ከፋዮች ትምህርት፣ ድጋፍና የሕግ ተገዥነት ስጋት ስራ አመራር",
            "teams": [
                ("TES-01", "የታክስ ከፋዮች ትምህርትና ድጋፍ ቡድን"),
                ("TES-02", "የታክስ ከፋዮች የሕግ ተገዥነት ስጋት ስራ አመራር ቡድን"),
            ],
        },
        {
            "code": "TI",
            "name": "የታክስ መረጃ",
            "teams": [
                ("TI-01", "የደረሰኝና ሽያጭ መመዝገቢያ መሣሪያ አስተዳደር ቡድን"),
                ("TI-02", "የደረሰኝና ሽያጭ መመዝገቢያ መሣሪያ አጠቃቀም ቁጥጥር ቡድን"),
                ("TI-03", "የገበያ ጥናትና ሶስተኛ ወገን መረጃ አሰባሰብ"),
                ("TI-04", "የታክስ ከፋዮች ምዝገባና የግብር ማሻሻያ ቡድን"),
            ],
        },
    ]

    for process_data in processes_data:
        process = WorkProcess.query.filter_by(
            code=process_data["code"]
        ).first()

        if process is None:
            process = WorkProcess(
                code=process_data["code"],
                name=process_data["name"],
                status="Active",
            )
            db.session.add(process)
            db.session.flush()
        else:
            # Keep the stored names aligned with the configured names.
            process.name = process_data["name"]
            process.status = "Active"

        for team_code, team_name in process_data["teams"]:
            team = Team.query.filter_by(code=team_code).first()

            if team is None:
                team = Team(
                    code=team_code,
                    name=team_name,
                    process_id=process.id,
                    status="Active",
                )
                db.session.add(team)
            else:
                team.name = team_name
                team.process_id = process.id
                team.status = "Active"

    db.session.commit()


def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    app.config["SECRET_KEY"] = (
    os.environ.get("SECRET_KEY")
    or app.config.get("SECRET_KEY")
    or "temporary-development-key-change-this"
)

    database_url = os.environ.get("DATABASE_URL")
    if database_url:
        if database_url.startswith("postgres://"):
            database_url = database_url.replace(
                "postgres://", "postgresql://", 1
            )
        app.config["SQLALCHEMY_DATABASE_URI"] = database_url

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    init_extensions(app)

    with app.app_context():
        db.create_all()
        seed_initial_data()

    @app.route("/")
    def dashboard():
        total_plans = Plan.query.count()
        total_kpis = KPI.query.count()
        total_performances = Performance.query.count()

        approved_records = Performance.query.filter_by(
            status="Approved"
        ).all()

        total_actual = sum(
            record.monthly_actual or 0
            for record in approved_records
        )

        total_target = sum(
            record.target.target_value or 0
            for record in approved_records
            if record.target is not None
        )

        performance_percent = (
            total_actual / total_target * 100
            if total_target > 0 else 0
        )

        return render_template_string(
            """
            <!doctype html>
            <html lang="am">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>Kirkos-LCPPME Dashboard</title>
                <style>
                    body { font-family: Arial, sans-serif; background:#f1f5f9;
                           margin:0; color:#1e293b; }
                    header { background:#12345a; color:white; padding:22px 16px; }
                    main { padding:18px; max-width:1000px; margin:auto; }
                    .card { background:white; padding:20px; margin-bottom:16px;
                            border-radius:12px; box-shadow:0 2px 8px #00000012; }
                    .stats { display:grid; grid-template-columns:repeat(2,1fr);
                             gap:12px; }
                    .number { font-size:28px; font-weight:bold; color:#12345a; }
                    a { display:inline-block; background:#12345a; color:white;
                        padding:12px 16px; text-decoration:none;
                        border-radius:8px; margin:4px 0; }
                    @media(max-width:480px) {
                        .stats { grid-template-columns:1fr; }
                    }
                </style>
            </head>
            <body>
                <header>
                    <h2>Kirkos-LCPPME</h2>
                    <div>Legal Compliance Planning, Monitoring &amp; Evaluation System</div>
                    <p>Kirkos Sub-City Small Taxpayers Sub-Office</p>
                </header>
                <main>
                    <div class="card">
                        <h3>Dashboard | ዋና ገጽ</h3>
                        <p>የዕቅድ፣ የክንውንና የግምገማ አስተዳደር</p>
                    </div>
                    <div class="stats">
                        <div class="card">
                            <div>Total Plans | ጠቅላላ ዕቅዶች</div>
                            <div class="number">{{ total_plans }}</div>
                        </div>
                        <div class="card">
                            <div>Performance | አፈጻጸም</div>
                            <div class="number">{{ "%.1f"|format(performance_percent) }}%</div>
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
                        <a href="{{ url_for('plans') }}">Annual Plans / ዕቅድ</a>
                        <a href="{{ url_for('performance') }}">Monthly Performance / ክንውን</a>
                        <a href="{{ url_for('reports') }}">Reports / ሪፖርት</a>
                    </div>
                </main>
            </body>
            </html>
            """,
            total_plans=total_plans,
            total_kpis=total_kpis,
            total_performances=total_performances,
            performance_percent=performance_percent,
        )

    @app.route("/plans", methods=["GET", "POST"])
    def plans():
        if request.method == "POST":
            fiscal_year = request.form.get("fiscal_year", "").strip()
            title = request.form.get("title", "").strip()
            objective = request.form.get("objective", "").strip()
            process_id = request.form.get("process_id", type=int)
            team_id = request.form.get("team_id", type=int)
            start_date_text = request.form.get("start_date", "").strip()
            end_date_text = request.form.get("end_date", "").strip()

            if not fiscal_year or not title or not process_id:
                flash(
                    "የበጀት ዓመት፣ የዕቅድ ርዕስና የሥራ ሂደት ያስፈልጋሉ።",
                    "error",
                )
                return redirect(url_for("plans"))

            process = db.session.get(WorkProcess, process_id)
            if not process or process.status != "Active":
                flash("ትክክለኛ ንቁ የሥራ ሂደት ይምረጡ።", "error")
                return redirect(url_for("plans"))

            team = None
            if team_id:
                team = db.session.get(Team, team_id)
                if (
                    not team
                    or team.status != "Active"
                    or team.process_id != process.id
                ):
                    flash(
                        "ከተመረጠው የሥራ ሂደት ጋር የሚዛመድ ንቁ ቡድን ይምረጡ።",
                        "error",
                    )
                    return redirect(url_for("plans"))

            try:
                start_date = (
                    datetime.strptime(start_date_text, "%Y-%m-%d").date()
                    if start_date_text else None
                )
                end_date = (
                    datetime.strptime(end_date_text, "%Y-%m-%d").date()
                    if end_date_text else None
                )

                if start_date and end_date and end_date < start_date:
                    raise ValueError(
                        "የመጨረሻ ቀን ከመጀመሪያ ቀን በፊት መሆን የለበትም።"
                    )

                new_plan = Plan(
                    fiscal_year=fiscal_year,
                    title=title,
                    objective=objective or None,
                    process_id=process.id,
                    team_id=team.id if team else None,
                    start_date=start_date,
                    end_date=end_date,
                    status="Draft",
                )
                db.session.add(new_plan)
                db.session.commit()
                flash("ዕቅዱ በተሳካ ሁኔታ ተመዝግቧል።", "success")

            except ValueError as error:
                db.session.rollback()
                flash(str(error), "error")
            except Exception:
                db.session.rollback()
                app.logger.exception("Failed to save annual plan")
                flash(
                    "ዕቅዱን ማስቀመጥ አልተቻለም። የRender ሎግ ያረጋግጡ።",
                    "error",
                )

            return redirect(url_for("plans"))

        plans_list = Plan.query.order_by(Plan.id.desc()).all()
        processes = WorkProcess.query.filter_by(
            status="Active"
        ).order_by(WorkProcess.name).all()
        teams = Team.query.filter_by(
            status="Active"
        ).order_by(Team.name).all()

        return render_template_string(
            """
            <!doctype html>
            <html lang="am">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>ዓመታዊ ዕቅዶች</title>
                <style>
                    body { font-family:Arial,sans-serif; margin:20px;
                           background:#f4f7fb; color:#243247; }
                    .card { background:white; padding:18px; margin-bottom:20px;
                            border-radius:10px; box-shadow:0 2px 8px #0001; }
                    label { display:block; margin-top:12px; font-weight:bold; }
                    input,select,textarea,button { box-sizing:border-box; width:100%;
                        padding:10px; margin-top:5px; border:1px solid #ccd4df;
                        border-radius:5px; font-size:15px; }
                    button { margin-top:18px; background:#1457a6; color:white;
                             border:0; font-weight:bold; }
                    .table-wrap { overflow-x:auto; }
                    table { border-collapse:collapse; width:100%; background:white; }
                    th,td { border:1px solid #d9e0e8; padding:10px; text-align:left; }
                    th { background:#eaf0f8; }
                    .success { color:#137333; }
                    .error { color:#b3261e; }
                    a { color:#1457a6; }
                </style>
            </head>
            <body>
                <h2>ዓመታዊ ዕቅዶች | Annual Plans</h2>
                {% with messages = get_flashed_messages(with_categories=true) %}
                    {% for category, message in messages %}
                        <p class="{{ category }}">{{ message }}</p>
                    {% endfor %}
                {% endwith %}
                <div class="card">
                    <h3>አዲስ ዕቅድ መመዝገቢያ</h3>
                    <form method="post">
                        <label>የበጀት ዓመት</label>
                        <input name="fiscal_year" placeholder="ለምሳሌ 2019 ዓ.ም." required>
                        <label>የዕቅድ ርዕስ</label>
                        <input name="title" maxlength="255" required>
                        <label>የሥራ ሂደት</label>
                        <select name="process_id" required>
                            <option value="">-- ይምረጡ --</option>
                            {% for process in processes %}
                                <option value="{{ process.id }}">{{ process.code }} — {{ process.name }}</option>
                            {% endfor %}
                        </select>
                        <label>የቡድን ስም (አማራጭ)</label>
                        <select name="team_id">
                            <option value="">-- ያለ ቡድን --</option>
                            {% for team in teams %}
                                <option value="{{ team.id }}">{{ team.code }} — {{ team.name }}</option>
                            {% endfor %}
                        </select>
                        <label>ዓላማ</label>
                        <textarea name="objective" rows="3"></textarea>
                        <label>የመጀመሪያ ቀን</label>
                        <input type="date" name="start_date">
                        <label>የመጨረሻ ቀን</label>
                        <input type="date" name="end_date">
                        <button type="submit">ዕቅዱን አስቀምጥ | Save Plan</button>
                    </form>
                </div>
                <div class="card">
                    <h3>የተመዘገቡ ዕቅዶች</h3>
                    <div class="table-wrap">
                        <table>
                            <tr><th>የበጀት ዓመት</th><th>የዕቅድ ርዕስ</th>
                                <th>የሥራ ሂደት</th><th>ሁኔታ</th></tr>
                            {% for plan in plans_list %}
                                <tr>
                                    <td>{{ plan.fiscal_year }}</td>
                                    <td>{{ plan.title }}</td>
                                    <td>{{ plan.process.name if plan.process is defined else plan.process_id }}</td>
                                    <td>{{ plan.status }}</td>
                                </tr>
                            {% else %}
                                <tr><td colspan="4">እስካሁን የተመዘገበ ዕቅድ የለም።</td></tr>
                            {% endfor %}
                        </table>
                    </div>
                </div>
                <p><a href="{{ url_for('dashboard') }}">ወደ Dashboard ተመለስ</a></p>
            </body>
            </html>
            """,
            plans_list=plans_list,
            processes=processes,
            teams=teams,
        )

    @app.route("/performance")
    def performance():
        records = Performance.query.order_by(
            Performance.id.desc()
        ).limit(100).all()

        return render_template_string(
            """
            <!doctype html>
            <html lang="am">
            <head><meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>ወርሃዊ ክንውን</title></head>
            <body>
                <h2>Monthly Performance | ወርሃዊ ክንውን</h2>
                <table border="1" cellpadding="8" cellspacing="0">
                    <tr><th>Fiscal Year</th><th>Month</th><th>Actual</th><th>Status</th></tr>
                    {% for record in records %}
                    <tr><td>{{ record.fiscal_year }}</td><td>{{ record.month }}</td>
                        <td>{{ record.monthly_actual }}</td><td>{{ record.status }}</td></tr>
                    {% else %}
                    <tr><td colspan="4">የአፈጻጸም መዝገብ የለም።</td></tr>
                    {% endfor %}
                </table>
                <p><a href="{{ url_for('dashboard') }}">ወደ Dashboard ተመለስ</a></p>
            </body>
            </html>
            """,
            records=records,
        )

    @app.route("/reports")
    def reports():
        return render_template_string(
            """
            <!doctype html>
            <html lang="am">
            <head><meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>ሪፖርት</title></head>
            <body>
                <h2>Reports | ሪፖርት</h2>
                <p>ጠቅላላ ዕቅዶች: {{ total_plans }}</p>
                <p>ጠቅላላ KPIዎች: {{ total_kpis }}</p>
                <p>ጠቅላላ የአፈጻጸም መዝገቦች: {{ total_performances }}</p>
                <p><a href="{{ url_for('dashboard') }}">ወደ Dashboard ተመለስ</a></p>
            </body>
            </html>
            """,
            total_plans=Plan.query.count(),
            total_kpis=KPI.query.count(),
            total_performances=Performance.query.count(),
        )

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=False)