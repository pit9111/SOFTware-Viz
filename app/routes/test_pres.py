from app.app import app, db
from Utils.all_struct import list_struct_dist
from flask import jsonify, render_template

@app.route('/test')
def test():
    return render_template("pages/test.html")

# Voilà 4 exercices de simple à difficile. Commente un maximum ton code !

# -------------
# Exercice 01 (facile) :
# -------------
#
# route -> Utils/scripts -> route
#
# Imprimer une liste distincte de toutes les structures dans la base de données
#

@app.route('/test/exo_1')
def exo_1():
    #fonction python (data)
    data = list_struct_dist(db)
    #template html
    return '<br>'.join(data)

# -------------
# Exercice 02 (facile) :
# -------------
#
# route -> Utils/scripts -> route
#
# Imprimer un dictionnaire avec en clé les identifiants des documents (halid)
# et en valeur une liste distincte des logiciels
#
# ex : {"hal-982369" : ["Python", "Pytorch", "Mass", "FCA"], ... }

# commenter le fichier DB / doc.py/doc_info_from_id et software.py/software_all_mentions

# -------------
# Exercice 03 (moyen) :
# -------------
#
# route -> Utils/scripts -> route -> static/templates/page
#
# Faire une page HTML (simple sans CSS, en blanc) avec une liste HTML des auteurs dans la base de données
#
# ex : <ul>
#           <li>Samuel Scalbert</li>
#           <li>Daniel Da Silva</li>
#      </ul>

# -------------
# Exercice 04 (moyen) :
# -------------
#
# route -> Utils/scripts -> route -> static/templates/page
#
# Permettre l'accès à une page HTML avec le bandeau de navigation sur le côté et du CSS (dans un autre fichier que style.css).
# La page web en question doit contenir une liste des titres des documents.
# (bonus) Ajouter un lien vers le document pour chaque titre (avec url_for).
#
