"""
Django views module.
"""
import pandas as pd
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import JsonResponse
from django.conf import settings
from .models import GeojsonFiles, Regions
from .forms import GeojsonFilesForm, RegionsForm, UploadForm


def city_map(request):
    layers = Regions.objects.values_list('layer', flat=True).distinct()
    return render(request, 'city_map.html', {'layers': layers})


def get_regions_by_layer(request, layer_name, year_choice, quarter_choice):
    regions = Regions.objects.filter(layer=layer_name, year=year_choice, quarter=quarter_choice).select_related('geojson_file')
    regions_data = []
    for region in regions:
        regions_data.append({
            'name': region.name,
            'layer': region.layer,
            'color': region.color,
            'geojson_file': region.get_geojson_url()
        })

    return JsonResponse(regions_data, safe=False)


def admin_panel(request):
    return render(request, 'admin_panel.html')

def Main_display(request):
    return render(request, 'Main_display.html')


def crud_geojson(request):
    files = GeojsonFiles.objects.all()
    if request.method == 'POST' and request.POST.get('action') == 'upload':
        form = GeojsonFilesForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Файл успешно сохранён')
            return redirect(crud_geojson)
        else:
            messages.error(request, 'Ошибка при сохранении файла')
            return render(request, 'crud_geojson.html', context={"form": form, "files": files})
    else:
        form = GeojsonFilesForm()
        return render(request, 'crud_geojson.html', context={'form': form, 'files': files})


def edit_geojson(request, id):
    post = get_object_or_404(GeojsonFiles, id=id)
    if request.method == 'GET':
        context = {'form': GeojsonFilesForm(instance=post), 'id': id}
        return render(request, 'edit_geojson.html', context)
    elif request.method == 'POST':
        form = GeojsonFilesForm(request.POST, instance=post)
        if form.is_valid():
            form.save()
            messages.success(request, 'Файл успешно сохранён')
            return redirect(crud_geojson)
        else:
            messages.error(request, 'Ошибка при сохранении файла')
            return render(request, 'crud_geojson.html')


def crud_regions(request):
    files = Regions.objects.all()
    if request.method == 'POST' and request.POST.get('action') == 'upload':
        form = RegionsForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Запись успешно создана')
            return redirect(crud_regions)
        else:
            messages.error(request, 'Ошибка при создании записи')
            return render(request, 'crud_regions.html', context={"form": form, "files": files})
    else:
        form = RegionsForm()
        if request.method == 'POST' and request.POST.get('for_upload') == 'file':
            form_for_file = UploadForm(request.POST, request.FILES)
            if form_for_file.is_valid():
                uploaded_file = form_for_file.cleaned_data['file']
                df = pd.read_excel(uploaded_file, dtype=str)
                for _, row in df.iterrows():
                    region = GeojsonFiles.objects.get(name=row['geojson_file'])
                    row_in_table = Regions.objects.create(name=row['name'], layer=row['layer'], year=row['year'], quarter=row['quarter'], color=row['color'], geojson_file=region)
                    messages.success(request, 'Файл успешно сохранен')
                    return redirect(crud_regions)
            else:
                messages.error(request, 'Ошибка при создании записи')
                return render(request, 'crud_regions.html', context={"form_for_file": form_for_file, "files": files})
        else:
            form_for_file = UploadForm()
            return render(request, 'crud_regions.html', context={'form': form, 'files': files, 'form_for_file': form_for_file})