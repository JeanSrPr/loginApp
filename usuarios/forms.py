from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import Usuario

class RegistroForm(UserCreationForm):
    class Meta:
        model = Usuario
        fields = ['email', 'tipo_usuario', 'password1']
    
    # Opcional: Personalización de etiquetas y mensajes de ayuda
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'].label = "Correo electrónico"
        self.fields['tipo_usuario'].label = "Tipo de usuario"
        self.fields['password1'].label = "Contraseña"


class LoginForm(AuthenticationForm):
    username = forms.EmailField(label="Correo electrónico")
