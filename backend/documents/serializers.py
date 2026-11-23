
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
        if not value:
            raise serializers.ValidationError(
                "Please upload a PDF file."
            )

        if not value.name.lower().endswith(".pdf"):
            raise serializers.ValidationError(
                "Only PDF files are allowed."
            )

        if value.size == 0:
            raise serializers.ValidationError(
                "The uploaded PDF is empty."
            )

        max_size = 50 * 1024 * 1024

        if value.size > max_size:
            raise serializers.ValidationError(
                "PDF must be 50 MB or smaller."
            )

        # Check PDF file signature
        try:
            current_position = value.tell()
            value.seek(0)
            file_signature = value.read(5)
            value.seek(current_position)

            if file_signature != b"%PDF-":
                raise serializers.ValidationError(
                    "The uploaded file is not a valid PDF."
                )

        except (AttributeError, OSError):
            raise serializers.ValidationError(
                "Unable to validate the uploaded PDF."
            )

        return value
