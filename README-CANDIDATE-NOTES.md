Hi there,

The test took overall around 12 hours, mostly to set up the cli and jest and manually test the code, the actual coding part was the most fun part, and it took around 6 hours :)

Was a really fun exercise, and the most interesting part was the alerting and how to recover etc.  

I used OCLIF provided by Heroku, which is a nice framework to get started quickly when building a CLI.

I took the liberty of naming the CLI "Winnielog", it's just a silly name I came up with when building the project. 

####Tested on

I used [flog](https://github.com/mingrammer/flog) to test in real-time the log generation and how the app is performing.

MacOS was the platform I've tested on, using Node v10.15.0.  

####Improvements I'd make on the code:
- End-to-end tests, adding a sample file generating some logs and checking the results of the command
- There should be also a webpage generated from the code, to provide a much better UI. I found out that I can also provide a website after I've started implementing the code, so I didn't have time to rewrite the whole code using a framework such as [nestJS](https://nestjs.com/).
- Dependency injection framework (maybe the dependency injection of nestJS) 
- Local in memory db to keep historical data, and each module (alerts, traffic etc.) would be a separate recurring task that would be triggered separately. 
