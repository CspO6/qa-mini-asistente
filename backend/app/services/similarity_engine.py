from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
import os

# Variables globales
vectorizer = TfidfVectorizer()
documents = []
filenames = []
_tfidf_matrix = None

# Rutas de persistencia
PERSIST_DIR = "persist"
VECTORIZER_PATH = os.path.join(PERSIST_DIR, "vectorizer.pkl")
MATRIX_PATH = os.path.join(PERSIST_DIR, "tfidf_matrix.pkl")

# Crear carpeta persist/ si no existe
os.makedirs(PERSIST_DIR, exist_ok=True)

# Setter y getter del índice
def set_tfidf_matrix(matrix):
    global _tfidf_matrix
    _tfidf_matrix = matrix

def get_tfidf_matrix():
    return _tfidf_matrix

# Guardar índice y vectorizador
def save_index():
    joblib.dump(vectorizer, VECTORIZER_PATH)
    joblib.dump(_tfidf_matrix, MATRIX_PATH)

# Cargar índice desde disco
def load_index():
    global vectorizer, _tfidf_matrix
    if os.path.exists(VECTORIZER_PATH) and os.path.exists(MATRIX_PATH):
        vectorizer = joblib.load(VECTORIZER_PATH)
        _tfidf_matrix = joblib.load(MATRIX_PATH)
        return True
    return False

# Construir índice (si no se carga desde disco)
def build_index_from_documents(docs: list[str]):
    global documents, _tfidf_matrix
    documents = docs
    _tfidf_matrix = vectorizer.fit_transform(documents)
    save_index()
