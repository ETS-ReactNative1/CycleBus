import json
from time import sleep
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

class WSConsumer(WebsocketConsumer):
    def connect(self):
        async_to_sync(self.channel_layer.group_add)(
            'parents',
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            'parents',
            self.channel_name
        )

    def receive(self, text_data):
        async_to_sync(self.channel_layer.group_send)(
            'parents',
            {
                'type':'loc',
                'text':text_data,
            }
        )

    def loc(self, res):
        self.send(text_data=json.dumps(
            res["text"]
        ))
