from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from datetime import datetime, timedelta

# Manager personalizado para el modelo Usuario
class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("El usuario debe tener un correo electrónico")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError("El superusuario debe tener is_staff=True.")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("El superusuario debe tener is_superuser=True.")

        return self.create_user(email, password, **extra_fields)

# Modelo de usuario personalizado
class Usuario(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)  # Correo único
    tipo_usuario = models.CharField(max_length=10, choices=[('profesor', 'Profesor'), ('alumno', 'Alumno')])
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    # Campos para restablecimiento de contraseña
    codigo_restablecimiento = models.CharField(max_length=6, blank=True, null=True)
    codigo_expiracion = models.DateTimeField(blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['tipo_usuario']

    objects = UsuarioManager()

    def __str__(self):
        return self.email

# Modelo para registrar asistencias
class Asistencia(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)  # Relación con Usuario
    fecha_hora = models.DateTimeField(auto_now_add=True)  # Fecha y hora de registro

    def __str__(self):
        return f"Asistencia de {self.usuario.email} el {self.fecha_hora}"
