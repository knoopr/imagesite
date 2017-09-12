from django.shortcuts import render
from django.template.loader import get_template
from django.http import HttpResponse, JsonResponse
from photography.ImageProcessor import ImageProcessor
import json


# Create your views here.
def index(request):
    if request.method == 'GET':
        template = get_template('index.html')
        test_range = []
        for i in range(0, 20):
            test_range.append(i)
        html = template.render(context={'test_range':test_range}, request = request)

        return HttpResponse(html)
    if request.method == 'POST':
        json_data = json.loads(request.body)
        upload_name = json_data['filename']
        upload_image = json_data['data']['image']
        upload_photographer = json_data['data']['photographer']
        upload_tags = json_data['data']['image']

        print(upload_photographer)
        return JsonResponse({'success':1, 'filename':upload_name});
        

        '''all_images = json_data['Images']
        print(len(all_images))
        for i in all_images:
            temp = ImageProcessor(i[i.find(',')+1:])
            print(temp.save_image())
        return JsonResponse({'received':len(json_data['Images'])});'''