<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
    <title>Login page</title>
    <link href="<c:url value='/geodash/vendor/bootstrap.css' />"  rel="stylesheet">
    <link href="<c:url value='/geodash/app/styles/app.css' />" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/css/font-awesome.css" />
    <style>
        html{
            background-color:#2F2F2F;
        }

        body, #mainWrapper {
            height: 100%;
            background-image: -webkit-gradient(
                    linear,
                    right bottom,
                    right top,
                    color-stop(0, #EDEDED),
                    color-stop(0.08, #EAEAEA),
                    color-stop(1, #2F2F2F),
                    color-stop(1, #AAAAAA)
            );
            background-image: -o-linear-gradient(top, #EDEDED 0%, #EAEAEA 8%, #2F2F2F 100%, #AAAAAA 100%);
            background-image: -moz-linear-gradient(top, #EDEDED 0%, #EAEAEA 8%, #2F2F2F 100%, #AAAAAA 100%);
            background-image: -webkit-linear-gradient(top, #EDEDED 0%, #EAEAEA 8%, #2F2F2F 100%, #AAAAAA 100%);
            background-image: -ms-linear-gradient(top, #EDEDED 0%, #EAEAEA 8%, #2F2F2F 100%, #AAAAAA 100%);
            background-image: linear-gradient(to top, #EDEDED 0%, #EAEAEA 8%, #2F2F2F 100%, #AAAAAA 100%);
        }

        body, #mainWrapper, .form-control{
            font-size:12px!important;
        }

        #mainWrapper {
            height: 100vh;
            padding-left:10px;
            padding-right:10px;
            padding-bottom:10px;
        }

        #authHeaderWrapper{
            clear:both;
            width: 100%;
            height:3%;
            padding-top:5px;
            padding-bottom:5px;
        }

        .login-container {
            margin-top: 100px;
            background-color: floralwhite;
            width: 40%;
            left: 30%;
            position: absolute;
        }

        .login-card {
            width: 80%;
            margin: auto;
        }
        .login-form {
            padding: 10%;
        }
    </style>
</head>

<body>
<div id="mainWrapper">
    <div class="login-container">
        <div class="login-card">
            <div class="login-form">
                <c:url var="loginUrl" value="/login" />
                <form action="${loginUrl}" method="post" class="form-horizontal">
                    <c:if test="${param.error != null}">
                        <div class="alert alert-danger">
                            <p>Invalid username and password.</p>
                        </div>
                    </c:if>
                    <c:if test="${param.logout != null}">
                        <div class="alert alert-success">
                            <p>You have been logged out successfully.</p>
                        </div>
                    </c:if>
                    <div class="input-group input-sm">
                        <label class="input-group-addon" for="username"><i class="fa fa-user"></i></label>
                        <input type="text" class="form-control" id="username" name="ssoId" placeholder="Enter Username" required>
                    </div>
                    <div class="input-group input-sm">
                        <label class="input-group-addon" for="password"><i class="fa fa-lock"></i></label>
                        <input type="password" class="form-control" id="password" name="password" placeholder="Enter Password" required>
                    </div>
                    <input type="hidden" name="${_csrf.parameterName}"   value="${_csrf.token}" />

                    <div class="form-actions">
                        <input type="submit"
                               class="btn btn-block btn-primary btn-default" value="Log in">
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

</body>
</html>