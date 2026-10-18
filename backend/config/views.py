
from django.http import JsonResponse


def home(request):
    return JsonResponse({
        "message": "AI Study Assistant API is running",
        "status": "success"
    })
