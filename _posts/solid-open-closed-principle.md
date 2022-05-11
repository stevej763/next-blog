---
title: "SOLID - The open-closed principle"
excerpt: "In the second of five in this series on SOILD we are going to delve into the next letter O or the open/closed principle."
coverImage: "/assets/blog/oop/solid-ocp/cover.jpg"
date: "2022-05-10"
category: "OOP"
author:
  name: Steve Jones
  picture: "/assets/blog/authors/steve.png"
ogImage:
  url: "/assets/blog/oop/solid-ocp/cover.jpg"
---

The open-closed principle is another best practice made popular by Uncle Bob through his SOLID principles. It was first introduced by Bertrand Meyer back in 1988. Well written code is code that is reliable, maintainable and extendable. Ensuring your code follows the open-closed principle will go a long way to meeting those priorities.

Meyer introduces the concept with a simple statement: “software entities should be open for extension, but closed for modification”. An entity can mean classes, functions, modules or any other component you can think of that contains code. But that statement alone can be a little confusing. How can something be both open, and closed at the same time?

## Closed for modification

In my reading and learning of the topic, The way I first grasped an understanding of the meaning was when thinking of code that you use daily, but that is written by someone else.

Imagine you have a project that depends on an external package managed by another person or team. For example you are building an application that relies on an external API. You rely on this API heavily for your application and it will not work without it. Then one day the developers of that API decide to change some of the API endpoint URL, or even change the structure of the data being sent by the API. Your application starts throwing strange errors and once you figure out it is because of the change to that external API, you now have to rewrite a large chunk of your application to conform to the new data structure you are receiving.

In this situation the developers behind the API you relied upon were not conforming to the open-closed principle. They had working, production code that users were accessing and they made a change to it. Their API was not closed for modification as it should be.

## Open for extension

In reality most external APIs use versioning to ensure that consumers of legacy versions of their APIs can continue to use them until they are ready to migrate to a later version. For example `api.stevedevblog.com/v1` and `api.stevedevblog.com/v2`. This follows the open-closed principle, the developers did not modify the existing code, but instead extended it.

The fact of the matter is code is a living organism, it is always going to be growing, changing and adapting, weather it be to a new business requirement, or implementing some new tech to help with the speed, efficiency or scalability of your application. This is more true than ever in todays environment with CI/CD pipelines, 'agile' ways of working and a 'fail fast' mentality. It is impossible to foresee every possible change you need to make to your code before having written it, no matter how much forward thinking you do.

## Example

So how do we approach this in our own code? We want to avoid editing existing code, but we need to introduce new functionality or logic. To do this we will need to extend our code and implement the changes that
way. To achieve this there are a few different approaches.

```
public class User {

    protected final String name;
    protected final String email;

    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public String getUserDetails() {
        return String.format("Hello, my name is %s, you can contact me at: %s", name, email);
    }
}

```

Here we have a simple `User` class that contains the users `name` and their `email`. When we first created our application we thought this would be all we need. However, now we want add some functionality to allow different users to have different roles, such as customer or administrator. We could edit the constructor of the `User` class to include a argument for the users role, but that would mean modifying our code. Instead, lets make use of inheritance, one of the four foundational principles of Object Oriented Programming.

```
public class AdminUser extends User {

    private final String accessLevel;

    public AdminUser(String name, String email, String accessLevel) {
        super(name, email);
        this.accessLevel = accessLevel;
    }
}

public class CustomerUser extends User {

    private final String customerNumber;

    public CustomerUser(String name, String email, String customerNumber) {
        super(name, email);
        this.customerNumber = customerNumber;
    }
}

```

We now have a `AdminUser` and a `CustomerUser` that both have a parent class of `User`. These classes share all the properties and methods of the original `User` class, except they can extend the functionality of the parent class by having their own unique properties and methods. We could then add infinite additional types of users without editing any existing code. This is code that is closed for modification, but open for extension.

Another way of approaching this with inheritance would be with interfaces. Our original `User` class will only contain abstract methods we want to ensure its children have implemented. Think of this as a contract between the parent class and its sub-classes. By inheriting the parent class the sub-classes agree to implement their own interpretation of the method.

```
public interface User {
    String getUserDetails();
}

```

Our User class is now an abstract interface, any classes that inherit the `User` must implement the `getUserDetails()` method.

```
public class Customer implements User {

    private final String name;
    private final String email;
    private final String customerId;

    public Customer(String name, String email, String customerId) {
        this.name = name;
        this.email = email;
        this.customerId = customerId;
    }

    @Override
    public String getUserDetails() {
        return String.format("Hello, my name is %s, my customer Id is %s. You can contact me at: %s",
                name, customerId, email);
    }
}

public class Admin implements User {

    private final String name;
    private final String email;
    private final String accessLevel;

    public Admin(String name, String email, String accessLevel) {
        this.name = name;
        this.email = email;
        this.accessLevel = accessLevel;
    }

    @Override
    public String getUserDetails() {
            return String.format("Hello, my name is %s, you can contact me at: %s", name, email);
    }
}

```

There is one exception to the open/closed principle, and that is if you find a bug in existing code. In this case you should make changes to ensure the bug is patched. If the code is not working as expected then you need to make sure it fulfils it's purpose, ensuring you have a have robust set of tests for your code will help with this.
