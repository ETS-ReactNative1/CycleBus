import json
from time import sleep
from bus.models import Ride
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
        text_data=json.loads(text_data)
        try:
            data_type = text_data['type']
            data = text_data['data']
            user = self.scope.get('user',None)
            ride_id = self.scope['url_route']['kwargs'].get('id',None)
            ride = Ride.objects.get(ride_id=ride_id)
            ride.current_location=data
            ride.save()

            if user is not None and ride_id is not None:
                async_to_sync(self.channel_layer.group_send)(
                    ride_id,
                    {
                        'type':data_type,
                        'data':data,
                    }
                )
        except Exception as e:
            print(e)

    def loc(self, res):
        self.send(json.dumps( res))

    def ins(self, res):
        self.send(json.dumps( res))
