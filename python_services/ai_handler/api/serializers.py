from rest_framework import serializers

class FileUploadSerializer(serializers.Serializer):
    """
    A generic serializer for handling file uploads.
    """
    file = serializers.FileField()

class TextSerializer(serializers.Serializer):
    """
    A serializer for handling plain text input.
    """
    text = serializers.CharField()

class ImageUploadSerializer(serializers.Serializer):
    """
    Serializer specifically for image uploads.
    """
    image = serializers.ImageField()