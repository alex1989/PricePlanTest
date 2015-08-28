from django.db import models as djmodels
from django.contrib import admin
from .db_scheme import scheme

FIELD_TYPE_CLASSES = {
    'int': (djmodels.IntegerField, {}),
    'char': (djmodels.CharField, {'max_length': 255}),
    'date': (djmodels.DateField, {}),
    'datetime': (djmodels.DateTimeField, {})
}

models = {}


def generate_field(field_scheme):
    field_class, kwargs = FIELD_TYPE_CLASSES[field_scheme['type']]
    if 'title' in field_scheme:
        kwargs['verbose_name'] = field_scheme['title']
    return field_scheme['name'], field_class(**kwargs)


def generate_model(model_name, model_settings):
    kwargs = {'__module__': generate_model.__module__}
    fields = dict([generate_field(f)
                   for f in model_settings])
    kwargs.update(fields)
    return type(model_name, (djmodels.Model,), kwargs)


def load_scheme():
    for item in scheme:
        model_class = generate_model(item['name'], item['fields'])
        models[item['name']] = globals()[item['name']] = model_class
        admin.site.register(model_class)

load_scheme()
