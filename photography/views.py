from django.shortcuts import render
from django.template.loader import get_template
from django.http import HttpResponse, JsonResponse
from photography.ImageProcessor import ImageProcessor
from django.db import IntegrityError
import photography.models as models
import json
from random import choice


# Create your views here.
def index(request):
    if request.method == 'GET':
        if request.META['CONTENT_TYPE'] == 'application/javascript':
            #json_data = json.loads(request.body)
            #for key in request.GET.iterkeys():
            #    print(key)
            request_quality = request.GET['quality']
            request_photographer = request.GET['photographer']
            request_tags = request.GET['tags'].split(",")
            already_loaded = request.GET['loaded']

            if request_photographer == "null":
                photos = models.Photograph.objects.all()[int(already_loaded):50+int(already_loaded)]
            else:
                photographer = models.Photographer.objects.get(first_name=request_photographer.split()[0],last_name=request_photographer.split()[1])
                photos = models.Photograph.objects.filter(image_photographer=photographer)[int(already_loaded):50+int(already_loaded)]

            return_photos = []

            for i in photos:
                tags = i.tags.all().values()
                return_photos.append({
                    'image_location':"/media/" + str(i.image_data)+ "-" + request_quality + ".jpg",
                    'photographer':{
                        'name':str(i.image_photographer),
                        'email':i.image_photographer.contact_email
                    },
                    'tags': [i['tag_text'] for i in tags],
                    'width': choice(["10%","20%","30%"])
                })
            
            return_photos
            return JsonResponse(return_photos, safe=False)
        else:
            template = get_template('index.html')
            test_range = []
            for i in range(0, 50):
                test_range.append(i)
            widths = ["10%", "20%", "30%"]
            #pictures = models.Photograph.
            people = models.Photographer.objects.all()
            #html = template.render( context={'test_range':test_range, 'widths':widths, 'test_photos':pictures, 'Photographers':people}, request = request)
            html = template.render( context={'test_range':test_range, 'widths':widths, 'Photographers':people}, request = request)
            return HttpResponse(html)

    if request.method == 'POST':
        json_data = json.loads(request.body)
        if 'quality' in json_data:
            request.session['quality'] = json_data['quality']
            return JsonResponse({'success':1, 'quality':json_data['quality']})
        elif 'filename' in json_data:
            upload_name = json_data['filename']
            upload_image = json_data['data']['image']
            upload_photographer = json_data['data']['photographer']
            upload_tags = json_data['data']['tags']


            new_person = None
            if upload_photographer['email'] != None:
                new_person = models.Photographer.objects.filter(contact_email = upload_photographer['email'])
                if len(new_person) == 0:
                    new_person = models.Photographer(first_name = upload_photographer['first'].Title(), last_name = upload_photographer['last'].Title(), contact_email = upload_photographer['email'].lower())
                    new_person.save()
                else:
                    new_person = new_person[0]

            if upload_photographer['first'] != None:
                new_person = models.Photographer.objects.filter(first_name = upload_photographer['first'],last_name = upload_photographer['last'] )
                if len(new_person) == 0:
                    new_person = models.Photographer(first_name = upload_photographer['first'].Title(), last_name = upload_photographer['last'].Title(), contact_email = upload_photographer['email'].lower())
                    new_person.save()
                else:
                    new_person = new_person[0]
            
            

            temp = ImageProcessor(upload_image[upload_image.find(',')+1:])
            processor_return = temp.save_image()

            new_photo = None
            if new_person != None:
                new_photo = models.Photograph(image_data=processor_return['Filename'], image_photographer=new_person)
                new_photo.save()
            else:
                new_photo = models.Photograph(image_data=processor_return['Filename'])
                new_photo.save()


            for tag in upload_tags:
                try:
                    new_tag = models.Tag(tag_text = tag.lower())
                    new_tag.save()
                    new_photo.tags.add(new_tag)
                except IntegrityError:
                    pass
                except: 
                    HttpResponse(status=500)

            return JsonResponse({'success':1, 'filename':upload_name})


        '''all_images = json_data['Images']
        print(len(all_images))
        for i in all_images:
            temp = ImageProcessor(i[i.find(',')+1:])
            print(temp.save_image())
        return JsonResponse({'received':len(json_data['Images'])});'''