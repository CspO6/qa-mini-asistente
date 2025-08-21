import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from PyPDF2 import PdfReader
from openai import OpenAI


api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY no está definido. ¿Cargaste el archivo .env correctamente?")

client = OpenAI(api_key=api_key)

UPLOAD_DIR = "uploaded_files"
ALLOWED_EXTENSIONS = {".pdf", ".txt"}

def load_all_documents():
    context = ""
    if not os.path.exists(UPLOAD_DIR):
        return context

    for file in os.listdir(UPLOAD_DIR):
        ext = os.path.splitext(file)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            continue

        path = os.path.join(UPLOAD_DIR, file)
        try:
            if file.endswith(".pdf"):
                reader = PdfReader(path)
                text = "\n".join([page.extract_text() or "" for page in reader.pages])
            elif file.endswith(".txt"):
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    text = f.read()

            context += f"\nDocumento: {file}\n{text.strip()}\n"

        except Exception as e:
            print(f"Error leyendo {file}: {e}")
            continue

    return context


def search_query(q: str):
    results = []
    q_lower = q.lower()
    fragments = []
    sources = []

    if not os.path.exists(UPLOAD_DIR):
        return []

    for file in os.listdir(UPLOAD_DIR):
        ext = os.path.splitext(file)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            continue

        path = os.path.join(UPLOAD_DIR, file)

        try:
            text = ""
            if file.endswith(".pdf"):
                reader = PdfReader(path)
                text = "\n".join([page.extract_text() or "" for page in reader.pages])
            elif file.endswith(".txt"):
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    text = f.read()

            if not text.strip():
                continue

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
            continue

    if fragments:
        try:
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
        except Exception as e:
            print(f"Error calculando similitud: {e}")
            return []

    results.sort(key=lambda x: x["score"], reverse=True)
    return results


def answer_question(question: str):
    if not question or not question.strip():
        return {
            "answer": "La pregunta no puede estar vacía.",
            "citations": []
        }

    results = search_query(question)

    if results:
     
        top_fragments = [r["fragment"] for r in results[:3]]
        context = " ".join(top_fragments)
        citations = [r["document"] for r in results[:3]]
    else:
   
        raw_contexts = []
        raw_sources = []

        if not os.path.exists(UPLOAD_DIR):
            return {
                "answer": "No hay documentos cargados.",
                "citations": []
            }

        for file in os.listdir(UPLOAD_DIR):
            ext = os.path.splitext(file)[1].lower()
            if ext not in ALLOWED_EXTENSIONS:
                continue

            path = os.path.join(UPLOAD_DIR, file)
            try:
                if file.endswith(".pdf"):
                    reader = PdfReader(path)
                    text = "\n".join([page.extract_text() or "" for page in reader.pages])
                elif file.endswith(".txt"):
                    with open(path, "r", encoding="utf-8", errors="ignore") as f:
                        text = f.read()
                else:
                    continue

                if text.strip():
                    raw_contexts.append(text.strip())
                    raw_sources.append(file)
            except Exception as e:
                print(f"Error leyendo {file}: {e}")
                continue

        if not raw_contexts:
            return {
                "answer": "No se encuentra la información en los documentos cargados.",
                "citations": []
            }


        try:
            vectorizer = TfidfVectorizer()
            tfidf_matrix = vectorizer.fit_transform([question] + raw_contexts)
            query_vec = tfidf_matrix[0:1]
            doc_vecs = tfidf_matrix[1:]
            scores = cosine_similarity(query_vec, doc_vecs)[0]

            best_doc_index = int(scores.argmax())
            context = raw_contexts[best_doc_index]
            citations = [raw_sources[best_doc_index]]

        except Exception as e:
            return {
                "answer": f"Ocurrió un error analizando los documentos: {e}",
                "citations": []
            }


    try:
        prompt = (
            f"Responde la siguiente pregunta utilizando solo la información del contexto.\n\n"
            f"Contexto:\n{context[:12000]}\n\n"
            f"Pregunta: {question}\n"
            f"Respuesta:"
        )

        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Eres un asistente útil que responde preguntas usando exclusivamente la información del contexto proporcionado."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )

        answer = completion.choices[0].message.content.strip()

        return {
            "answer": answer,
            "citations": citations
        }

    except Exception as e:
        return {
            "answer": f"Ocurrió un error al generar la respuesta: {e}",
            "citations": []
        }
