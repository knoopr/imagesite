from django.shortcuts import render, redirect
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
        template = get_template('index.html')
        #pictures = models.Photograph.
        albums = models.Album.objects.all()
        people = models.Photographer.objects.all()
        html = template.render( context={'Photographers':people, 'Albums':albums}, request = request)
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
    if request.method == 'PUT':
        json_data = json.loads(request.body)
        if 'filename' in json_data:
            image_name = json_data['filename']
            change_name= json_data['album']
            
            try:
                photo = models.Photograph.objects.get(image_data=image_name)
                photo.image_album = models.Album.objects.get(album_name = change_name )
                photo.save()
            except Exception as e:
                print(image_name)
                print(e)
                return HttpResponse(status=400)    
            
            return JsonResponse({'success':1, 'filename':image_name})
        else:
            print("NO except")
            return HttpResponse(status=400)

def album(request):
    if request.method == 'GET':
        request_album = list(filter(None,request.path.split('/')))
        request_album = request_album[len(request_album)-1]
        if request_album == 'album':
            return redirect('/photography/')

        if request.META.get('CONTENT_TYPE') == 'application/javascript':
            request_quality = request.GET['quality']
            request_photographer = request.GET['photographer']
            request_tags = request.GET['tags'].split(",")
            already_loaded = request.GET['loaded']

            if request_photographer == "null" and request_album !='All':
                album = models.Album.objects.get(album_name=request_album)
                photos = album.album_photographs.all()[int(already_loaded):50+int(already_loaded)]
            elif request_photographer != "null" and request_album != 'All':
                album = models.Album.objects.get(album_name=request_album)
                photographer = models.Photographer.objects.get(first_name=request_photographer.split()[0],last_name=request_photographer.split()[1])
                photos =album.album_photographs.filter(image_photographer=photographer)[int(already_loaded):50+int(already_loaded)]
            elif request_photographer != "null":
                photographer = models.Photographer.objects.get(first_name=request_photographer.split()[0],last_name=request_photographer.split()[1])
                photos = models.Photograph.objects.filter(image_photographer=photographer)[int(already_loaded):50+int(already_loaded)]
            else:
                photos = models.Photograph.objects.all()[int(already_loaded):50+int(already_loaded)]

            return_photos = []

            for i in photos:
                tags = i.tags.all().values()
                album = None
                photographer = None
                if i.image_album:
                    album = i.image_album
                    
                if (i.image_photographer):
                    return_photos.append({
                        'image_location':"/media/" + str(i.image_data)+ "-" + request_quality + ".jpg",
                        'photographer':{
                            'name':str(i.image_photographer),
                            'email':i.image_photographer.contact_email
                        },
                        'tags': [i['tag_text'] for i in tags],
                        'width': choice(["10%","20%","30%"]),
                        'album': str(album)
                    })
                else:
                    return_photos.append({
                        'image_location':"/media/" + str(i.image_data)+ "-" + request_quality + ".jpg",
                        'photographer':{
                            'name':'No photographer provided.',
                            'email':''
                        },
                        'tags': [i['tag_text'] for i in tags],
                        'width': choice(["10%","20%","30%"]),
                        'album': str(album)
                    })
            
            return_photos
            return JsonResponse(return_photos, safe=False)
        else:
            template = get_template('album.html')
            if request_album == 'All':
                people = models.Photographer.objects.all()
                albums = models.Album.objects.all()
                html = template.render( context={'Photographers':people, 'Albums':albums}, request = request)
                return HttpResponse(html)
            else:
                try:
                    album=models.Album.objects.get(album_name = request_album)
                except:
                    return HttpResponse(status=404)
                
                people = models.Photographer.objects.filter(associated_photographs__in = album.album_photographs.all())
                albums = models.Album.objects.all()
                html = template.render( context={'Photographers':people, 'Albums':albums}, request = request)
                return HttpResponse(html)
