from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^(?P<model_name>\w+)/$', views.ListCreateView.as_view(), name="object_list"),
    url(r'^(?P<model_name>\w+)/(?P<pk>\d+)/$', views.RetriveUpdateView.as_view(), name="object")
]
