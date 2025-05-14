from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PotreroViewSet, PastoViewSet,CustomTokenObtainPairView

router = DefaultRouter()
router.register(r'potreros', PotreroViewSet)
router.register(r'pastos', PastoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
]