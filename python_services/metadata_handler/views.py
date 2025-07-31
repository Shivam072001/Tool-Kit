# python_services/metadata_handler/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .services import extract_metadata

class MetadataExtractorView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        if 'file' not in request.data:
            return Response(
                {"error": "No file provided."},
                status=status.HTTP_400_BAD_REQUEST
            )

        file_obj = request.data['file']

        try:
            metadata = extract_metadata(file_obj)
            if "Error" in metadata:
                return Response(metadata, status=status.HTTP_400_BAD_REQUEST)

            return Response(metadata, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )