Hi there,

####Here's some notes about the development I've done: 
I used OCLIF provided by Heroku, which is a nice framework to get started quickly when building a CLI. 

####Improvements I'd make on the code:
- I'd include end-to-end tests, adding a sample file generating some logs and checking the results of the command
- Ideally there should be also a webpage generated from the code, to provide a much better UI. I found out that I can also provide a website after I've started implementing the code, so I didn't have time to rewrite the whole code using a framework such as [nestJS](https://nestjs.com/).
- I'd like to use a dependency injection framework (maybe the dependency injection of nestJS) 
- I'd use a local in memory db to keep historical data, and each module (alerts, traffic etc.) would be a separate recurring task that would be triggered separately. 

#### Known issues
