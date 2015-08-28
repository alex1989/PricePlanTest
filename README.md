# How to install:

```
#!/bin/bash
pip install -r requirements.txt
npm install
bower install
gulp production
```

Edit db scheme in app/data.json

```
#!/bin/bash
python manage.py migrate
python manage.py runserver
```