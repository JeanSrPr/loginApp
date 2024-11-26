from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from .models import Usuario, Asistencia
from .serializers import UsuarioSerializer
from django.http import JsonResponse
from .models import Asistencia
from django.utils.crypto import get_random_string
from django.contrib.auth.hashers import make_password
import json
from django.views.decorators.csrf import csrf_exempt
import random
from datetime import datetime, timedelta
from django.utils.timezone import now # Asegúrate de importar timezone
from datetime import timedelta  # Asegúrate de importar timedelta
from django.utils import timezone




@csrf_exempt
def registro_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            serializer = UsuarioSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse({'message': 'Usuario registrado correctamente.'}, status=201)
            return JsonResponse({'error': serializer.errors}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Cuerpo de solicitud no válido.'}, status=400)
    return JsonResponse({'error': 'Método no permitido.'}, status=405)
@api_view(['POST'])
def login_api(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(request, username=email, password=password)
    
    if user is not None:
        login(request, user)
        return Response({
            "message": "Login exitoso",
            "email": user.email,
            "tipo_usuario": user.tipo_usuario  # Suponiendo que `tipo_usuario` es un campo del modelo Usuario
        })
    return Response({"error": "Credenciales inválidas"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_tipo_usuario(request, email):
    try:
        usuario = Usuario.objects.get(email=email)  # Busca el correo completo
        return Response({'tipo_usuario': usuario.tipo_usuario})
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def logout_api(request):
    logout(request)
    return Response({"message": "Logout exitoso"}, status=status.HTTP_200_OK)

#----------------------------------------------------------------------
@api_view(['POST'])
def registrar_asistencia(request):
    email = request.data.get('email')  # Obtener el correo del cuerpo de la solicitud
    try:
        usuario = Usuario.objects.get(email=email)  # Verificar si el usuario existe
        Asistencia.objects.create(usuario=usuario)  # Registrar la asistencia
        return Response({"message": "Asistencia registrada correctamente"}, status=status.HTTP_201_CREATED)
    except Usuario.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    
def listar_asistencias(request):
    asistencias = Asistencia.objects.select_related('usuario').all()
    datos = [
        {
            'usuario': asistencia.usuario.email,
            'fecha_hora': asistencia.fecha_hora,
        }
        for asistencia in asistencias
    ]
    return JsonResponse({'asistencias': datos})

@api_view(['DELETE'])
def limpiar_asistencias(request):
    Asistencia.objects.all().delete()
    return JsonResponse({"message": "Todas las asistencias han sido eliminadas."}, status=200)
#----------------------------------------------------------------
@csrf_exempt
def solicitar_codigo(request):
    if request.method == 'POST':
        try:
            # Procesa el cuerpo de la solicitud
            data = json.loads(request.body)
            email = data.get('email')  # Obtén el correo electrónico

            if email:
                try:
                    usuario = Usuario.objects.get(email=email)
                    # Genera un código aleatorio de 6 dígitos
                    codigo = str(random.randint(100000, 999999))
                    usuario.codigo_restablecimiento = codigo
                    usuario.codigo_expiracion = timezone.now() + timedelta(minutes=10)  # Expira en 10 minutos
                    usuario.save()  # Guarda los cambios
                    return JsonResponse({'message': 'Código enviado correctamente.'}, status=200)
                except Usuario.DoesNotExist:
                    return JsonResponse({'error': 'Usuario no encontrado.'}, status=404)
            else:
                return JsonResponse({'error': 'Email no proporcionado.'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Cuerpo de solicitud no válido.'}, status=400)
    return JsonResponse({'error': 'Este endpoint requiere un POST.'}, status=405)
@csrf_exempt
def actualizar_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            codigo = data.get('codigo')
            nueva_password = data.get('nueva_password')

            if not codigo or not nueva_password:
                return JsonResponse({'error': 'Datos incompletos.'}, status=400)

            # Busca al usuario con el código válido
            try:
                usuario = Usuario.objects.get(
                    codigo_restablecimiento=codigo, 
                    codigo_expiracion__gte=now()
                )
            except Usuario.DoesNotExist:
                return JsonResponse({'error': 'Código inválido o expirado.'}, status=400)

            # Actualiza la contraseña
            usuario.set_password(nueva_password)
            usuario.codigo_restablecimiento = None  # Limpia el código
            usuario.codigo_expiracion = None       # Limpia la expiración
            usuario.save()

            return JsonResponse({'message': 'Contraseña actualizada correctamente.'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Cuerpo de solicitud no válido.'}, status=400)
    return JsonResponse({'error': 'Método no permitido.'}, status=405)

@csrf_exempt
def obtener_codigo_expiracion(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')

            if not email:
                return JsonResponse({'error': 'Email no proporcionado.'}, status=400)

            try:
                usuario = Usuario.objects.get(email=email)
                if usuario.codigo_restablecimiento and usuario.codigo_expiracion:
                    return JsonResponse({
                        'codigo_restablecimiento': usuario.codigo_restablecimiento,
                        'codigo_expiracion': usuario.codigo_expiracion,
                        'message': f"Tu código es {usuario.codigo_restablecimiento} y expira el {usuario.codigo_expiracion}"
                    }, status=200)
                else:
                    return JsonResponse({
                        'error': 'No se encontró un código de restablecimiento válido para este usuario.'
                    }, status=404)

            except Usuario.DoesNotExist:
                return JsonResponse({'error': 'Usuario no encontrado.'}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Cuerpo de solicitud no válido.'}, status=400)

    return JsonResponse({'error': 'Este endpoint requiere un POST.'}, status=405)

#------------------------------------------------------
def login_view(request):
    # Tu lógica de autenticación
    return JsonResponse({"message": "Login exitoso"})

def validate_view(request):
    # Tu lógica de validación
    return JsonResponse({"message": "Validación exitosa"})