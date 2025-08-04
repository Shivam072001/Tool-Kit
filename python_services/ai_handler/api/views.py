from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from celery.result import AsyncResult
from django.core.files.storage import default_storage

from ..tasks import remove_background_task, summarize_document_task, check_grammar_task, transcribe_audio_task
from .serializers import ImageUploadSerializer, FileUploadSerializer, TextSerializer

class BackgroundRemovalView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ImageUploadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        image_file = serializer.validated_data['image']
        api_key = request.data.get('api_key') # Get the API key
        file_name = default_storage.save(image_file.name, image_file)
        output_filename = f"bg_removed_{file_name}"

        task = remove_background_task.delay(file_name, output_filename, api_key) # Pass key to task
        return Response({"task_id": task.id}, status=status.HTTP_202_ACCEPTED)

class DocumentSummarizerView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = FileUploadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        doc_file = serializer.validated_data['file']
        api_key = request.data.get('api_key') # Get the API key
        file_name = default_storage.save(doc_file.name, doc_file)

        task = summarize_document_task.delay(file_name, doc_file.name, api_key) # Pass key to task
        return Response({"task_id": task.id}, status=status.HTTP_202_ACCEPTED)

class GrammarCheckerView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = TextSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        text = serializer.validated_data['text']
        api_key = request.data.get('api_key') # Get the API key

        task = check_grammar_task.delay(text, api_key) # Pass key to task
        return Response({"task_id": task.id}, status=status.HTTP_202_ACCEPTED)

class AudioTranscriptionView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = FileUploadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        audio_file = serializer.validated_data['file']
        api_key = request.data.get('api_key') # Get the API key
        file_name = default_storage.save(audio_file.name, audio_file)

        task = transcribe_audio_task.delay(file_name, api_key) # Pass key to task
        return Response({"task_id": task.id}, status=status.HTTP_202_ACCEPTED)

class TaskStatusView(APIView):
    """
    API view to check the status of a Celery task.
    """
    def get(self, request, task_id, *args, **kwargs):
        task_result = AsyncResult(task_id)
        result = {
            "taskId": task_id,
            "status": task_result.status,
            "result": task_result.result if task_result.ready() else None,
        }

        # Customize result shape for frontend convenience
        if task_result.status == 'SUCCESS':
            if isinstance(task_result.result, str) and (task_result.result.startswith('http') or task_result.result.startswith('/media')):
                 result['resultUrl'] = task_result.result
            else:
                 result['resultText'] = task_result.result

        elif task_result.status == 'FAILURE':
            result['errorMessage'] = str(task_result.result)

        return Response(result, status=status.HTTP_200_OK)