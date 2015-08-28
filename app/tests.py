from django.test import TestCase
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import models
from .db_scheme import scheme
from datetime import date, datetime
import json

def filter_dict(dct, keys):
    return dict([(k, dct[k]) for k in keys if k in dct])


class ModelData(TestCase):
    data_by_type = {}

    def get_data(self, fields):
        if bool(self.data_by_type) is False:
            self.data_by_type = {
                'char': '123',
                'int': 123,
                'date': date.today(),
                'datetime': datetime.now()
            }
        return dict([(field['name'], self.data_by_type[field['type']])
                     for field in fields])


class ModelTestCase(ModelData):

    def setUp(self):
        for item in scheme:
            models[item['name']].objects.create(
                **self.get_data(item['fields'])
            )

    def test_objects_was_created(self):
        for item in scheme:
            items = models[item['name']].objects.filter(
                **self.get_data(item['fields']))
            self.assertEqual(items.count(), 1)


class ApiTestCase(ModelData):
    client = APIClient(enforce_csrf_checks=True)

    def test_model_creation_api(self):
        for item in scheme:
            url = reverse('object_list', kwargs={'model_name': item['name']})
            data = self.get_data(item['fields'])
            response = self.client.post(url, data, format='json')
            fdata = filter_dict(response.data, data.keys())
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertEqual(fdata, data)

    def test_model_access(self):
        for item in scheme:
            url = reverse('object_list', kwargs={'model_name': item['name']})
            data = self.get_data(item['fields'])
            response = self.client.post(url, data, format='json')
            object_url = reverse('object', kwargs={'model_name': item['name'],
                                                   'pk': response.data['id']})
            response = self.client.get(object_url, format='json')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            fdata = filter_dict(dict(response.data), data.keys())
            self.assertEqual(fdata, data)

    def test_model_update(self):
        for item in scheme:
            url = reverse('object_list', kwargs={'model_name': item['name']})
            data = self.get_data(item['fields'])
            response = self.client.post(url, data, format='json')
            object_url = reverse('object', kwargs={'model_name': item['name'],
                                                   'pk': response.data['id']})
            response = self.client.get(object_url, format='json')
            data = dict(response.data)
            for k in data:
                if data[k] == '123':
                    data[k] == 'test'
            response = self.client.patch(object_url, json.dumps(data), format='json', content_type='application/json; charset=UTF-8')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            fdata = filter_dict(dict(response.data), data.keys())
            self.assertEqual(fdata, data)

