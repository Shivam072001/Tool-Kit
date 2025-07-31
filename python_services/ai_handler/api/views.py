# python_services/ai_handler/api/views.py

import os
from uuid import uuid4
from django.core.files.storage import default_storage
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from file_handler.api.serializers import ImageUploadSerializer # Reusable for any file
from ..tasks import remove_background_task, summarize_document_task

class BackgroundRemovalView(APIView):
    """
    (Existing, unmodified view)
    """
    def post(self, request, *args, **kwargs):
        # ... existing code ...
        task = remove_background_task.delay(input_path_full, output_filename)
        return Response({'task_id': task.id}, status=status.HTTP_202_ACCEPTED)

class DocumentSummarizerView(APIView):
    """
    (New view)
    Handles file upload and dispatches the summarization task.
    """
    def post(self, request, *args, **kwargs):
        serializer = ImageUploadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        document_file = serializer.validated_data['image'] # field name is 'image'

        temp_filename = f"{uuid4()}_{document_file.name}"
        temp_path = default_storage.save(os.path.join('uploads', temp_filename), document_file)
        input_path_full = os.path.join(settings.MEDIA_ROOT, temp_path)

        task = summarize_document_task.delay(input_path_full, document_file.name)

        return Response({'task_id': task.id}, status=status.HTTP_202_ACCEPTED)

class GrammarCheckerView(APIView):
    """
    (New view)
    Accepts text and dispatches a grammar checking task.
    """
    def post(self, request, *args, **kwargs):
        serializer = TextSubmissionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        text_content = serializer.validated_data['text']

        # Dispatch the grammar check task. Note this is a text-based task.
        task = check_grammar_task.delay(text_content)

        return Response({'task_id': task.id}, status=status.HTTP_202_ACCEPTED)