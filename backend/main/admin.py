from django.contrib import admin
from .models import TimeLapse, User

admin.register(admin)
admin.site.register(User)
admin.site.register(TimeLapse)
