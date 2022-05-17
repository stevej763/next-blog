---
title: "SOLID - The interface segregation principle"
excerpt: "The penultimate SOLID principle. Here we take a look at what the interface segregation principle means and how we can best follow it"
coverImage: "/assets/blog/oop/solid-isp/cover.jpg"
date: "2022-05-15"
category: "OOP"
author:
  name: Steve Jones
  picture: "/assets/blog/authors/steve.png"
ogImage:
  url: "/assets/blog/oop/solid-isp/cover.jpg"
---

Interface segregation - as the name suggests - is about splitting out large interfaces into smaller, role-based abstractions. The idea behind this is to stop forcing classes that may need one element of an interface, to conform to other unwanted method implementations too. In other words "clients should not be forced to depend upon interfaces that they do not use". Looking back at the Leskov substitution principle, you can see where this may come in handy.

So when and how should we make use of the interface segregation principle. Generally I think this should be quite clear. If you find your interfaces are starting to get rather large with many required methods and especially if not all of the methods are needed by every class that inherits the interface, then it is probably violating the interface segregation principle and you should begin to extract different roles from your interface.

A very common example I have seen is the idea of a bank account. Lets say we have an interface for a generic `Account` class.

```
public interface Account {

    BigDecimal withdraw(BigDecimal amount)
    BigDecimal deposit(BigDecimal amount)
}

```

Our Account interface contains two methods, an option to `withdraw` an amount and an option to `deposit`. Now lets look at an implementation of this class.

```
public CurrentAccount implements Account {

    //properties and constructor

    @Override
    BigDecimal withdraw(BigDecimal amount) {
        // logic to withdraw money from customers account
    }

    @Override
    BigDecimal deposit(BigDecimal amount) {
        // logic to withdraw money from customers account
    }
}

```

With this one instance of the Account interface we might think the interface does the job well and ensures any sub-class of the `Account` type will conform to the contract. However, what happens if later on we are asked to implement a fixed-term savings account?

```
public FixedTermSavings implements Account {

    //properties and constructor

    @Override
    BigDecimal withdraw(BigDecimal amount) {
        throw new UnsupportedMethodException("Cannot withdraw from a fixed-term savings account");
    }

    @Override
    BigDecimal deposit(BigDecimal amount) {
        // logic to withdraw money from customers account
    }
}

```

While it makes sense for our `FixedTermSavings` account to implement the `Amount` interface, it should not have use of the `withdraw` method as a customer should not be able to withdraw on-demand until the term is up. Because of this the `FixedTermSavings` account should not be forced to implement a method it does not need. So how can we avoid this? This is where role interfaces and segregating our interface out will help.

```
public interface Withdrawable {

    BigDecimal withdraw(BigDecimal amount)

}

public interface Depositable {

    BigDecimal deposit(BigDecimal amount)
}

```

At it's most basic form that is all the interface segregation principle is about, breaking down interfaces that do not just 'do one thing' into smaller, more specific interfaces. Now we could take the `Depositable` and `Withdrawable` interfaces and make use of them only where they are needed.

References:

- https://martinfowler.com/bliki/RoleInterface.html
