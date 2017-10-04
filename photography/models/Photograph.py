from django.db import models
from django.utils import timezone
from django.dispatch import receiver
from django.conf import settings
from os import path, remove, listdir
from .Photographer import Photographer
from .Album import Album


class Photograph(models.Model):
    #alt_text = models.CharField(max_length=126, blank=False)
    alt_text = models.CharField(max_length=126, blank=True)
    date_taken = models.DateField(default=timezone.now())
    date_uploaded = models.DateField(default=timezone.now())
    image_data = models.ImageField(upload_to='./', blank=False)
    image_photographer = models.ForeignKey(Photographer, on_delete=models.PROTECT, related_name="associated_photographs", blank=True, null=True)  # pylint: disable=line-too-long
    image_album = models.ForeignKey(Album, on_delete=models.PROTECT, related_name="album_photographs", blank=True, null=True)  # pylint: disable=line-too-long

    def __str__(self):
        return self.alt_text
