
from rest_framework import serializers
from .models import Document


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ["id", "title", "pdf", "uploaded_at"]
        read_only_fields = ["id", "uploaded_at"]

    def validate_title(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Please enter a PDF title."
            )

        return value

    def validate_pdf(self, value):
        if not value.name.lower().endswith(".pdf"):
            raise serializers.ValidationError(
                "Only PDF files are allowed."
            )

        max_size = 50 * 1024 * 1024

        if value.size > max_size:
            raise serializers.ValidationError(
                "PDF must be 50 MB or smaller."
            )

        return value
