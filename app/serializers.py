from rest_framework import serializers


def modelserializer_factory(model):

    return type(model.__name__ + 'Serializer', (serializers.ModelSerializer, ), {
        'Meta': type('Meta', (), {
            'model': model,
        })
    })