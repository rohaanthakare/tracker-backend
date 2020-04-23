db.getCollection('accounttransactions').remove({});
db.getCollection('banks').remove({});
db.getCollection('branches').remove({});
db.getCollection('contacts').remove({});
db.getCollection('contacttransactions').remove({});
db.getCollection('financialaccounts').remove({});
db.getCollection('masterdatas').remove({});
db.getCollection('masterviews').remove({});
db.getCollection('passwords').remove({});
db.getCollection('roles').remove({});
db.getCollection('users').remove({});
db.getCollection('usertransactions').remove({});

db.getCollection('roles').insert({
    "_id" : ObjectId("5ea045ca8e4aae116cff015d"),
    "roleCode": "ADMIN",
    "roleName": "Admin",
    "roleDesc": "Admin for system"
});

db.getCollection('users').insert(
    {
        "_id" : ObjectId("5ea045cb8e4aae116cff0160"),
        "username" : "admin",
        "password" : "$2a$10$bNk0n4LVEqcMOEURwSLe4uNNCKuTui6juzNAZ3FxHhP/QwmN1JFV6",
        "emailId" : "admin@admin.com",
        "mobileNo" : 8,
        "role" : ObjectId("5ea045ca8e4aae116cff015d"),
        "status" : ObjectId("5ea045c68e4aae116cff00e9"),
        "firstName" : "admin",
        "activation_otp" : 223871,
        "isSystemAdmin" : true,
        "created_at" : ISODate("2020-04-22T13:25:31.845Z"),
        "updated_at" : ISODate("2020-04-22T13:25:31.845Z")
    }
);