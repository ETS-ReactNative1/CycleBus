from django.shortcuts import render
from django.views import View

class Index(View):
    def get(self,request):
        context = {
            'count':'Hello World',
        }
        return render(request,'channel/index.html', context)
