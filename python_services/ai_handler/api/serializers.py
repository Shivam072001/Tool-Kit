from rest_framework import serializers

class TextSubmissionSerializer(serializers.Serializer):
    text = serializers.CharField(allow_blank=False, trim_whitespace=True)