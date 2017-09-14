from django.db import models

class Photographer(models.Model):
    first_name = models.CharField(max_length=64, blank=False)
    last_name = models.CharField(max_length=64, blank=False)
    contact_email = models.EmailField(unique=True)
    #photo_watermark = models.ImageField(upload_to='./', blank=False)
    photo_watermark = models.ImageField(upload_to='./', blank=True)

    def __str__(self):
        return "%s %s" % (self.first_name, self.last_name)
    