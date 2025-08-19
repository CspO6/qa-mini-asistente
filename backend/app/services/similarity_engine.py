from sklearn.feature_extraction.text import TfidfVectorizer

vectorizer = TfidfVectorizer()
documents = []
filenames = []
_tfidf_matrix = None

def set_tfidf_matrix(matrix):
    global _tfidf_matrix
    _tfidf_matrix = matrix

def get_tfidf_matrix():
    return _tfidf_matrix
