## Написание CRUD-операций при работе с базой MS SQL при помощи Typescript и Nodejs
API представлен сервисом RetailService, содержащим несколько методов

На данный момент реализованы:
- get-запросы из таблицы stores (всех элементов и по id) - методы getStore, getStoreById 
- get-запросы из таблицы employees (по id магазинов, к которым приписаны сотрудники) - метод getEmployeesByStoreId
