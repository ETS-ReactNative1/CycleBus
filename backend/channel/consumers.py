import json
from time import sleep
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

class WSConsumer(WebsocketConsumer):
    def connect(self):
        #TODO check eligibility
        user = self.scope.get('user',None)
        ride_id = self.scope['url_route']['kwargs'].get('id',None)
        
        if user is not None and ride_id is not None:
            async_to_sync(self.channel_layer.group_add)(
                ride_id,
                self.channel_name
            )
            self.accept()

    def disconnect(self, close_code):
        user = self.scope.get('user',None)
        ride_id = self.scope['url_route']['kwargs'].get('id',None)

        if user is not None and ride_id is not None:
            async_to_sync(self.channel_layer.group_discard)(
                ride_id,
                self.channel_name
            )

    def receive(self, text_data):
        user = self.scope.get('user',None)
        ride_id = self.scope['url_route']['kwargs'].get('id',None)
        print(text_data)
        if user is not None and ride_id is not None:
            async_to_sync(self.channel_layer.group_send)(
                ride_id,
                {
                    'type':'loc',
                    'text':text_data,
                }
            )

    def loc(self, res):
        self.send(text_data=json.dumps(
            res["text"]
        ))
