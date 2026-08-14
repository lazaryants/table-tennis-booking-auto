from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class TimeLapse(models.Model):
    username = models.CharField('Логин', null=True, max_length=20)
    date = models.DateField('Дата', null=True)
    table_number = models.IntegerField('Номер стола', default=1, null=True)
    time_lapse = models.IntegerField('Время', default=1, null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['date', 'time_lapse', 'table_number'],
                name='unique_booking_slot',
            ),
        ]

    def __str__(self):
        return f'{self.username}'


class User(AbstractUser):
    phone = models.CharField('Телефон', null=True, max_length=12)
    balance = models.IntegerField('Баланс', default=0)
