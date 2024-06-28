from flask import Flask, jsonify, request, abort
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

tareas = []

@app.route('/tareas', methods = ['GET'])
def getTareas():
    return jsonify(tareas)

@app.route('/tareas/<int:idTarea>', methods=['GET'])
def getTarea(idTarea):
    tarea = next((tarea for tarea in tareas if tarea['id'] == idTarea), None)
    if tarea is None:
        abort(404)
    return jsonify(tarea)

@app.route('/tareas', methods = ['POST'])
def createTarea():
    if not request.json or not 'titulo' in request.json:
        abort(400)
    tarea = {
        'id': tareas[-1]['id'] + 1 if tareas else 1,
        'titulo': request.json['titulo'],
        'descripcion': request.json.get('descripcion', ""),
    }
    tareas.append(tarea)
    return jsonify(tarea), 201

@app.route('/tareas/<int:idTarea>', methods = ['PUT'])
def editTarea(idTarea):
    tarea = next((tarea for tarea in tareas if tarea['id'] == idTarea), None)
    if tarea is None:
        abort(400)
    if not request.json:
        abort(400)
    if 'titulo' in request.json and type(request.json['titulo']) is not str:
        abort(400)
    if 'descripcion' in request.json and type(request.json['descripcion']) is not str:
        abort(400)
    tarea['titulo'] = request.json.get('titulo', tarea['titulo'])
    tarea['descripcion'] = request.json.get('descripcion', tarea['descripcion'])
    return jsonify(tarea)

@app.route('/tareas/<int:idTarea>', methods = ['DELETE'])
def deleteTarea(idTarea):
    tarea = next((tarea for tarea in tareas if tarea['id'] == idTarea), None)
    if tarea is None:
        abort(404)
    tareas.remove(tarea)
    return jsonify({'result': True})

if __name__ == "__main__":
    app.run(debug = True)