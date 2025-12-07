from flask import Flask, request, render_template_string
from PyPDF2 import PdfReader
import re

app = Flask(__name__)

PADRAO_BUNK_LB = re.compile(r'(\d{2,3}(?:/[A-Z])?)\s+(LB[1-4])\b')

# =========================
# FUNÇÃO DE LEITURA DO PDF
# =========================
def extrair_bunks_por_baleeira(file):
    reader = PdfReader(file)
    texto = " ".join(page.extract_text() or "" for page in reader.pages)
    texto = " ".join(texto.split())

    baleeiras = {"LB1": set(), "LB2": set(), "LB3": set(), "LB4": set()}

    for bunk, lb in PADRAO_BUNK_LB.findall(texto):
        baleeiras[lb].add(bunk)

    return baleeiras


def comparar_relatorios(pdf1, pdf2):
    dia1 = extrair_bunks_por_baleeira(pdf1)
    dia2 = extrair_bunks_por_baleeira(pdf2)

    resultado = {}

    for lb in ["LB1", "LB2", "LB3", "LB4"]:
        sumiram = sorted(dia1[lb] - dia2[lb])
        apareceram = sorted(dia2[lb] - dia1[lb])

        resultado[lb] = {
            "RETIRAR": sumiram,
            "ADICIONAR": apareceram
        }

    return resultado


# =========================
# PÁGINA PRINCIPAL
# =========================
@app.route("/", methods=["GET", "POST"])
def home():
    resultado = None

    if request.method == "POST":
        pdf_ontem = request.files.get("pdf_ontem")
        pdf_hoje = request.files.get("pdf_hoje")

        if pdf_ontem and pdf_hoje:
            resultado = comparar_relatorios(pdf_ontem, pdf_hoje)

    return render_template_string("""
<!DOCTYPE html>
<html>
<head>
    <title>PC Apps - Comparador</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f2f2f2;
            text-align: center;
            padding: 50px;
        }
        h1 {
            margin-bottom: 5px;
        }
        .subtitle {
            margin-top: 0;
            margin-bottom: 30px;
            color: #555;
        }
        .box {
            display: inline-block;
            background: white;
            padding: 25px;
            border-radius: 10px;
            margin: 15px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            width: 360px;
        }
        .box-icon {
            margin-bottom: 5px;
        }
        .box-icon img {
            width: 70px;
        }
        .box h3 {
            margin-top: 0;
        }
        input[type="file"] {
            margin-top: 10px;
        }
        button {
            margin-top: 20px;
            padding: 10px 25px;
            font-size: 16px;
            background: #0066ff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        button:hover {
            background: #0050c4;
        }
        table {
            margin: 30px auto 0 auto;
            background: white;
            border-collapse: collapse;
        }
        td, th {
            padding: 10px 20px;
            border: 1px solid black;
        }
        th {
            background: #e5e7eb;
        }
    </style>
</head>
<body>

<h1>PC Apps</h1>
<p class="subtitle">Comparador de Baleeiras</p>

<form method="POST" enctype="multipart/form-data">

    <div class="box">
        <div class="box-icon">
            <img src="/static/img/pdf.png" alt="PDF">
        </div>
        <h3>PDF de ONTEM</h3>
        <input type="file" name="pdf_ontem" required>
    </div>

    <div class="box">
        <div class="box-icon">
            <img src="/static/img/pdf.png" alt="PDF">
        </div>
        <h3>PDF de HOJE</h3>
        <input type="file" name="pdf_hoje" required>
    </div>

    <br>
    <button type="submit">Comparar Relatórios</button>
</form>

{% if resultado %}
<h2>Resultado da Comparação</h2>

<table>
<tr>
    <th>Baleeira</th>
    <th>RETIRAR</th>
    <th>ADICIONAR</th>
</tr>

{% for lb, dados in resultado.items() %}
<tr>
    <td>{{ lb }}</td>
    <td>
        {% if dados["RETIRAR"] %}
            {% for item in dados["RETIRAR"] %}
                {{ item }}<br>
            {% endfor %}
        {% else %}
            Nenhuma troca
        {% endif %}
    </td>
    <td>
        {% if dados["ADICIONAR"] %}
            {% for item in dados["ADICIONAR"] %}
                {{ item }}<br>
            {% endfor %}
        {% else %}
            Nenhuma troca
        {% endif %}
    </td>
</tr>
{% endfor %}
</table>

{% endif %}

</body>
</html>
""", resultado=resultado)


if __name__ == "__main__":
    app.run()
