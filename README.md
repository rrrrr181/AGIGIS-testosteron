[crud_regions.html](https://github.com/user-attachments/files/22781670/crud_regions.html)
{% extends 'base.html' %}
{% load static %}

{% block extra_css %}


{% endblock %}[regions.css](https://github.com/user-attachments/files/22781671/regions.css)* {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    body {
        background: url('{AGiGIS/templates/photo_2025-10-06 22.22.08.jpeg}') no-repeat center center fixed;
        background-size: cover;
        color: #fff;
        min-height: 100vh;
        padding: 20px;
        position: relative;
    }
    
    body::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: -1;
    }
    
    .container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 30px;
    }
    
    header {
        text-align: center;
        padding: 20px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    h1 {
        font-size: 28px;
        margin-bottom: 10px;
        color: #fff;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
    
    .admin-panel {
        font-size: 18px;
        color: #a0c8ff;
        font-weight: 500;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }
    
    .main-content {
        display: flex;
        gap: 30px;
        flex-wrap: wrap;
    }
    
    .table-section {
        flex: 1;
        min-width: 300px;
        background: rgba(30, 40, 80, 0.7);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .form-section {
        flex: 1;
        min-width: 300px;
        background: rgba(30, 40, 80, 0.7);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .file-section {
        background: rgba(30, 40, 80, 0.7);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        margin-top: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    h2 {
        font-size: 20px;
        margin-bottom: 20px;
        color: #a0c8ff;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        padding-bottom: 10px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }
    
    input, select {
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        background: rgba(255, 255, 255, 0.15);
        color: white;
        font-size: 16px;
        transition: all 0.3s;
    }
    
    input:focus, select:focus {
        outline: none;
        border-color: #4a90e2;
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.3);
    }
    
    input::placeholder {
        color: rgba(255, 255, 255, 0.6);
    }
    
    .color-input {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .color-preview {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        background: transparent;
    }
        
    th, td {
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
        
    th {
        color: #a0c8ff;
        font-weight: 600;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }
        
    tr:hover {
        background: rgba(255, 255, 255, 0.05);
    }
    
    .edit-btn {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        padding: 8px 15px;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.3s;
        font-weight: 500;
    }
    
    .edit-btn:hover {
        background: rgba(255, 255, 255, 0.3);
    }
    
    .upload-btn {
        background: #4a90e2;
        color: white;
        border: none;
        padding: 15px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s;
        margin-top: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        width: 100%;
    }
    
    .upload-btn:hover {
        background: #3a7bc8;
        transform: translateY(-2px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
    }

    .messages {
        margin-bottom: 20px;
    }
    
    .alert {
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 10px;
        border: 1px solid transparent;
    }
    
    .alert-success {
        background: rgba(40, 167, 69, 0.2);
        border-color: rgba(40, 167, 69, 0.3);
        color: #75b798;
    }
    
    .alert-error {
        background: rgba(220, 53, 69, 0.2);
        border-color: rgba(220, 53, 69, 0.3);
        color: #e6a2a9;
    }

    .django-form input,
    .django-form select,
    .django-form textarea {
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        background: rgba(255, 255, 255, 0.15);
        color: white;
        font-size: 16px;
        margin-bottom: 15px;
    }
    
    .django-form label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
    }
    
    .django-form .error {
        color: #ff6b6b;
        font-size: 14px;
        margin-top: 5px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }

    @media (max-width: 768px) {
        .main-content {
            flex-direction: column;
        }
        
        h1 {
            font-size: 24px;
        }
        
        .admin-panel {
            font-size: 16px;
        }
    }

<link rel="stylesheet" href="AGiGIS/templates/regions.css">
{% block content %}
<div class="container">
    
    {% if messages %}
    <div class="messages">
        {% for message in messages %}
        <div class="alert alert-{{ message.tags }}">{{ message }}</div>
        {% endfor %}
    </div>
    {% endif %}

    <header>
        <h1>Картографический сервис ЦК АГиГИС</h1>
        <div class="admin-panel">Панель администратора</div>
    </header>
    
    <div class="main-content">
       
        <div class="table-section">
            <h2>Загруженные данные</h2>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Наименование</th>
                            <th>Слой</th>
                            <th>Год</th>
                            <th>Квартал</th>
                            <th>Файл</th>
                            <th>Цвет</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {% for file in files %}
                        <tr>
                            <td>{{ file.id }}</td>
                            <td>{{ file.name }}</td>
                            <td>{{ file.layer }}</td>
                            <td>{{ file.year }}</td>
                            <td>{{ file.quarter }}</td>
                            <td>{{ file.geojson_file.name|truncatechars:20 }}</td>
                            <td>
                                <div class="color-preview" style="background-color: {{ file.color }};"></div>
                            </td>
                            <td>
                                <button class="edit-btn">Редактировать</button>
                            </td>
                        </tr>
                        {% empty %}
                        <tr>
                            <td colspan="8" style="text-align: center; color: rgba(255,255,255,0.7);">
                                Нет загруженных данных
                            </td>
                        </tr>
                        {% endfor %}
                    </tbody>
                </table>
            </div>
        </div>
        
       
        <div class="form-section">
            <h2>Добавить данные</h2>
            <form method="POST" enctype="multipart/form-data" class="django-form">
                {% csrf_token %}
                
                <div class="form-group">
                    <label for="{{ form.name.id_for_label }}">{{ form.name.label }}</label>
                    {{ form.name }}
                    {% if form.name.errors %}
                    <div class="error">{{ form.name.errors }}</div>
                    {% endif %}
                </div>
                
                <div class="form-group">
                    <label for="{{ form.layer.id_for_label }}">{{ form.layer.label }}</label>
                    {{ form.layer }}
                    {% if form.layer.errors %}
                    <div class="error">{{ form.layer.errors }}</div>
                    {% endif %}
                </div>
                
                <div class="form-group">
                    <label for="{{ form.year.id_for_label }}">{{ form.year.label }}</label>
                    {{ form.year }}
                    {% if form.year.errors %}
                    <div class="error">{{ form.year.errors }}</div>
                    {% endif %}
                </div>
                
                <div class="form-group">
                    <label for="{{ form.quarter.id_for_label }}">{{ form.quarter.label }}</label>
                    {{ form.quarter }}
                    {% if form.quarter.errors %}
                    <div class="error">{{ form.quarter.errors }}</div>
                    {% endif %}
                </div>
                
                <div class="form-group">
                    <label for="{{ form.geojson_file.id_for_label }}">{{ form.geojson_file.label }}</label>
                    {{ form.geojson_file }}
                    {% if form.geojson_file.errors %}
                    <div class="error">{{ form.geojson_file.errors }}</div>
                    {% endif %}
                </div>
                
                <div class="form-group">
                    <label for="{{ form.color.id_for_label }}">{{ form.color.label }}</label>
                    <div class="color-input">
                        {{ form.color }}
                        <div class="color-preview" id="colorPreview"></div>
                    </div>
                    {% if form.color.errors %}
                    <div class="error">{{ form.color.errors }}</div>
                    {% endif %}
                </div>
                
                <button type="submit" name='action' value="upload" class="upload-btn">Загрузить данные</button>
            </form>
        </div>
    </div>
    
    
    <div class="file-section">
        <h2>Загрузка файла</h2>
        <form method="POST" enctype="multipart/form-data" class="django-form">
            {% csrf_token %}
            <div class="form-group">
                <label for="{{ form_for_file.geojson_file.id_for_label }}">{{ form_for_file.geojson_file.label }}</label>
                {{ form_for_file.geojson_file }}
                {% if form_for_file.geojson_file.errors %}
                <div class="error">{{ form_for_file.geojson_file.errors }}</div>
                {% endif %}
            </div>
            <button type="submit" name='for_upload' value="file" class="upload-btn">Загрузить файл</button>
        </form>
    </div>
</div>
{% endblock %}

{% block extra_js %}
<script>
    
    document.addEventListener('DOMContentLoaded', function() {
        const colorInput = document.getElementById('{{ form.color.id_for_label }}');
        const colorPreview = document.getElementById('colorPreview');
        
        if (colorInput && colorPreview) {
            
            colorPreview.style.backgroundColor = colorInput.value || '#007bff';
            
            
            colorInput.addEventListener('input', function() {
                colorPreview.style.backgroundColor = this.value;
            });
        }
    });
</script>
{% endblock %}
