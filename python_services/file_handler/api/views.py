# backend-compute/file_handler/api/views.py
import os
from uuid import uuid4
from django.core.files.storage import default_storage
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from celery.result import AsyncResult

from .serializers import ImageUploadSerializer
from ..tasks import compress_file_task, convert_file_task

# Assuming your tasks are in the same app

class FileConversionView(APIView):
    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        target_format = request.data.get('targetFormat')

        if not file_obj or not target_format:
            return Response(
                {"error": "File and targetFormat are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Save the file temporarily
        file_name = default_storage.save(file_obj.name, file_obj)
        temp_file_path = os.path.join(settings.MEDIA_ROOT, file_name)

        # Generate a new filename for the output
        base_name = os.path.splitext(file_name)[0]
        output_filename = f"{base_name}.{target_format.lower()}"

        # Dispatch the Celery task
        task = convert_file_task.delay(temp_file_path, output_filename, target_format)

        return Response({"task_id": task.id}, status=status.HTTP_202_ACCEPTED)


class FileCompressionView(APIView):
    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')

        if not file_obj:
            return Response({"error": "A file is required."}, status=status.HTTP_400_BAD_REQUEST)

        file_name = default_storage.save(file_obj.name, file_obj)
        temp_file_path = os.path.join(settings.MEDIA_ROOT, file_name)

        # Generate a new filename for the output
        base_name, ext = os.path.splitext(file_name)
        output_filename = f"{base_name}_compressed{ext}"

        # Dispatch the Celery task
        task = compress_file_task.delay(temp_file_path, output_filename)

        return Response({"task_id": task.id}, status=status.HTTP_202_ACCEPTED)

class TaskStatusView(APIView):
    def get(self, request, task_id, *args, **kwargs):
        task_result = AsyncResult(task_id)
        result = {
            'task_id': task_id,
            'status': task_result.status,
            'result': task_result.result if task_result.successful() else str(task_result.result)
        }
        return Response(result, status=status.HTTP_200_OK)