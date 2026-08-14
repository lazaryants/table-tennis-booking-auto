from datetime import datetime, time

from django.conf import settings
from django.utils import timezone
from rest_framework import permissions


class IsBookingOwnerOrAdmin(permissions.BasePermission):
    """
    Обычный пользователь может изменять только свои брони.

    Удалить свою бронь пользователь может не позднее чем за
    BOOKING_CANCEL_HOURS часов до начала слота.

    Администратор может изменять и удалять любые брони
    без временного ограничения.
    """

    def has_object_permission(self, request, view, obj):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        if user.is_staff or user.is_superuser:
            return True

        if obj.username != user.username:
            return False

        if view.action != 'destroy':
            return True

        cancel_hours = getattr(
            settings,
            'BOOKING_CANCEL_HOURS',
            2,
        )

        # В старой модели time_lapse хранит конец интервала:
        # time_lapse=14 означает бронь 13:00-14:00.
        slot_start_hour = obj.time_lapse - 1

        slot_start = timezone.make_aware(
            datetime.combine(
                obj.date,
                time(hour=slot_start_hour),
            ),
            timezone.get_current_timezone(),
        )

        now = timezone.localtime()

        return (
            slot_start - now
        ).total_seconds() >= cancel_hours * 3600
