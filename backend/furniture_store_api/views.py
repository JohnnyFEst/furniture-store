from django.http import HttpResponse

def home(request):
    response = HttpResponse("¡Hola desde la tienda de muebles!")
    return response