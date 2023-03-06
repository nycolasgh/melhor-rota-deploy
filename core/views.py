from django.shortcuts import render, redirect
from django.contrib.auth.models import User  # para usar o sistema de usuários nativos...
from django.contrib.auth import authenticate, login, logout  # ...do django precisamos dessas importações
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.conf import settings
from django.contrib.auth.decorators import login_required
from .models import *


# Create your views here.
"""
def loginPage(request):
    page = 'login'

    if request.user.is_authenticated:
        return redirect('home')

    if request.method == 'POST':  # Se o método da requisição for post
        username = request.POST.get(
            'username')  # vamos atribuir a uma variável o valor da requisição com name igual a "username"
        password = request.POST.get('password')  # mesma coisa com a senha

        try:
            user = User.objects.get(username=username)  # vamos verificar se o nome deste usuário está no banco de dados
        except:  # se não estiver, vamos mostrar uma mensagem de erro, para isso vamos utilizar a função flash message do django
            messages.error(request, 'Usuário não existe.')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Usuário ou senha incorretos.')

    context = {'page': page}
    return render(request, 'core/login_register.html', context)


def logoutUser(request):
    logout(request)
    return redirect('home')


def registerPage(request):
    form = UserCreationForm()

    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)  # commit=False para não salvar o form antes de tratarmos os dados
            user.username = user.username.lower()  # usamos o método lower() d
            user.save()
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Ocorreu um erro durante o registro.')

    return render(request, 'core/login_register.html', {'form': form})

"""


def userProfile(request, pk):
    context = {}
    return render(request, 'core/user_profile.html', context)


def home(request):
    context = {}
    return render(request, 'core/home.html', context)

@login_required(login_url='account_login')
def route(request):
    context = {"google_api_key": settings.GOOGLE_API_KEY}
    return render(request, 'core/route.html', context)
