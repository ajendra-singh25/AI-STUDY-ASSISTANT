
from django.conf import settings
from django.db import models


class Document(models.Model):

    class ProcessingStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        PROCESSING = "processing", "Processing"
        READY = "ready", "Ready"
        FAILED = "failed", "Failed"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="documents",
        null=True,
        blank=True,
    )

    title = models.CharField(max_length=255)

    pdf = models.FileField(upload_to="pdfs/")

    uploaded_at = models.DateTimeField(auto_now_add=True)

    processing_status = models.CharField(
        max_length=20,
        choices=ProcessingStatus.choices,
        default=ProcessingStatus.PENDING,
        db_index=True,
    )

    processing_error = models.TextField(
        blank=True,
        default="",
    )

    processed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    chunks_created = models.PositiveIntegerField(
        default=0,
    )

    def __str__(self):
        return self.title
