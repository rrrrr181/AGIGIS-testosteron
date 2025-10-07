"""
Django urls module.
"""
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import city_map, admin_panel, crud_geojson, edit_geojson, crud_regions, get_regions_by_layer , Main_display 


urlpatterns = [
    path("Main_display" , Main_display , name='Main_display'),
    path("", city_map, name="city_map"),
    path("admin_panel/", admin_panel, name="admin_panel"),
    path("admin_panel/crud_geojson/", crud_geojson, name="crud_geojson"),
    path("admin_panel/crud_geojson/edit_geojson/<int:id>/", edit_geojson, name="edit_geojson"),
    path("admin_panel/crud_regions/", crud_regions, name="crud_regions"),
    path("api/regions/<str:layer_name>/<str:year_choice>/<str:quarter_choice>/", get_regions_by_layer, name="regions_by_layer")
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)