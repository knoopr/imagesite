from django.conf import settings
from hashlib import sha1
from os import path, listdir, remove
from io import BytesIO
from PIL import Image
import base64


class ImageProcessor:
    #commenting out init as it was initially from Shotfortheheart project but may contain rotation/cropping etc. later
    def __init__(self, img64):
        self.img = Image.open(BytesIO(base64.b64decode(img64)))
    '''def __init__(self, request):
        img64 = request.POST.get('imgUrl')
        img64 = img64[img64.find(',')+1:]
        self.img = Image.open(BytesIO(base64.b64decode(img64)))
        self.initDim = (int(request.POST.get('imgInitW')), int(request.POST.get('imgInitH')))
        self.scaleDim = (int(float(request.POST.get('imgW'))), int(float(request.POST.get('imgH'))))
        self.cropDim = (int(float(request.POST.get('cropW'))), int(float(request.POST.get('cropH')))) # pylint: disable=line-too-long
        self.corner = (int(float(request.POST.get('imgX1'))), int(float(request.POST.get('imgY1'))))
        self.rotation = request.POST.get("rotation")
        if '-' in request.POST.get("rotation"):
            self.angle = int(request.POST.get("rotation")[1:])
        else:
            self.angle = 360 - int(request.POST.get("rotation")) #rotation in pil is counterclockwise

    def crop_image(self):
        self.img = self.img.resize(self.scaleDim, Image.LANCZOS)
        self.img = self.img.rotate(self.angle)
        self.img = self.img.crop((self.corner[0], self.corner[1] , self.cropDim[0] + self.corner[0], self.cropDim[1] + self.corner[1]))''' # pylint: disable=line-too-long

    def save_image(self, filename=None):
        if filename != None:
            full_path = path.join(settings.MEDIA_ROOT, filename)
        else:
            full_path = path.join(settings.MEDIA_ROOT, sha1(self.img.tobytes()).hexdigest() + "-high.jpg" )
        if path.isfile(full_path):
            return False
        else:
            full_path = path.join(settings.MEDIA_ROOT, sha1(self.img.tobytes()).hexdigest() )
            try:    
                self.img.save(full_path+"-High.jpg", quality=85, subsampling=-1)
                self.img.save(full_path+"-Medium.jpg", quality=55, subsampling=-1,optimize=True)
                self.img.save(full_path+"-Low.jpg", quality=25, optimize=True)
                #self.img.save(full_path+"-High.webp", quality=85)
                #self.img.save(full_path+"-Medium.webp", quality=55)
                #self.img.save(full_path+"-Low.webp", quality=25)
                return {'status':'True','Filename':(sha1(self.img.tobytes()).hexdigest())}  
            except:
                for i in listdir(settings.MEDIA_ROOT):
                    if path.isfile(path.join(settings.MEDIA_ROOT,i)) and full_path in i:
                        remove(path.join(settings.MEDIA_ROOT,i))
                return False

    def load_image(self, filename):
        filename = path.join(settings.MEDIA_ROOT + filename)
        return base64.b64encode(open(filename, "rb").read())
		