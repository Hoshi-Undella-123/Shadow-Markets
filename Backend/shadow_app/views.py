from rest_framework import generics
from .models import NIHProject
from .serializers import NIHProjectSerializer

class NIHProjectListView(generics.ListAPIView):
    queryset = NIHProject.objects.all()
    serializer_class = NIHProjectSerializer
