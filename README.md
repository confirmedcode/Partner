# Partner Server

This is a private Node.js Express app that hosts the Partner Server `https://partner.[domain]`. It allows Partners to access their referral dashboard to track how their referrals are doing. It is Openly Operated, so user/customer privacy is ensured since all data is provably retrieved and displayed in aggregate, anonymous formats. Partner Server is not viewable to the public and has strict security groups. Partner user accounts are created by the Admin Server.

- [Prerequisites](#prerequisites)
- [Sign In](#sign-in)
  * [Sign In - Web](#sign-in---web)
  * [Sign In](#sign-in-1)
  * [Log Out (Delete Session)](#log-out--delete-session-)
- [Partner User](#partner-user)
  * [Partner - Web](#spartner---web)
  * [Change Partner User Password - Web](#change-partner-user-password---web)
  * [Change Partner User Password](#change-partner-user-password)
- [Other APIs](#other-apis)
  * [Test Error Logging](#test-error-logging)
  * [Health Check](#health-check)
- [Support](#support)

## Prerequisites

* Run the Partner [CloudFormation](https://github.com/confirmedcode/Server-CloudFormation) and all its prerequisites

## Sign In

The `POST /signin` API returns a session cookie. Use the cookie on requests that require authentication. Usually, your HTTP request framework will automatically save this cookie. If the cookie expires or server returns 401, request a new cookie.

### Sign In - Web
__Request__

```
GET /signin
```

### Sign In
__Request__

```
POST /signin
```

Name | Type | Description
--- | --- | ---
`email` | `string` | __Required__ User email.
`password` | `string` | __Required__ User password.

__Response__

```
Set-Cookie: <Cookie with Expiration Time>
```

### Log Out (Delete Session)
__Request__
```
GET /logout
```

__Response__

```
Redirects to /signin
```

## Partner User

### Partner - Web
__Request__

`Authentication Required`

```
GET /partner
```

### Change Partner User Password - Web
__Request__

`Authentication Required`

```
GET /change-password
```

### Change Partner User Password
__Request__

`Authentication Required`

```
POST /change-password
```

Name | Type | Description
--- | --- | ---
`currentPassword` | `string` | __Required__ User's current password.
`newPassword` | `string` | __Required__ User's new password.

__Response__

```
Redirect to /partner
```

## Other APIs

### Test Error Logging
__Request__

```
GET /error-test
```

### Health Check
__Request__

```
GET /health
```

__Response__

```
Status 200
{
	message: "OK from Partner"
}
```

## Feedback
If you have any questions, concerns, or other feedback, please let us know any feedback in Github issues or by e-mail.

We also have a bug bounty program -- please email <engineering@confirmedvpn.com> for details.

## License

This project is licensed under the GPL License - see the [LICENSE.md](LICENSE.md) file for details

## Contact

<engineering@confirmedvpn.com>