# DreamJourney / Dream Journal

---

## Overview of the Project

---

DreamJourney is a web application that allows users to log their travel destination and their respective stay location and travel activities.

<img src="./README-images/img1.png" width="50%">

## Quick Start Guide

---

To run the application locally, you are required to have an account with two service providers:

- Auth0
- Mapbox
- MongoDB

### Auth0:

- Once you have created a new account, please create a new project.
- Note down the **Domain** and **Client ID**
- Set Allowed Callback URLs, Allowed Logout URLs and Allowed Web Origins to http://localhost:3000 ← This is what we used for our react localhost. If you are planning to run the react application on a different port, please change it accordingly.
- Please also create a new API and create your **identifier**. Make a note of your Identifier as it's required to run our platform locally.

### Mapbox:

- Create an account with Mapbox and note down the "Default public token".

### MongoDB:

We are using MongoDB Altas for database. You are free to use any NoSQL databases you prefer.

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

For a quick start, we have included a .env.example file which you can simply copy and paste to your own .env files. The .env.example file is available for both the frontend and backend.

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

The website helps our users to brainstorm different travel destinations, save their ideas and notes, all in one place. We use [Mapbox](http://mapbox.com) to help users visualise all the destinations they are planning to visit.

### Login/ Logout

Immediately you will find yourself on the Auth0 login page. The user must log in to use the platform. The login feature allows users to save their trips and details in their respective account.

### Home Page / Trips Overview

Upon loading, you will see a map that contains markers of all the destinations you have saved. To add a new marker, head to the "Add Trip" section, type in the destination, start date and end date of the trip. This will also add the trip to the "Trips List" section of the page, where you can edit, delete or view the trip. Clicking "view" will redirect you to the trip details page, where you can enter the activities and stay locations for the particular trip.

<img src="./README-images/img2.png" width="50%">


### View Activity/ Stay

Here you will see all the activities and stay details of the specific trip. This allows you to plan your trip ahead of time and give you a good glance at all the places you will be visiting during the trip. To add an activity or stay, click on the activity or stay tab and enter the location and travel details. Once added, the page will display the details in the summary tab, and a marker will appear on the map. Similar to trips, the user can also change or delete the activity/ trip by clicking the "edit" or "delete" button, respectively.

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

We originally planned to use Firebase to authenticate users initially. However, after implementing  Auth0 for one of the assignments, we felt Auth0 is a great alternative to Firebase. Given there were good documentation and tutorial on Auth0 and all team members now experience with Auth0, we decided that Auth0 was a better choice in this project.

### Mapbox

Mapbox is a map and location service for developers. It offers a huge range of API-based services that allow users to present a different type of map-related data. For this project, we used two of its services: Mapbox GL JS and Geocoding API.

Mapbox GL JS is a Javascript library that uses WebGL to render interactive maps. We used it to generate a map that displays all the trips and all the activity and stay location of the selected trip. To implement Mapbox GL JS in our app, we created a reusable component based on a [tutorial](https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/) we found on the official website. The overall implementation of this particular feature was not too difficult, and we are happy with the result.

The Geocoding API allows us to perform *forward geocoding,* which converts location text into geographic coordinates. This API is useful because we want to store locations in coordinates to display the locations accurately on the map. We created a reusable component that first converts the user's input into an accurate description of the location, then converts the description into geographic coordinates using the Geocoding API. Though this is slightly more challenging to implement, the overall experience was enjoyable. 

We selected Mapbox because the documentation was excellent and it offers a generous free tier (up to 50,000 map loads request and 100,000 geocoding request monthly for free!). 

### MongoDB Atlas

MongoDB is a fully managed cloud database service offered by MongoDB. We wanted a cloud-based database because it takes care of the underlying infrastructure and resources management. Initially, we planned to use Firebase because of its ease of use. Still, after some consideration, we decided it'd be best to use a schema-based database and chose MongoDB Altas instead. 

### Gitlab

The ability to freely experiment with changes on the project was important to us. We felt that the forking workflow works best in this case. Unfortunately, we had trouble getting GitHub to work with the workflow, so we had to switch to GitLab quite early. Luckily, the transition was rather smooth as all teammates have experience using GitLab. Overall, we found GitLab to be a  useful collaboration tool that enables effective communication. You can access our Gitlab repository [here](https://gitlab.com/tuandinh/group-2-rose-rabbit).

## Testing

---

Code were tested two ways: manual testing and automated testing. Manual testing were done using console.logs across the system. Whereas, automated testing were done on both the frontend and backend.

For the frontend, we developed 5 suitcases (comprise of 22 cases) to test all important and viewable components by looking for key components(e.g. buttons) and keywords (e.g. EDIT/ DELETE) that should appear in front of the client. We also developed a test case to check the validity of Mapbox's geocoding API. To run tests:

```java
$cd frontend
$npm test
```

For the backend, we developed 3 testing files (comprise of 30 cases) to test all three API routes: trips, activities, and stays. Each testing file will test on different methods to retrieve the data from API (GET, POST, PUT, DELETE). Due to we are using Auth0, so the testing files are using middleware and JWT to do the testing (refer to task 3 from assignment 1). To run tests:

```java
$cd backend
$npm test
```

## Project Management

---

[Task Breakdown and Weekly Meeting Minutes](https://www.notion.so/Weekly-Summary-Task-Breakdown-3f43d9d145724cce8e4b9b3f50751686)

Git commit history [here](https://gitlab.com/tuandinh/group-2-rose-rabbit/-/commits/master)

---

We found frequent interactions between team members as the most effective way to manage this project. To get the most up to date status, resolve issues, and plan, we used two communication methods:

1) Slack - Slack is a messaging/ collaboration tool that made working together very easily. It is the go-to tool we used for our day-to-day communication. Some of the use cases include:

- sharing demo videos of a completed feature
- sharing useful resources found on the internet
- discuss bugs found in the application
- get feedback on different implementation  ideas

2) Face-to-face(F2F) - F2F meetings were either in-person or on Zoom. We found F2F meetings to be an effective way to discuss medium-to-long-term goals of the project or any conversations that require the consensus of the whole team. For example, if a feature requires two or more people to develop, we found conversations in person helps us plan resources and time quicker than communicating via a messaging app. 

In addition to goal setting, we also found F2F meetings to be an effective way to measure progress. Our development progress is measured weekly on the tasks completed. This allows us to estimate the completion timeline quite accurately.

By asking "what did we do last week" and "what will do next week" we produced meeting minutes which you can find [here](https://www.notion.so/Weekly-Summary-Task-Breakdown-3f43d9d145724cce8e4b9b3f50751686).