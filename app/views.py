from django.http import Http404

from rest_framework import generics

from .models import models
from .serializers import modelserializer_factory


class GetModelMixin(object):

    def dispatch(self, *args, **kwargs):
        self.model = self._get_model()
        return super(GetModelMixin, self).dispatch(*args, **kwargs)

    def _get_model(self):
        model = models.get(self.kwargs['model_name'])
        if model is None:
            raise Http404
        return model

    def get_serializer_class(self):
        return modelserializer_factory(self.model)

    def get_queryset(self):
        return self.model.objects.all()


class ListCreateView(GetModelMixin, generics.ListCreateAPIView):
    pass


class RetriveUpdateView(GetModelMixin, generics.RetrieveUpdateAPIView):
    pass