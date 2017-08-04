# Employees Data Service

This Employees Data MBaaS Service contains...

# Group Employees Data Service API

## Get Employees information [/employees?id={id}]
These endpoints have to do with the event data uploaded by RH Marketing Operations

+ Parameters
    + id: 1 (number) - A unique identifier of the employee.

### Retrieve an employee [GET]
Endpoint to obtain the employee object associated with the provided ID
+ Response 200 (application/json)
    + Body
            {
                "type": "1",
                "id" : 123,
                "firstName": "PETER",
                "lastName": "SELLERS",
                "email": "ps@example.com",
                "department": "ACTORS",
                "source": "LOCAL"
            }

## Retrieve employees data [/employees]
These endpoints have to do with querying

### Query employees [POST]
This endpoint return employees matching the provided criteria object.

+ Request (application/json)
    + Body
            {
               "eq" : {
                 "type" : "1"
               }
            }

+ Response 200 (application/json)
    + Body
            [
                {
                    "type": "1",
                    "firstName": "PETER",
                    "lastName": "SELLERS",
                    "email": "ps@example.com",
                    "department": "ACTORS",
                    "source": "LOCAL"
                }
            ]
