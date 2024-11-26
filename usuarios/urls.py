from django.urls import path
from .views import (
    registro_api,
    login_api,
    get_tipo_usuario,
    logout_api,
    registrar_asistencia,
    listar_asistencias,
    limpiar_asistencias,
    solicitar_codigo,
    actualizar_password,
    obtener_codigo_expiracion,
)

urlpatterns = [
    path('api/registro/', registro_api, name='registro_api'),
    path('api/login/', login_api, name='login_api'),
    path('api/tipo_usuario/<str:email>/', get_tipo_usuario, name='get_tipo_usuario'),
    path('api/logout/', logout_api, name='logout_api'),
    path('api/registrar_asistencia/', registrar_asistencia, name='registrar_asistencia'),
    path('api/listar_asistencias/', listar_asistencias, name='listar_asistencias'),
    path('api/limpiar_asistencias/', limpiar_asistencias, name='limpiar_asistencias'),
    path('api/actualizar-password/', actualizar_password, name='actualizar_password'),
    path('api/solicitar-codigo/', solicitar_codigo, name='solicitar_codigo'),
    path('api/obtener-codigo-expiracion/', obtener_codigo_expiracion, name='obtener_codigo_expiracion'),
]
