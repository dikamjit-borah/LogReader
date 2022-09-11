# LogReader

## Tech Stack
>Node.js
### Node.js modules used
>http <br>
>url <br>
>path <br>
>fs <br>
>readline <br>

## Installation
```
npm run start:dev
```
or
```
node server.js
```

## Api
```
http://localhost:8081/log/view
```
### Parameters
>**startDate**  Start date in YYYY-MM-DD format, e.g. 2021-01-12<br>
>**endDate**    End date in YYYY-MM-DD format e.g. 2021-01-12<br>
>**startTS**    Start datetime (unix time, UTC time zone) in millis, e.g. start=1369728000<br>
>**endTS**      End datetime (unix time, UTC time zone) in millis, e.g. start=1369728000<br>

At least one of startDate or startTS is required

## Functionality
The application takes a log file which maybe several 1000s of MB provided for the time being in the data folder. It creates a readStream to read the contents of the file and provide the necessary response to the user. The codebase is built using only the in-built modules of Node.js. The controller.log-view.js file takes care of the following 4 conditions
>if the client requests logs between two given datetimes (date as well as time)date as well as time
>if the client requests logs between two dates (only date)
>if the client requests logs for a particular day (date)
>if the client requests logs for a particular time on a particular day (datetime)
