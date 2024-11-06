# Generated by Django 5.1.1 on 2024-10-08 02:24

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('laboratorios', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Observacao',
            fields=[
                ('id_observacao', models.AutoField(primary_key=True, serialize=False)),
                ('observacao', models.TextField()),
                ('data', models.DateField()),
                ('id_dispositivo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='observacoes', to='laboratorios.dispositivos')),
                ('id_sala', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='observacoes', to='laboratorios.laboratorio')),
            ],
        ),
    ]