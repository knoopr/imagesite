from django.shortcuts import render
from django.template.loader import get_template
from django.http import HttpResponse, JsonResponse
from . import ImageProcessor
import json


# Create your views here.
def index(request):
    if request.method == 'GET':
        template = get_template('index.html')
        test_range = [];
        for i in range(0,20):
            test_range.append(i);
        html = template.render(context={'test_range':test_range},request = request);

        return HttpResponse(html)
    if request.method == 'POST':
        json_data = json.loads(request.body)
        print(len(json_data['Images']));
        return JsonResponse({'received':len(json_data['Images'])});