"""
Django models module.
"""
from django.db import models


class GeojsonFiles(models.Model):
    name = models.CharField(max_length=256, verbose_name="Наименование")
    file = models.FileField(upload_to="geojson_files/", verbose_name="Файл")

    def __str__(self):
        return self.name


class Regions(models.Model):
    name = models.CharField(max_length=256, verbose_name="Наименование")
    layer = models.CharField(max_length=256, verbose_name="Слой")
    year = models.IntegerField(verbose_name="Год", default=2024)
    quarter = models.IntegerField(verbose_name="Квартал", default=1)
    geojson_file = models.ForeignKey(
        GeojsonFiles,
        on_delete=models.CASCADE,
        verbose_name="GeoJSON файл"
    )
    color = models.CharField(
        max_length=7,
        verbose_name="Цвет",
        default="#000000"
    )

    def __str__(self):
        return self.name

    def get_geojson_url(self):
        return self.geojson_file.file.url