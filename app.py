from flask import Flask, render_template_string

app = Flask(__name__)

HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">
    <title>Kirkos-LCPPME</title>
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
            max-width: 900px;
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
        <div>Legal Compliance Planning, Monitoring
        & Evaluation System</div>
        <p>Kirkos Sub-City Small Taxpayers Sub-Office</p>
    </header>

    <main>
        <div class="card">
            <h3>Dashboard | ዋና ገጽ</h3>
            <p>የዕቅድ፣ የክንውንና የግምገማ አስተዳደር</p>
        </div>

        <div class="stats">
            <div class="card">
                <div>Total Plans</div>
                <div class="number">0</div>
                <div>ጠቅላላ ዕቅዶች</div>
            </div>
            <div class="card">
                <div>Performance</div>
                <div class="number">0%</div>
                <div>የአፈጻጸም መጠን</div>
            </div>
            <div class="card">
                <div>Open Findings</div>
                <div class="number">0</div>
                <div>ያልተፈቱ ግኝቶች</div>
            </div>
            <div class="card">
                <div>Corrective Actions</div>
                <div class="number">0</div>
                <div>የማስተካከያ እርምጃዎች</div>
            </div>
        </div>

        <div class="card">
            <h3>System Modules | የስርዓቱ ክፍሎች</h3>
            <a href="/plans">Annual Plans / ዕቅድ</a>
            <a href="/performance">Monthly Performance / ክንውን</a>
            <a href="/reports">Reports / ሪፖርት</a>
        </div>
    </main>
</body>
</html>
"""

@app.route("/")
def dashboard():
    return render_template_string(HTML)

@app.route("/plans")
def plans():
    return "<h2>Annual Plans / ዕቅድ</h2><p>ቀጣይ ደረጃ ላይ ይገነባል።</p>"

@app.route("/performance")
def performance():
    return "<h2>Monthly Performance / ወርሃዊ ክንውን</h2><p>ቀጣይ ደረጃ ላይ ይገነባል።</p>"

@app.route("/reports")
def reports():
    return "<h2>Reports / ሪፖርት</h2><p>ቀጣይ ደረጃ ላይ ይገነባል።</p>"

if __name__ == "__main__":
    app.run()