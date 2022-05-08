---
title: "SOLID - The single responsibility principle"
excerpt: "In the first of 5 posts, we take a look at the the first of the five SOLID principles - the single responsibility principle"
coverImage: "/assets/blog/solid-srp/cover.jpg"
date: "2022-05-08"
category: "OOP"
author:
  name: Steve Jones
  picture: "/assets/blog/authors/steve.png"
ogImage:
  url: "/assets/blog/solid-srp/cover.jpg"
---

The SOLID principles are nothing new. Introduced by Uncle Bob back in 2000, there are more articles than I can count out there on the topic, not to mention the books by the man himself. However, every post brings a different perspective and it seemed like a good place to start for a series of posts on this website. For this article, I am going to begin with the first of the five principles - The Single Responsibility Principle

## Overview

The single responsibility principle or SRP (also sometimes referred to as separation of concerns) is one of the best things you can do to keep your code clean and maintainable. Applied properly, it can save you and the people you work with a lot of headaches. As the name suggests, it means every class should have one job. By this definition it also means that each class should only ever have one reason to change - If I change my database from MongoDB to Postgres, classes that depend on a DAO should continue to work without modification.

Personally when thinking about SRP I also tend to extend this to cover the idea that each method should have one role too, or in the words of Uncle Bob, methods should "Do One Thing". Following this behaviour helps guide you to extract individual components out of a larger complex method and into small, well-named, and self-explanatory methods.

At a high level, the SRP simply means splitting your code out to different classes and giving each class a different job to do. For example, a controller class that handles HTTP requests should not care how the data received in the request is stored and persisted in a database. In much the same way, a DAO that handles CRUD operations on a database should not care where the data it has been asked to save came from, or how it needs to format the data it returns to the client when running a query.

If both responsibilities were handled in the same class, things would get over-complicated and difficult to follow very quickly, it would also mean that every time you made a change to one part of the code, you risk breaking another part. In other words your code will become rigid, making a change in a seemingly unrelated module could cause a cascade of side effects throughout your codebase.

## Benefits

### Testing

A big benefit of following SRP if you are a fan of test-driven-development as I am, is the fact that each class has far less logic to test. If a class only has one responsibility, you have then removed all the other variables from your test cases, meaning fewer tests are needed and the tests themselves will be much simpler. It also allows your unit tests to use mocked dependencies, which you can verify are called upon in the right scenarios. By stubbing responses from these mocked dependencies you can also make sure you are purely tests the unit-level logic of the class you are working on. The tests will never fail because of a bug in an external class.

### Decoupling

Decoupling of the code by splitting out separate areas of logic will reduce the dependencies your classes have on one another. Instead of one class requiring a long list of dependencies - possibly from different modules - to fulfil its many roles, it will only require the bare minimum to complete it's task, then pass the responsibility over to another class to manage a different concern. This idea of high cohesion and low coupling is another very important principle, but one for another post, for now here is a [medium article on the topic](https://medium.com/clarityhub/low-coupling-high-cohesion-3610e35ac4a6) if you are interested.

### Structure

Structuring your codebase may not seem like a top priority in a small personal project. However as a project grows, the length of your files expand and the number of classes increase, being able to quickly search and find a specific piece of code can save a lot of time. Well named, concise classes will enable you to quickly track down a bug or find an example of some logic you wish to expand upon or emulate. Even in a relatively small project such as this site, if I had a class called `PersonalBlogApp` that in one file handled everything from controller methods, domain logic, database queries, utility methods and so on. It would be much harder to track down the bit of code that handles parsing HTML from markdown, as compared to having a `markdownToHtml` file that specifically handles converting a string of markdown into the equivalent HTML. I immediately know where to look or can very quickly track down the file with a search.

## Example

The best way I find of really beginning to understand these concepts is with a coded example. What follows is a very simple implementation of the single responsibility principle at work. Imagine we have a application that needs to handle some user input, in this case through the command-line, but the concept would work the same way if it was from an HTTP request, messaging service or any other form of client. Here we have a class called `CommandLineInputHandler`. This class receives some input in the form of a string, and the end goal is to have this text saved to a database somewhere after it has been sanitised, such as trailing spaces or non-standard characters and removed, maybe even something to prevent Remote Code Execution (RCE).

```
public class CommandLineInputHandler implements InputHandler {

    private final UserInputService userInputService;

    public CommandLineInputHandler(UserInputService userInputService) {
        this.userInputService = userInputService;
    }

    @Override
    public void handle(String input) {
        userInputService.storeSanitisedText(input);
    }
}
```

Following the single responsibility principle, the `InputHandler` does one thing. It passes the string of text onto a `UserInputService`. Exactly what this service does, the `CommandLineInputhandler` does not know or care, it does one job, receives the input, and pass it onto the service.

Following on from this we can see what the `UserInputService` is doing with the text. It has two dependencies, `TextSanitiser` and `UserInputDao`.

```
public class UserInputService {

    private final TextSanitiser textSanitiser;
    private final UserInputDao userInputDao;

    public UserInputService(TextSanitiser textSanitiser, UserInputDao userInputDao) {
        this.textSanitiser = textSanitiser;
        this.userInputDao = userInputDao;
    }

    public void storeSanitisedText(String text) {
        String sanitisedText = textSanitiser.sanitise(text);
        userInputDao.save(sanitisedText);
    }
}
```

Our service, while having very little complex logic of its own, orchestrates the storage of the text. It requests for the text to be sanitised by the `TextSanitiser`, how this is managed it does not know, but it knows it will receive a string back from the `TextSanitiser`. It then calls the `save()` method on the `UserInputDao` to have the data inserted into the database. Which kind of database the service does not know or care as that is not it's responsibility.

## Recap

- Each class should only have one responsibilty (Do one thing)
- There should only ever be one reason for a class to change
- Decoupling your classes will reduce dependencies
- Organise and name classes (and methods) approprietly
- Testing will be much easier

### References:

- https://blog.cleancoder.com/uncle-bob/2020/10/18/Solid-Relevance.html
- https://www.baeldung.com/solid-principles
- http://principles-wiki.net/principles:single_responsibility_principle
