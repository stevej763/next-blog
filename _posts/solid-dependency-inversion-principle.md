---
title: "SOLID - The dependency inversion principle"
excerpt: "The fifth and final SOLID principle, the dependency inversion principle guides you to think about how to lay out your application and which classes should depend on what"
coverImage: "/assets/blog/oop/solid-dip/cover.jpg"
date: "2022-05-19"
category: "OOP"
author:
  name: Steve Jones
  picture: "/assets/blog/authors/steve.png"
ogImage:
  url: "/assets/blog/oop/solid-dip/cover.jpg"
---

I admit for the longest time I believed the dependency inversion principle was simply about injecting dependencies into the constructor of a class - as do many other junior developers. Turns out I had over-simplified the principle and while dependency injection is an important aspect, it is more about what you are passing in, not whether you are.

There are two key parts of the dependency inversion principle.

1. High level modules should not be dependant on low-level modules. Instead they should use abstractions - think of open-closed and the Liskov substitution principle.
2. Abstractions should not depend on details. Details should depend on abstractions.

Following these guides will help you to build highly cohesive, yet loosely coupled applications, where your complex logic is not dependent on the environment it runs in and will be plug-and-play with any adapters.

Lets lay out an example. A HTTP controller that calls on a service to run some kind of calculation, store some data retrieved from a user and return some kind of response to the user. The service will also be using a repository to then persist the calculation to the database.

```
@RestController
@RequestMapping("/calculate")
public class CalculationController {


    @PostMapping("add")
    public ResponseEntity<CalculationDto> calculate(CalculationRequest calculationRequest) {
        CalculationService calculationService = new CalculationService();
        CalculationDto result = calculationService.runTheNumbers(calculationRequest);

        return ResponseEntity.ok(result);
    }
}

```

So this doesn't look so bad right? Until we want to modify `CalculationService`, then we have to come into `CalculationController` to make those changes. Why should we have to make changes to a REST controller in order to change the service, and what if the service had parameters in the constructor we might want to change, again we would need to have access to them in the controller class. That is violating a number of SOLID principles as well as general object oriented principles.

- Single responsibility principle - every class should only have one job and one reason to change. We have multiple reasons to change the controller
- Open-closed principle - classes should be open to extension, but closed to change. If we want to pass in a different argument to the CalculationService, we have to come in and modify to `calculate` method in the controller.
- Liskov substitution - any sub-types of a parent should be interchangeable. All the classes in the example are concrete implementations (I can instantiate them using the `new` keyword)

In this state our dependency tree looks something like this: Controller > Service > Repository > Dao.

So lets start to fix this and put our high-level modules at the top of the tree, starting with the controller. Lets invert the dependencies and decouple the `CalculationService` from it.

```
@RestController
@RequestMapping("/calculate")
public class CalculationController {

    private final CalculationService calculationService;

    public CalculationController(CalculationService calculationService) {
        this.calculationService = calculationService;
    }

    @PostMapping("add")
    public ResponseEntity<CalculationDto> calculate(CalculationRequest calculationRequest) {
        CalculationDto result = calculationService.runTheNumbers(calculationRequest);

        return ResponseEntity.ok(result);
    }
}


```

By passing the `CalculationService` in as an argument to the `CalculationController` constructor, the controller now depends on the `CalculationService` to be initialised. To go a step further we could create an interface for the service as we may have different implementations of the service we want to use, then following the Liskov substitution principle we could use the abstract interface as the constructor argument.

The dependency tree has now started to flip around and will look something like this: Controller < Service > Repository > Dao.

A good start. Now lets look at our service class.

```
public class CalculationService {

    public CalculationDto runTheNumbers(CalculationRequest calculationRequest) {
        //secret algorithms that make millions
        CalculationRepository calculationRepository = new CalculationRepository();
        calculationRepository.save(calculationRequest);
        return new CalculationDto(12345);
    }
}

```

The service is our higher level module, it is where the business logic of our codebase lives. After running through some kind of algorithm we construct an instance of the `CalculationRepository` and call the `save()` method to store the data in the database, but again we have things backwards and violating the open-closed and Liskov principles. So lets make a constructor for our service and expect a repository interface that will include the `save()` method on it. Our `CalculationService` should not need to know anything about the repository being used, with a quick configuration change we should be able to plug in a different repository class.

```
public class CalculationService {

    private Repository calculationRepository;

    public CalculationService(Repository calculationRepository) {
        this.calculationRepository = calculationRepository;
    }

    public CalculationDto runTheNumbers(CalculationRequest calculationRequest) {
        //secret algorithms that make millions
        calculationRepository.save(calculationRequest);
        return new CalculationDto(12345);
    }
}

```

We have now moved the repository out into the constructor of the service. Additionally, rather than relying on the concrete implementation of the `CalculationRepository`, we only require the repository to implement the `Repository` interface that will ensure it includes the `save()` method. This satisfies both the open-closed and Liskov substitution principles. We can now change the repository implementation our service uses without ever having to change the service or controller classes.

The dependency tree has now started to flip around and will look something like this: Controller < Service < Repository > Dao.

Finally we have the Repository class which just needs the Dao to insert the data into our database. The structure should look very similar now.

```
public class CalculationRepository {

    private Dao calculationDao;

    public CalculationRepository(Dao calculationDao) {
        this.calculationDao = calculationDao;
    }

    public void save(CalculationRequest calculationRequest) {
        calculationDao.insert(calculationRequest);
    }
}

```

And there we have it, our dependency tree has been completely flipped around and will now look like this: Controller < Service < Repository < Dao.

Now our classes are completely decoupled from each other and depend on abstractions of a type of interface rather than a concrete implementation.

One of the benefits this will have is when unit testing our application. We can easily inject mock instances of the interface in to the class we are testing and stub out any methods we expect to be called and provide a response.
