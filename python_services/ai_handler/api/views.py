from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from celery.result import AsyncResult

from .tasks import remove_background_task, summarize_document_task, check_grammar_task
from .serializers import ImageUploadSerializer, FileUploadSerializer, TextSerializer

class BackgroundRemovalView(APIView):
    """
    API view to handle requests for removing background from an image.
    """
    def post(self, request, *args, **kwargs):
        serializer = ImageUploadSerializer(data=request.data)
        if serializer.is_valid():
            image_file = serializer.validated_data['image']

            # Save the file temporarily to pass its path to the task
            # In a production system, this would be handled by a storage service like S3.
            from django.core.files.storage import default_storage
            file_name = default_storage.save(image_file.name, image_file)

            task = remove_background_task.delay(file_name)
            return Response({"taskId": task.id}, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DocumentSummarizerView(APIView):
    """
    API view to handle requests for summarizing a document.
    """
    def post(self, request, *args, **kwargs):
        # CORRECTED: Uses the generic FileUploadSerializer instead of ImageUploadSerializer
        serializer = FileUploadSerializer(data=request.data)
        if serializer.is_valid():
            doc_file = serializer.validated_data['file']

            from django.core.files.storage import default_storage
            file_name = default_storage.save(doc_file.name, doc_file)

            task = summarize_document_task.delay(file_name)
            return Response({"taskId": task.id}, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GrammarCheckerView(APIView):
    """
    API view to handle requests for checking grammar in a block of text.
    """
    def post(self, request, *args, **kwargs):
        # IMPLEMENTED: Uses the new TextSerializer
        serializer = TextSerializer(data=request.data)
        if serializer.is_valid():
            text = serializer.validated_data['text']
            task = check_grammar_task.delay(text)
            return Response({"taskId": task.id}, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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