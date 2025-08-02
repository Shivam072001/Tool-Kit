from rest_framework import serializers

class ImageCompressionSerializer(serializers.Serializer):
    """
    Serializer for the image compression endpoint.
    Validates the presence of an image file.
    """
    image = serializers.ImageField()

class FileConversionSerializer(serializers.Serializer):
    """
    Serializer for the file conversion endpoint.
    Validates the file and the target format for conversion.
    """
    file = serializers.FileField()
    target_format = serializers.CharField(max_length=10)