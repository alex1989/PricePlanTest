import json
from django.template import Library
from ..db_scheme import scheme

register = Library()

@register.simple_tag
def app_db_scheme():
    return json.dumps(scheme)
