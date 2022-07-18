# DreamJourney / Dream Journal

---

## Overview of the Project

---

DreamJourney is a web application that allows users to log their travel destination and their respective stay location and travel activities.

<img src="./README-images/img1.png" width="50%">

## Quick Start Guide

---

To run the application locally, you are required to have an account with three service providers:

- Auth0
- Mapbox
- MongoDB

### Auth0:

- Once you have created a new account, please create a new project.
- Note down the **Domain** and **Client ID**
- Set Allowed Callback URLs, Allowed Logout URLs and Allowed Web Origins to http://localhost:3000 ← This is what is used for the react localhost. If you are planning to run the react application on a different port, please change it accordingly.
- Please also create a new API and create your **identifier**. Make a note of your Identifier as it's required to run our platform locally.

### Mapbox:

- Create an account with Mapbox and note down the "Default public token".

### MongoDB:

 MongoDB Altas was used for this prohect. You are free to use any NoSQL databases you preferred.

- Create an account with MongoDB then create a Cluster.
- Under Clusters, head to your cluster and click "CONNECT", then "Connect your application" and note down the connection string. Please replace the `password` with your account password, and replace `myFirstDatabase` with the name of the database name you prefer.

### Setup & run locally

---

Open the project and head to `frontend`>`.env` to enter the service provider details in the following format:

```jsx
REACT_APP_AUTH0_DOMAIN=**your_auth0_domain**
REACT_APP_AUTH0_CLIENT_ID=**your_auth0_client_id**
REACT_APP_MAPBOX=**your_mapbox_token**
```

Now to setup your MongoDB connection, head to `backend`>`.env`, and enter your mongoDB connection string, Auth0 domain, and Auth0 API identifier:

```jsx
DB_CONNECTION=**mongodb+srv://your_username:your_password@your_mongoD_connnection_string**

DOMAIN=**your_auth0_domain**
AUDIENCE=**your_auth0_api_identifier**
```

**For a quick start, I have included a .env.example file which you can simply copy and paste to your own .env files. The .env.example file is available for both the frontend and backend.**

### Install the dependencies

Using npm, cd frontend and cd backend to install dependencies:

```markdown
$npm install
```

### Start the website

**Using npm:**

- First `$cd frontend` and run

    ```
    $cd frontend
    $npm start
    ```

- Similarly, on a seperate terminal, `$cd backend` and run

    ```
    $cd backend
    $npm start
    ```

The web application will now run in your default browser at: [http://localhost:3000/](http://localhost:3000/) (frontend) and [http://localhost:3001/](http://localhost:3000/) (backend).

## Website Features

---

The website helps our users to brainstorm different travel destinations, save their ideas and notes, all in one place. I used [Mapbox](http://mapbox.com) to help users visualise all the destinations they are planning to visit.

### Login/ Logout

Immediately you will find yourself on the Auth0 login page. The user must log in to use the platform. The login feature allows users to save their trips and details in their respective account.

### Home Page / Trips Overview

Upon loading, you will see a map that contains markers of all the destinations you have saved. To add a new marker, head to the "Add Trip" section, type in the destination, start date and end date of the trip. This will also add the trip to the "Trips List" section of the page, where you can edit, delete or view the trip. Clicking "view" will redirect you to the trip details page, where you can enter the activities and stay locations for the particular trip.

<img src="./README-images/img2.png" width="50%">


### View Activity/ Stay

Here you will see all the activities and stay details of the specific trip. This allows you to plan your trip ahead of time and give you a good glance at all the places you will be visiting during the trip. To add an activity or stay, click on the activity or stay tab and enter the location and travel details. Once added, the page will display the details in the summary tab, and a marker will appear on the map (stays are in green and activities are in blue). Similar to trips, the user can also change or delete the activity/ trip by clicking the "edit" or "delete" button, respectively.

<img src="./README-images/img3.png" width="50%">


Map that show all the activities and stay locations within the selected trip

<img src="./README-images/img4.png" width="50%">


Add stay and add location panel

<img src="./README-images/img5.png" width="50%">


See a summary of all your activities and stay locations all in one place

### Search Field AutoComplete

A list of auto-generated interest points will display as you type in the destination on the search field. This is implemented for all search fields and is tailored to the specific location type. For example, adding a destination on the home page will only show regions and cities. This allows users to quickly find the destination they after and also increase the accuracy of the coordinates saved in the database.

<img src="./README-images/img6.png" width="30%">


Destination search on the home page only shows regions and cities.

<img src="./README-images/img7.png" width="30%">


Whereas more variety of destinations are shown on the stay page.

### Map

A map is included for both the home page and the activity/ stay page. The map on the homepage represents all the destinations the user has entered. In contrast, the map on the activity/ stay page shows the specific stay and activity locations the user is planning to do within the specific destination.

## Tools used in this project

---

### Material UI

Material UI is a popular React UI framework. As Material UI includes a comprehensive set of UI components, we decided to use Material UI for faster and easier UI development. Material UI is used in many parts of the project, such as navigation bar, buttons and presentation of data. 

### Auth0

Auth0 is an authentication service that allowed us to implement authentication and enhance the security of our app without sacrificing development time.

### Mapbox

Mapbox is a map and location service for developers. It offers a huge range of API-based services that allow users to present a different type of map-related data. For this project, I used two of its services: Mapbox GL JS and Geocoding API.

Mapbox GL JS is a Javascript library that uses WebGL to render interactive maps. The project used Mapbox to generate a map that displays all the trips and all the activity and stay location of the selected trip. To implement Mapbox GL JS in our app, Tutorial followed can be found here [tutorial](https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/) on the official website.

The Geocoding API allows us to perform *forward geocoding,* which converts location text into geographic coordinates. This API is useful to store locations in coordinates to display the locations accurately on the map. A reusable component first converts the user's input into an accurate description of the location, then converts the description into geographic coordinates using the Geocoding API.

Mapbox was chosen for this project because their documentation is excellent and it offers a generous free tier (up to 50,000 map loads request and 100,000 geocoding request monthly for free!). 

### MongoDB Atlas

MongoDB is a fully managed cloud database service offered by MongoDB.

## Testing

---

Code were tested two ways: manual testing and unit testing. Manual testing were done using console.logs across the system. Whereas, unit testing were done on both the frontend and backend.

For the frontend, we developed 5 suitcases (comprise of 22 cases) to test all important and viewable components by looking for key components(e.g. buttons) and keywords (e.g. EDIT/ DELETE) that should appear in front of the client. We also developed a test case to check the validity of Mapbox's geocoding API. To run tests:

```java
$cd frontend
$npm test
```

For the backend, 3 testing files were developed (comprise of 30 cases) to test all three API routes: trips, activities, and stays. Each testing file will test on different methods to retrieve the data from API (GET, POST, PUT, DELETE).

To test Auth0, please replace the credentials in autho_config.json.

To run tests:

```java
$cd backend
$npm test
```
