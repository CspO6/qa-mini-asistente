import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from PyPDF2 import PdfReader

UPLOAD_DIR = "uploaded_files"

def search_query(q: str):
    results = []
    q_lower = q.lower()
    fragments = []
    sources = []

    if not os.path.exists(UPLOAD_DIR):
        return []

    for file in os.listdir(UPLOAD_DIR):
        path = os.path.join(UPLOAD_DIR, file)

        try:
            text = ""
            if file.endswith(".pdf"):
                reader = PdfReader(path)
                text = "\n".join([page.extract_text() or "" for page in reader.pages])
            elif file.endswith(".txt"):
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    text = f.read()

            text_lower = text.lower()
            start = 0
            while True:
                pos = text_lower.find(q_lower, start)
                if pos == -1:
                    break

                snippet_start = max(0, pos - 100)
                snippet_end = min(len(text), pos + len(q) + 200)
                snippet = text[snippet_start:snippet_end].strip().replace("\n", " ")

                fragments.append(snippet)
                sources.append(file)

                start = pos + len(q)

        except Exception as e:
            print(f"Error leyendo {file}: {e}")

    if fragments:
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform([q] + fragments)
        query_vec = tfidf_matrix[0:1]
        frag_vecs = tfidf_matrix[1:]
        scores = cosine_similarity(query_vec, frag_vecs)[0]

        for frag, src, score in zip(fragments, sources, scores):
            results.append({
                "document": src,
                "fragment": frag + "...",
                "score": round(float(score), 3)
            })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results

def answer_question(question: str):
    results = search_query(question)
    if not results:
        return {
            "answer": "No se encuentra la información en los documentos cargados.",
            "citations": []
        }

    top_fragments = [r["fragment"] for r in results[:3]]  
    context = " ".join(top_fragments)

    return {
        "answer": f"Según los documentos:\n{context}",
        "citations": [r["document"] for r in results]
    }
