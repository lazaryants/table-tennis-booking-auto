import datetime

import django_filters
from rest_framework.viewsets import ModelViewSet
import rest_framework
from .models import TimeLapse
from rest_framework import generics

from .models import *
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import *
from django_filters import rest_framework as filters
from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated

from . import serializers
from .permissions import IsBookingOwnerOrAdmin

from django.contrib.auth import get_user_model
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError

User = get_user_model()


class TimeLapseFilter(filters.FilterSet):
    date = filters.DateFilter(field_name='date')
    id = filters.CharFilter(field_name='id')

    class Meta:
        model = TimeLapse
        fields = ['date', 'id']


#class UserFilter(filters.FilterSet):
#    username = filters.CharFilter(field_name='username')
#
#    class Meta:
#        model = User
#        fields = ['username']


class PlayerFilter(filters.FilterSet):
    username = filters.CharFilter(field_name='username')

    class Meta:
        model = User
        fields = ['username']


class TimeLapseViewSet(ModelViewSet):
    queryset = TimeLapse.objects.all()
    serializer_class = TimeLapseSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        try:
            serializer.save(
                username=self.request.user.username
            )
        except IntegrityError:
            raise ValidationError({
                'detail': (
                    'Этот стол на выбранное время '
                    'уже забронирован.'
                )
            })

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsBookingOwnerOrAdmin()]

        return [IsAuthenticated()]
    filter_backends = [DjangoFilterBackend]
    filterset_class = TimeLapseFilter

    def get_object(self):
        if 'pk' in self.kwargs:
            self.lookup_field = 'pk'
        elif 'id' in self.kwargs:
            self.lookup_field = 'id'

        return super(TimeLapseViewSet, self).get_object()


#class UserViewSet(ModelViewSet):
#    queryset = User.objects.all().order_by('-date_joined')
#    serializer_class = UserSerializer
#    filter_backends = [DjangoFilterBackend]
#    filterset_class = UserFilter

class PlayerViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = PlayerSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = PlayerFilter

    def get_queryset(self):
        user = self.request.user

        if user.is_staff or user.is_superuser:
            return User.objects.all()

        return User.objects.filter(pk=user.pk)


class SignupViewSet(mixins.CreateModelMixin,
                    viewsets.GenericViewSet):
    queryset = get_user_model().objects.all()
    permission_classes = [AllowAny]
    serializer_class = serializers.SignupSerializer
