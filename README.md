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
### 1. The client requests logs between two given datetimes (date as well as time)
The date string is obtained from each line using `split()`. This is compared with the given datetimes. If the datetime is on or after `startTS` and on or before the `endTS`, we send the logs for the date range to our client

`http://localhost:8081/log/view?startTS=1577844025909&endTS=1577844133845`

```
{
    "statusCode": 200,
    "message": "Log file read successfully",
    "data": {
        "count": 7,
        "logs": [
            "2020-01-01T02:00:25.909Z Querying table projects",
            "2020-01-01T02:00:47.057Z Finished reading projects",
            "2020-01-01T02:01:00.812Z Querying table users",
            "2020-01-01T02:01:18.265Z Response 200 sent to 142.220.133.184 for /example",
            "2020-01-01T02:01:22.875Z Finished reading users",
            "2020-01-01T02:01:50.798Z Querying table posts",
            "2020-01-01T02:02:13.845Z Querying table projects"
        ]
    }
}
```

#### 2. The client requests logs between two dates (only date)
Similar logic as the above Condition 1 could have been applied, but here 2 passes of reading the file is done; first we obtain the start and end index of the start and end date by substring search of the line, and on the second pass we push to logs array the lines between the start and end index

`http://localhost:8081/log/view?startDate=2020-01-01&endDate=2020-01-03`

```
{
    "statusCode": 200,
    "message": "Log file read successfully",
    "data": {
        "count": 11523,
        "logs": [
            "2020-01-01T00:00:40.528Z Finished reading users",
            "2020-01-01T00:01:05.502Z Querying table users",
            .
            .
            .
        ]
     }
}
```

#### 3. The client requests logs for a particular day (date)
Simple substring search to see if line includes the requested date

`http://localhost:8081/log/view?startDate=2020-01-01`

```
{
    "statusCode": 200,
    "message": "Log file read successfully",
    "data": {
        "count": 5788,
        "logs": [
            "2020-01-01T00:00:11.172Z Request received from 211.254.246.209 for /about",
            "2020-01-01T00:00:40.528Z Finished reading users",
            "2020-01-01T00:01:05.502Z Querying table users",
            .
            .
            .
         ]
     }
}
```

#### 4. The client requests logs for a particular time on a particular day (datetime)
Similar to Condition 3, handled with a substring search to see if the ISO date string is present on the line

`http://localhost:8081/log/view?startTS=1577844025909`

```
{
    "statusCode": 200,
    "message": "Log file read successfully",
    "data": {
        "count": 1,
        "logs": [
            "2020-01-01T02:00:25.909Z Querying table projects"
        ]
    }
}
```

