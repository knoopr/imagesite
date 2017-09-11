from django.db import models
from .Photograph import Photograph

class Tag(models.Model):
    tag_text = models.CharField(max_length=126, blank=False, unique=True)
    associated_images = models.ManyToManyField(Photograph, related_name="tags")

    def __str__(self):
        return self.tag_text
