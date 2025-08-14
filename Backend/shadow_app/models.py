from django.db import models

class NIHProject(models.Model):
    project_num = models.CharField(max_length=64, unique=True)
    project_title = models.TextField()
    principal_investigator = models.CharField(max_length=256, blank=True)
    organization = models.CharField(max_length=256, blank=True)
    award_amount = models.BigIntegerField(null=True, blank=True)
    project_terms = models.TextField(blank=True)
    abstract_text = models.TextField(blank=True)
    project_start_date = models.DateField(null=True, blank=True)
    project_end_date = models.DateField(null=True, blank=True)
    agency_ic_admin_abbreviation = models.CharField(max_length=32, blank=True)
    status = models.CharField(max_length=32, blank=True)

    def __str__(self):
        return self.project_title
