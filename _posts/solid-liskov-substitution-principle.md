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

What LSP is really saying is: if you were to have a argument that expected a generic type of object, you should be able to pass any sub-type that extends from the parent and the code should still behave as expected.

The reason for the Liskov substitution principle makes more sense if both the [single responsibility principle (SRP)](solid-single-responsibility-principle) and [open-closed principle (OCP)](solid-open-closed-principle) are fully understood. This is because different logic is being extracted out to maintain seperation of concerns (SRP), and classes are being closed to modifcation but left open to extention (OCP) through use of a generic argument in thier constructor.

## Example

Lets begin with a service, in this case a `PasswordResetService` that has the job of sending a `PasswordResetRequest` out to a messaging queue. This service has a generic constructor that expects any implementation of a `Sender` class.

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

`Sender` is a simple generic interface with two methods, one for sending a single message, and one to send a batch of messages. How the sub-classes implement these methods and the underlying technology used will differ from class to class, but our service should be able to trust that all implementations will result in messages being sent to a broker.

```
public interface Sender<T> {

    void send(Collection<T> messages);
    void send(T message)
}

```

Lets create a resource that implements the `Sender` interface.

```
public class KafkaResource implements Sender<Message> {

    private final Producer<String, String> kafkaMessageProducer;

    public KafkaResource(Producer<String, String> kafkaMessageProducer) {
        this.kafkaMessageProducer = kafkaMessageProducer;

    }

    @Override
    public void send(Collection<Message> messages) {
        //logic to prepare messages such as data consistency, setting headers and encryption
        kafkaMessageProducer.send(messages);
    }

    @Override
    public void send(Message message) {
        //logic to prepare message such as data consistency, setting headers and encryption
        kafkaMessageProducer.send(message);
    }

}

```

This `KafkaResource` conforms to the contract of the interface, it has implemented both the expected methods and will correctly result in the `PasswordResetRequest` being sent out.

Now lets imagine that we wish to switch out Kafka with a different message broker such as RabbitMQ, because we are keeping to the open-closed principle and have seperated out the message sending logic from our `PasswordResetService` through our generic `Sender` argument this should be a simple case of implementing a new sub-class of `Sender` that makes use of the alternative message broker and then passing it into the constructor argument for the `PasswordResetService`.

```
public class RabbitMqResource implements Sender<Message> {

    private final Producer<String, String> rabbitMqMessageProducer;

    public RabbitMqResource(Producer<String, String> rabbitMqMessageProducer) {
        this.rabbitMqMessageProducer = rabbitMqMessageProducer;
    }

    @Override
    public void send(Collection<Message> messages) {
        /logic to prepare messages such as data consistency, setting headers and encryption
        kafkaMessageProducer.send(messages);
    }

    @Override
    public void send(Message message) {
        throw new UnsupportedOperationException("to-do set up single messages for RabbitMQ")
    }
}

```

However, while the `RabbitMqResource` has extended the `Sender` class and implemented the correct methods, the `send()` method for individual messages has not been configured. This means that if we were to pass in this new resource as the `Sender` to the `PasswordResetService` the code would compile correctly, but we would find an error being thrown at runtime when our service attempts to send a `PasswordResetRequest` and our program would no longer work as expected.

What the Liskov substitution principle is trying to avoid is cases like this. There is more to conforming to the contract than just implementing the methods. You need to ensure the logic in the classes that implement the interface does not result in unexpected behaviour or different functionality.

In this case, all objects of type sender were expected to be able to send a notification out to another service in order to perform the next step of a process, but the implementation of our sub-classes did not mirror the behaviour correctly. While we could handle the exception in the service and provide a back-up method of sending the request, this would require editing the service class which should be closed to modification.

Recap

- Use generic constructors to enable coding to interfaces
- Any object of the same parent type should be interchangeable, both in implementation and behaviour
- If it looks like a duck and quacks like a duck. Make sure it is definetly a duck

## References

- https://stackoverflow.com/questions/56860/what-is-an-example-of-the-liskov-substitution-principle
