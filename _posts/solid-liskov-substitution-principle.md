---
title: "SOLID - The Liskov substitution principle"
excerpt: "In the third entry for the series on the SOLID principles, we look at my favourite. The Liskov substitution principle"
coverImage: "/assets/blog/oop/solid-lsp/cover.jpg"
date: "2022-05-14"
category: "OOP"
author:
  name: Steve Jones
  picture: "/assets/blog/authors/steve.png"
ogImage:
  url: "/assets/blog/oop/solid-lsp/cover.jpg"
---

"If it looks like a duck and quacks like a duck. It might not be a duck."

The Liskov substitution principle is my favourite of all the solid principles. Maybe because it was the hardest for me to wrap my head around initially, or maybe because of how useful I find it. Named after Barbara Liskov. In a sentence, the principle states that you should be able to substitute any object of the same parent type and your program should still work as before.

When I first learned of the Liskov substitution principle I had many misconceptions. I believed the main focus of the principle was to explain how constructors can accept any sub class derived from a parent class. For example, accepting a generic `Object` class as a parameter would allow you to pass any class that is derived from the `Object` class. While that concept is an important part of the principle, it is not what the principle is trying to explain.

What LSP is really saying is: if you were to have a method that expected any `Object` class or its derivatives, you should be able to pass any type that extends from `Object` and your code should not break and everything should function as expected.

## Example

```
public interface Sender<T> {
    void send(Collection<T> message);
}

```

Here I start with a very simple object, an interface called `Sender`. I am setting this up as the generic class that all my message senders are going to inherit from. Anything that implements my `Sender` class is going to execute the logic for a message to be sent using a broker such as Kafka or RabbitMQ. They will all have a method called `send()`, how they implement that method will differ from class to class.

Lets create two resources that implement the `Sender` interface.

```
public class KafkaResource implements Sender<Message> {

    private final Producer<String, String> kafkaMessageProducer;

    public KafkaResource(Producer<String, String> kafkaMessageProducer) {
        this.kafkaMessageProducer = kafkaMessageProducer;

    }

    @Override
    public void send(Message message) {
        //logic to prepare message such as data consistency, setting headers and encryption
        kafkaMessageProducer.send(message);
    }
}

public class ArchiveResource implements Sender<ArchiveRequest> {

    private final ArchiveService archiveService;

    public ArchiveResource(ArchiveService archiveService) {
        this.archiveService = archiveService;
    }

    @Override
    public void send(ArchiveRequest message) {
        archiveService.save(message);
    }
}

```

Here I have created two implementations of the `Sender` class. While both conform to the contract of the interface by implementing the `send()` method, they both clearly do very different things. The first acts as an adapter between Kafka and the domain, passing messages to a Kafka producer to be sent. While the second request sends some data to be archived in a database. While we would be technically able to pass either of these through as a `Sender` the resulting output would be very different and likely lead to unexpected behaviour.

```
public class PasswordResetService {

    private Sender sender;

    public PasswordResetService(Sender sender) {
        this.sender = sender;
    }

    public void sendPasswordResetLink(PasswordResetRequest request) {
        sender.send(request);
    }
}

```

Here we are implanting a use case for the `Sender` by using it as a method of requesting a password reset email to be send to a user. The constructor of the `PasswordResetService` has requested a class of type `Sender` but has correctly been coded to an interface to allow for different implementations of the `Sender` class to be passed in. If we were to pass in either of our above implementations the code would compile and run seemingly without error. However, while the Kafka resource would produce the expected result of sending a request out to an email service to send the password reset email to the user. The Archive resource would result in no message reaching the email service, and so the code would not function as expected.

What the Liskov substitution principle is trying to avoid is cases like this. There is more to conforming an interfaces contract than just implementing the methods. You need to ensure the logic in the classes that implement the interface does not result in unexpect behaviour or different functionality. In this case, all objects of type sender were expected to be able to send a notifcation out to another service in order to perform the next step of the process. However, because the ArchiveResource also implemented the `send()` method it could be successfully passed into the argument at the point our `PasswordResetService` was constructed without error, but unable to perform the task expected of a `Sender`

Recap

- Any object of the same parent type should be interchangable
- If it looks like a duck and quacks like a duck. Make sure it is definetly a duck
- Use generic constructors to enable coding to interfaces

## References

- https://stackoverflow.com/questions/56860/what-is-an-example-of-the-liskov-substitution-principle
