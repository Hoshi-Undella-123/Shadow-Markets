from django.contrib import admin
from .models import NIHProject

@admin.register(NIHProject)
class NIHProjectAdmin(admin.ModelAdmin):
    list_display = ("project_num", "project_title", "principal_investigator", "organization", "award_amount", "status")
    search_fields = ("project_title", "principal_investigator", "organization", "project_num")
