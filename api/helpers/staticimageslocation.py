from django.conf import settings

class StaticImagesLocation:

    def write(self, file_name, data, file_format):
        with open(self.static_location + file_name + file_format, 'wb') as f:
            f.write(data)

    def __init__(self):
        self.static_location = settings.STATIC_ROOT + 'images/'
