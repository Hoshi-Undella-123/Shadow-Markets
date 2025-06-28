from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('shadow_app.urls')),  # Only include app urls once at root
]
