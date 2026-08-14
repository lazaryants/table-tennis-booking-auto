from rest_framework import serializers
from rest_framework.serializers import *
from .models import *
from django.contrib.auth.password_validation import validate_password

from django.contrib.auth import get_user_model
User = get_user_model()


class TimeLapseSerializer(ModelSerializer):
    class Meta:
        model = TimeLapse
        fields = '__all__'
        read_only_fields = ['username']

    def validate(self, attrs):
        from datetime import datetime, time

        from django.utils import timezone

        booking_date = attrs.get(
            'date',
            getattr(self.instance, 'date', None),
        )
        table_number = attrs.get(
            'table_number',
            getattr(self.instance, 'table_number', None),
        )
        time_lapse = attrs.get(
            'time_lapse',
            getattr(self.instance, 'time_lapse', None),
        )

        if booking_date is None:
            raise serializers.ValidationError({
                'date': 'Необходимо указать дату бронирования.'
            })

        if table_number not in range(1, 6):
            raise serializers.ValidationError({
                'table_number': 'Номер стола должен быть от 1 до 5.'
            })

        if time_lapse not in range(1, 25):
            raise serializers.ValidationError({
                'time_lapse': 'Время должно быть от 1 до 24.'
            })

        # time_lapse хранит конец часового интервала:
        # 14 означает слот 13:00-14:00.
        slot_start_hour = time_lapse - 1

        slot_start = timezone.make_aware(
            datetime.combine(
                booking_date,
                time(hour=slot_start_hour),
            ),
            timezone.get_current_timezone(),
        )

        if slot_start <= timezone.localtime():
            raise serializers.ValidationError({
                'detail': (
                    'Нельзя бронировать уже начавшийся '
                    'или прошедший временной интервал.'
                )
            })

        return attrs


#class UserSerializer(serializers.HyperlinkedModelSerializer):
#    class Meta:
#        model = User
#        fields = ['url', 'username', 'email', 'password', 'id', 'first_name', 'last_name']


class PlayerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'id', 'first_name', 'last_name', 'phone', 'balance']
        read_only_fields = ['id', 'username', 'balance']


class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'phone']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        user = get_user_model()(**validated_data)

        user.set_password(validated_data['password'])
        user.save()

        return user
