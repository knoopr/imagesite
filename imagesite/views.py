from django.template.loader import get_template
from django.http import HttpResponse

def base(request):
    template = get_template('base.html')
    html = template.render({'city': 'Guelph'})
    return HttpResponse(html)