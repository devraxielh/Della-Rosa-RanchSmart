# Generated by Django 5.2.1 on 2025-05-17 17:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ranchsmart', '0004_potrero_area_m2'),
    ]

    operations = [
        migrations.CreateModel(
            name='Precipitacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha', models.DateField()),
                ('milimetros', models.FloatField(help_text='Cantidad de lluvia en mm')),
                ('observaciones', models.TextField(blank=True, null=True)),
            ],
        ),
    ]
