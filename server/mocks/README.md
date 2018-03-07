# Mocks

Add the calls to be mocked to the apiv6 folder.

Example:

```javascript
let mocks = [
    {
        method: "get",
        pattern: new RegExp("^/me/paymentMean/deferredPaymentAccount$"),
        handler: (req, res) => {
            res.json([3]);
        }
    },
    {
        method: "get",
        pattern: new RegExp("^/me/paymentMean/deferredPaymentAccount/([0-9]+)$"),
        handler: (req, res, params) => {
            let accountId = params.pop();
            if (parseInt(accountId, 10) === 3) {
                res.json({creationDate: "2017-05-24T16:32:25+02:00", id: 3, label: "Compte spécial de test", description: "", state: "valid"});
            } else {
                res.status(404).json({ error: `The requested object (id = ${accountId}) does not exist` });
            }
        }
    }
];

export default mocks
```