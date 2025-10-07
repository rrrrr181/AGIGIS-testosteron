"""
Custom forms module.
"""
from django import forms
from .models import GeojsonFiles, Regions


class GeojsonFilesForm(forms.ModelForm):
    class Meta:
        model = GeojsonFiles
        fields = ['name', 'file']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control w-100',
                'placeholder': 'Например, Москва'
            }),
            'file': forms.FileInput(attrs={
                'class': 'form-control w-100',
                'accept': '.geojson,.json'
            })
        }
        labels = {
            'name': 'Название',
            'file': 'Файл GeoJSON'
        }


class RegionsForm(forms.ModelForm):
    class Meta:
        model = Regions
        fields = ['name', 'layer', 'year', 'quarter', 'geojson_file', 'color']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control w-100',
                'placeholder': 'Например, ГОСБ'
            }),
            'layer': forms.TextInput(attrs={
                'class': 'form-control w-100',
                'placeholder': 'Например, ГОСБ'
            }),
            'year': forms.NumberInput(attrs={
                'class': 'form-control w-100',
                'placeholder': 'Например, 2024'
            }),
            'quarter': forms.NumberInput(attrs={
                'class': 'form-control w-100',
                'placeholder': 'Например, 1'
            }),
            'geojson_file': forms.Select(attrs={
                'class': 'form-control w-100',
            }),
            'color': forms.TextInput(attrs={
                'type': 'color',
                'class': 'w-100',
            })
        }
        labels = {
            'name': 'Название',
            'layer': 'Слой',
            'year': 'Год',
            'quarter': 'Квартал',
            'geojson_file': 'Файл GeoJSON',
            'color': 'Цвет'
        }


class UploadForm(forms.Form):
    file = forms.FileField()