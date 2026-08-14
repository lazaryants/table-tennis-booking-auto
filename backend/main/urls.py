from rest_framework import routers

from .views import TimeLapseViewSet, PlayerViewSet, SignupViewSet


router = routers.DefaultRouter()
router.register('timelapses', TimeLapseViewSet)
router.register('users', PlayerViewSet)
router.register('signup', SignupViewSet)

urlpatterns = router.urls
