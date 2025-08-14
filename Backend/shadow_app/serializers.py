from rest_framework import serializers
from .models import NIHProject

class NIHProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = NIHProject
        fields = '__all__'
