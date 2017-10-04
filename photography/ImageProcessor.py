from django.conf import settings
from os import path, listdir, remove
from io import BytesIO
from PIL import Image
import uuid
import base64


class ImageProcessor:
    #commenting out init as it was initially from Shotfortheheart project but may contain rotation/cropping etc. later
    def __init__(self, img64):
        self.img = Image.open(BytesIO(base64.b64decode(img64)))
    
    def save_image(self, filename=None):
        temp_name = str(uuid.uuid4())
        if filename != None:
            full_path = path.join(settings.MEDIA_ROOT, filename + "-High.jpg")
            if path.isfile(full_path):
                return False
        else:
            full_path = path.join(settings.MEDIA_ROOT, temp_name + "-High.jpg")
            while path.isfile(full_path):
                temp_name = str(uuid.uuid4())
                full_path = path.join(settings.MEDIA_ROOT, temp_name+ "-High.jpg")
        full_path = path.join(settings.MEDIA_ROOT, temp_name)
        try:
            self.img.save(full_path+"-High.jpg", quality=85, subsampling=-1)
            self.img.save(full_path+"-Medium.jpg", quality=55, subsampling=-1, optimize=True)
            self.img.save(full_path+"-Low.jpg", quality=25, optimize=True)
            #self.img.save(full_path+"-High.webp", quality=85)
            #self.img.save(full_path+"-Medium.webp", quality=55)
            #self.img.save(full_path+"-Low.webp", quality=25)
            return {'status':'True', 'Filename':temp_name}
        except:
            for i in listdir(settings.MEDIA_ROOT):
                if path.isfile(path.join(settings.MEDIA_ROOT, i)) and full_path in i:
                    remove(path.join(settings.MEDIA_ROOT, i))
            return False

    def load_image(self, filename):
        filename = path.join(settings.MEDIA_ROOT + filename)
        return base64.b64encode(open(filename, "rb").read())
		