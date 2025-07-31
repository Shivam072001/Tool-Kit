# python_services/fake_data_handler/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services import generate_fake_data

class FakeDataGeneratorView(APIView):
    def post(self, request, *args, **kwargs):
        data_type = request.data.get('type')
        count = request.data.get('count', 10)
        locale = request.data.get('locale', 'en_US')

        if not data_type:
            return Response(
                {"error": "A 'type' of fake data is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            fake_data = generate_fake_data(data_type, count, locale)
            if "Error" in fake_data:
                return Response(fake_data, status=status.HTTP_400_BAD_REQUEST)

            return Response(fake_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )