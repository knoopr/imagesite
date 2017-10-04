from django.db import models
from random import choice

class Album(models.Model):
    album_name = models.CharField(max_length=126, blank=False)

    def random_Image (self):
        try:
            return choice(self.album_photographs.all())
        except:
            return None


    def __str__(self):
        return self.album_name
    