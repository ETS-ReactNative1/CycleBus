from django.conf import settings
from django.db import models
from django.utils import timezone


class Parent(models.Model):
    parent_id = models.IntegerField(primary_key=True)
    work_address = models.CharField(max_length=200)
    user_id = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_on = models.DateTimeField(default=timezone.now)
    last_updated = models.DateTimeField(blank=True, null=True)

    def publish(self):
        self.last_updated = timezone.now()
        self.save()

    def __str__(self):
        return self.parent_id


class Child(models.Model):
    child_id = models.IntegerField(primary_key=True)
    start_location = models.ForeignKey(
        "bus.Location", verbose_name="location", related_name="child_start_location", on_delete=models.CASCADE)
    end_location = models.ForeignKey(
        "bus.Location", verbose_name="location", related_name="child_end_location", on_delete=models.CASCADE)
    join_location = models.ForeignKey(
        "bus.Location", verbose_name="location", related_name="child_join_location", on_delete=models.CASCADE)
    parent = models.ForeignKey("Parent", verbose_name="parent",
                               related_name="child_parent", on_delete=models.CASCADE)
    user_id = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_on = models.DateTimeField(default=timezone.now)
    last_updated = models.DateTimeField(blank=True, null=True)

    def publish(self):
        self.last_updated = timezone.now()
        self.save()

    def __str__(self):
        return self.child_id


class Profile(models.Model):
    profile_id = models.IntegerField(primary_key=True)
    telephone_no1 = models.CharField(max_length=10)
    telephone_no2 = models.CharField(max_length=10)
    address = models.CharField(max_length=200)
    user_id = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_on = models.DateTimeField(default=timezone.now)
    last_updated = models.DateTimeField(blank=True, null=True)

    def publish(self):
        self.last_updated = timezone.now()
        self.save()

    def __str__(self):
        return self.profile_id
