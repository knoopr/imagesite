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
        for i in range(0, 50):
            test_range.append(i)
        widths = ["10%","20%","30%"]
        pictures = ["pic1.jpg","pic2.jpg","pic3.jpg","pic4.jpg","pic5.jpg"]
        html = template.render(context={'test_range':test_range, 'widths':widths,'test_photos':pictures}, request = request)

        return HttpResponse(html)
    if request.method == 'POST':
        json_data = json.loads(request.body)
        if ('quality' in json_data):
            print (json_data['quality'])
            return JsonResponse({'success':1, 'quality':json_data['quality']})
        elif ('filename' in json_data):
            upload_name = json_data['filename']
            upload_image = json_data['data']['image']
            upload_photographer = json_data['data']['photographer']
            upload_tags = json_data['data']['tags']

            print(upload_tags)
            return JsonResponse({'success':1, 'filename':upload_name});
        

        '''all_images = json_data['Images']
        print(len(all_images))
        for i in all_images:
            temp = ImageProcessor(i[i.find(',')+1:])
            print(temp.save_image())
        return JsonResponse({'received':len(json_data['Images'])});'''