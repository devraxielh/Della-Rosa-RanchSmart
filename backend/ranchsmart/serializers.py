from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import Potrero, Pasto

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'username': self.user.username,
            'email': self.user.email,
        }
        return data

class PastoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pasto
        fields = '__all__'


class PotreroSerializer(serializers.ModelSerializer):
    pasto = serializers.PrimaryKeyRelatedField(queryset=Pasto.objects.all(), write_only=True)
    pasto_nombre = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Potrero
        fields = '__all__'

    def get_pasto_nombre(self, obj):
        return obj.pasto.nombre if obj.pasto else None

    def validate_coordenadas(self, value):
        if not isinstance(value, list) or len(value) < 3:
            raise serializers.ValidationError("Se requieren al menos 3 coordenadas válidas.")
        for punto in value:
            if not (isinstance(punto, list) and len(punto) == 2 and all(isinstance(c, (int, float)) for c in punto)):
                raise serializers.ValidationError("Cada coordenada debe ser [lat, lng].")
        return value