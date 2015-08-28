import json
from os.path import dirname, abspath, join
from django.conf import settings

scheme = json.loads(str(open(
    join(dirname(abspath(__file__)), settings.MODEL_SCHEME)).read()))
