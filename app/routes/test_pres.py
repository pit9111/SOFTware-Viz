from app.app import app, db
from Utils.all_struct import list_struct_dist
from Utils.all_struct_exo2 import function_doc_software
from flask import jsonify, render_template
# Voilà 4 exercices de simple à difficile. Commente un maximum ton code !

@app.route('/exercice_test')
def exercice0_test():
    return '<br>'.join("Hello World")


# -------------
# Exercice 01 (facile) :
# -------------
#
# route -> Utils/scripts -> route
#
# Imprimer une liste distincte de toutes les structures dans la base de données
#

@app.route('/exercice_test/number_1')
def exercice1_list_struct():
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

@app.route('/exercice_test/number_2')
def exercice2_list_soft():
    #fonction python (data)
    data = function_doc_software(db)
    #template html
    return data

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
