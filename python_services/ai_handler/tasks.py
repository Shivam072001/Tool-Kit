# python_services/ai_handler/tasks.py

import os
import fitz
import docx
import nltk
import heapq
from celery import shared_task
from django.conf import settings
from transformers import pipeline
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
import language_tool_python
import whisper

# --- NLTK Data Download ---
# Ensures that the necessary NLTK models are available.
try:
    stopwords.words('english')
except LookupError:
    nltk.download('stopwords')
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
try:
    nltk.data.find('sentiment/vader_lexicon.zip')
except LookupError:
    nltk.download('vader_lexicon')


# --- Helper Functions for Text Extraction ---

def _extract_text_from_pdf(filepath):
    """Extracts text content from a PDF file."""
    doc = fitz.open(filepath)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def _extract_text_from_docx(filepath):
    """Extracts text content from a DOCX file."""
    doc = docx.Document(filepath)
    text = "\n".join([para.text for para in doc.paragraphs])
    return text

def _extract_text_from_txt(filepath):
    """Extracts text content from a TXT file."""
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

# --- Celery Tasks ---

# Ensure the output directory exists
AI_PROCESSED_DIR = os.path.join(settings.MEDIA_ROOT, 'ai_processed')
os.makedirs(AI_PROCESSED_DIR, exist_ok=True)


@shared_task
def remove_background_task(input_path, output_filename, api_key=None):
    """
    Removes the background from an image using the 'rembg' library.
    """
    try:
        with open(input_path, 'rb') as input_file:
            input_data = input_file.read()
            output_data = remove(input_data)
            output_path_full = os.path.join(AI_PROCESSED_DIR, output_filename)
            with open(output_path_full, 'wb') as output_file:
                output_file.write(output_data)
        return os.path.join('ai_processed', output_filename)
    except Exception as e:
        raise e
    finally:
        if os.path.exists(input_path):
            os.remove(input_path)


@shared_task
def summarize_document_task(input_path, original_filename, api_key=None):
    """
    Summarizes the text content of a given document and performs content analysis.
    Implements a chunking strategy for long documents.
    """
    try:
        text_content = ""
        file_extension = os.path.splitext(original_filename)[1].lower()

        if file_extension == '.pdf':
            text_content = _extract_text_from_pdf(input_path)
        elif file_extension == '.docx':
            text_content = _extract_text_from_docx(input_path)
        elif file_extension == '.txt':
            text_content = _extract_text_from_txt(input_path)
        else:
            raise ValueError(f"Unsupported file type: {file_extension}")

        if not text_content.strip():
            raise ValueError("Document is empty or contains no readable text.")

        if api_key:
            print("--- Using custom user-provided API key for summarization ---")
            # In a real implementation:
            # client = OpenAI(api_key=api_key)
            # response = client.completions.create(...)
            # executive_summary = response.choices[0].text
            # For now, we'll just prepend a note to the summary.
        else:
            print("--- Using own model ---")
        # --- Executive Summary (BART with Chunking) ---
        summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        # The model has a limit of 1024 tokens, we use a smaller chunk size for safety
        max_chunk_length = 800
        sentences = sent_tokenize(text_content)

        chunks = []
        current_chunk = ""
        for sentence in sentences:
            if len(current_chunk.split()) + len(sentence.split()) <= max_chunk_length:
                current_chunk += " " + sentence
            else:
                chunks.append(current_chunk)
                current_chunk = sentence
        if current_chunk:
            chunks.append(current_chunk)

        # Summarize each chunk
        summaries = summarizer(chunks, max_length=150, min_length=30, do_sample=False)
        executive_summary = " ".join([summary['summary_text'] for summary in summaries])

        # --- Bullet Points Summary (Extractive on full text) ---
        stop_words = set(stopwords.words('english'))
        word_frequencies = {}
        for word in word_tokenize(text_content.lower()):
            if word.isalnum() and word not in stop_words:
                word_frequencies[word] = word_frequencies.get(word, 0) + 1

        if not word_frequencies:
            bullet_points = ["- No significant text found for summarization."]
        else:
            maximum_frequency = max(word_frequencies.values())

        for word in word_frequencies.keys():
            word_frequencies[word] = (word_frequencies[word] / maximum_frequency)

            sentence_scores = {}
            for sent in sent_tokenize(text_content):
                for word in word_tokenize(sent.lower()):
                    if word in word_frequencies:
                        if len(sent.split()) < 35: # Prefer shorter, concise sentences
                            sentence_scores[sent] = sentence_scores.get(sent, 0) + word_frequencies[word]

            # Select top 5 sentences for bullet points
            summary_sentences = heapq.nlargest(5, sentence_scores, key=sentence_scores.get)
            bullet_points = [f"- {sentence.strip()}" for sentence in summary_sentences]


        # --- Sentiment Analysis (on full text) ---
        sia = SentimentIntensityAnalyzer()
        sentiment = sia.polarity_scores(text_content)

        # --- Keyword Extraction (on full text) ---
        keywords = heapq.nlargest(5, word_frequencies, key=word_frequencies.get)

        return {
            "executive_summary": executive_summary,
            "bullet_points": bullet_points,
            "sentiment": sentiment,
            "keywords": keywords
        }

    except Exception as e:
        raise e
    finally:
        if os.path.exists(input_path):
            os.remove(input_path)


@shared_task
def check_grammar_task(text_content, api_key=None):
    """
    Checks the grammar of a given text string.
    """
    try:
        if not text_content or not text_content.strip():
            raise ValueError("Input text cannot be empty.")

        tool = language_tool_python.LanguageTool('en-US')
        matches = tool.check(text_content)

        results = [
            {
                'ruleId': match.ruleId,
                'message': match.message,
                'replacements': match.replacements,
                'offset': match.offset,
                'length': match.errorLength,
                'context': match.context,
            }
            for match in matches
        ]
        return results
    except Exception as e:
        raise e

@shared_task
def transcribe_audio_task(input_path, api_key=None):
    """
    Transcribes an audio file using OpenAI's Whisper model.
    """
    try:
        # Using a smaller, CPU-friendly model. For production, consider larger models and GPU workers.
        model = whisper.load_model("base")
        result = model.transcribe(input_path, fp16=False)
        transcribed_text = result["text"]

        return transcribed_text

    except Exception as e:
        raise e
    finally:
        if os.path.exists(input_path):
            os.remove(input_path)