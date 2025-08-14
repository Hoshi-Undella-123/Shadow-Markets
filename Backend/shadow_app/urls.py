from django.urls import path
from .views import NIHProjectListView

urlpatterns = [
    path('nih-projects/', NIHProjectListView.as_view(), name='nih-projects-list'),
]
