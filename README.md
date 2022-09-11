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
`startDate`  Start date in YYYY-MM-DD format, e.g. 2021-01-12<br>
`endDate`    End date in YYYY-MM-DD format e.g. 2021-01-12<br>
`startTS`    Start datetime (unix time, UTC time zone) in millis, e.g. start=1369728000<br>
`endTS`      End datetime (unix time, UTC time zone) in millis, e.g. start=1369728000<br>

>At least one of `startDate` or `startTS` is required

## Functionality
The application takes a log file which maybe several 1000s of MB, and which is provided (for the time being) in the data folder. It reads the contents of the file and provides the necessary response to the user. The codebase is built using only the in-built modules of Node.js. 
```
For reading the file, a readStream is created which doesn't load the entire file to memory and instead reads in chunks of data. A readline interface is used for reading line by line from the readStream.
```

The controller.log-view.js file takes care of the following 4 conditions
#### 1. if the client requests logs between two given datetimes (date as well as time)
The date string is obtained from each line using `split()`. This is compared with the given datetimes. If the datetime is on or after `startTS` and on or before the `endTS`, we send the logs for the date range to our client

#### 2. if the client requests logs between two dates (only date)
Similar logic as the above Condition 1 could have been applied, but here 2 passes of reading the file is done; first we obtain the start and end index of the start and end date by substring search of the line, and on the second pass we push to logs array the lines between the start and end index

#### 3. if the client requests logs for a particular day (date)
Simple substring search to see if line includes the requested date

#### 4. if the client requests logs for a particular time on a particular day (datetime)
Similar to Condition 3, handled with a substring search to see if the ISO date string is present on the line

