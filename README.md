# Cycle Bus

Cycle Bus is a mobile application which accomodates the requirements of cycle bus community, an initiative to promote cycling among school children. Children are guided by a Marshal who can be a parent or a volunteer. 
Apart from the mobile application Django administration site is implemented as a webbased system.

## Demo

[![Watch the video](https://img.youtube.com/vi/Oqf4gTRgd74/maxresdefault.jpg)](https://youtu.be/Oqf4gTRgd74)

## Main Features

1. Registration of parents and children to the mobile app
2. Register the child to a cycle bus by the parent
3. Select the join location of the child for each route of the cycle bus
4. Starting a ride by marshal 
5. Retrieve the GPS location of the marshal
6. Map views to both parent and Marshal 
7. Mark the participation of the child by the parent. 
8. Enabling parents to track the location of cycle bus
9. Incident reporting by marshal
10. Display data to parent(incident, weather data, and reach the time of cycle bus to join location of the child)
11. Mark and check the attendance of the child
12. Enabling Admin user to set default marshal and route for a cycle bus

## Table of Contents

* [Software prerequisites](#software-prerequisites)
* [Setup Instructions](#setup-instructions)
* [Troubleshooting](#troubleshooting)


## Software prerequisites

Install the below tools/packages

| Serial No   | Software           | Installation site |
| :---------: | :----------------: | :---------------- |
| 1           | Node.js            | [Install NodeJS](https://nodejs.org/en/download/) |
| 2           | npm                | [Install NPM](https://www.npmjs.com/get-npm)      |
| 3           | react-native       | [Install react-native](https://www.npmjs.com/package/react-native) |
| 4           | react-native-cli   | [Install react-native-cli](https://www.npmjs.com/package/react-native-cli) |
| 5           | exp                | [Install Expo](https://www.npmjs.com/package/exp) |
| 6           | Python             | [Install Python](https://www.python.org/downloads/) |
| 7           | pip                | [Install pip](https://pip.pypa.io/en/stable/installation/) |
| 8           | Django             | [Install Django](https://docs.djangoproject.com/en/4.0/topics/install/) |


## Setup Instructions

### Frontend

#### System setup

1. Clone the repository with ```git clone [REPO_URL]``` command
2. Navigate to the project's root directory(frontend) in terminal
3. Install the dependencies by running ```npm install```
4. Once 'npm install' is completed, run ```exp start``` to start the expo and react-native server
5. If a QR code and a link shown on the terminal installation are successful

#### Mobile setup

1. Install the 'Expo' application on your android/iOS device. Follow the [link](https://expo.io/tools#client).
2. Scan the QR code shown on the terminal.
3. Once the QR code is successfully scanned, it will take a few seconds to load and render the app.

### Backend

Navigate to the root directory(backend)

Then install the dependencies:

```sh
$ pip install -r requirements.txt
```

Once `pip` has finished downloading the dependencies:
```sh
$ python manage.py runserver
```

### Configuring IP Address

Change the IP address in line 5 of APIKit.js, IP address in line 73 of ParentRideView.js and IP address in line 68 of MarshalRideView to your IP address.


## Troubleshooting

### Networking

Make sure your mobile device and server are connected to same Local Area Network.
